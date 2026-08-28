---
title: "Asyncio"
date: 2026-08-28
draft: false
weight: 1
tags: ["Python"]
series: ["Python"]
series_order: 1
---

异步要解决的是 I/O 密集型问题：如何高效地等待大量网络事件，而不必给每个请求都开一条线程。线程数量一旦上去，往往在 socket 耗尽之前，内存或其他线程资源就先撑不住了。

## 出发点：等待，而不是计算

爬虫、网关这类程序大部分时间在等内核说“这个 fd 可读了”。线程把等待藏进阻塞调用，但线程的开销昂贵。事件循环用 `selector` 同时盯着许多 fd，谁就绪就让谁继续——前提是等待期间不能一直占着调用栈不放。

## 回调式异步

把“连上了再干什么”“读到了再干什么”拆成方法，注册进 selector。控制流因此不再是一条直线。

```python
import socket
from selectors import DefaultSelector, EVENT_WRITE, EVENT_READ

selector = DefaultSelector()
urls_todo = set(["/"])
seen_urls = set(["/"])
stopped = False

class Fetcher:
    def __init__(self, url):
        self.response = b""
        self.url = url
        self.sock = None

    def fetch(self):
        self.sock = socket.socket()
        self.sock.setblocking(False)
        try:
            self.sock.connect(("xkcd.com", 80))
        except BlockingIOError:
            pass
        selector.register(self.sock.fileno(), EVENT_WRITE, self.connected)

    def connected(self, key, mask):
        selector.unregister(key.fd)
        request = "GET {} HTTP/1.0\r\nHost: xkcd.com\r\n\r\n".format(self.url)
        self.sock.send(request.encode("ascii"))
        selector.register(key.fd, EVENT_READ, self.read_response)

    def read_response(self, key, mask):
        global stopped
        chunk = self.sock.recv(4096)
        if chunk:
            self.response += chunk
            return
        selector.unregister(key.fd)
        links = self.parse_links()
        for link in links.difference(seen_urls):
            urls_todo.add(link)
            Fetcher(link).fetch()
        seen_urls.update(links)
        urls_todo.remove(self.url)
        if not urls_todo:
            stopped = True

def loop():
    while not stopped:
        events = selector.select()
        for event_key, event_mask in events:
            callback = event_key.data
            callback()
```

这样写有两个硬伤。一是回调地狱：状态散落在 `connected` / `read_response` 里，整段逻辑再也串不回一条直线。二是 stack ripping：异常抛出时，调用栈已经不是写下 `fetch()` 的那一层，上下文丢了，调试会变得很困难。

## 可暂停的对象

要简化回调，关键是找到能在 I/O 阻塞时暂停、在 selector 报就绪后恢复的对象。CPython 的 `PyFrameObject` 分配在堆上，由解释器分配、GC 销毁，于是帧栈生命周期可以和一次函数调用的生命周期解开。这就是生成器的底层事实，也是协程的本质——早期 `@asyncio.coroutine` 就是生成器，后来的语法更干净。

## Future、Task 与事件循环

把 `Fetcher.fetch` 改成生成器：I/O 结果和回调收进可等待对象 `Future`，外面再用 `Task` 不断 `send(result)` 驱动它。流程变成：

1. Task 驱动 fetcher 走到第一次 `yield future` 后暂停；
2. 期间向 selector 注册监听与 callback；
3. event loop 发现 I/O 就绪，callback 唤醒 Task；
4. Task 继续 `send`，直到 `StopIteration`。

```python
class Future:
    def __init__(self):
        self.result = None
        self._callbacks = []

    def add_done_callback(self, fn):
        self._callbacks.append(fn)

    def set_result(self, result):
        self.result = result
        for fn in self._callbacks:
            fn(self)

class Fetcher:
    def __init__(self, url):
        self.response = b""
        self.url = url
        self.sock = None

    def fetch(self):
        sock = socket.socket()
        sock.setblocking(False)
        self.sock = sock
        try:
            sock.connect(("xkcd.com", 80))
        except BlockingIOError:
            pass
        f = Future()
        def on_connected():
            f.set_result(None)
        selector.register(sock.fileno(), EVENT_WRITE, on_connected)
        yield f
        selector.unregister(sock.fileno())
        request = "GET {} HTTP/1.0\r\nHost: xkcd.com\r\n\r\n".format(self.url)
        sock.send(request.encode("ascii"))
        while True:
            f = Future()
            def on_readable():
                f.set_result(sock.recv(4096))
            selector.register(sock.fileno(), EVENT_READ, on_readable)
            chunk = yield f
            selector.unregister(sock.fileno())
            if chunk:
                self.response += chunk
            else:
                break
        sock.close()

class Task:
    def __init__(self, coro):
        global task_count
        self.coro = coro
        task_count += 1
        f = Future()
        f.set_result(None)
        self.step(f)

    def step(self, future):
        global task_count, stopped
        try:
            next_future = self.coro.send(future.result)
        except StopIteration:
            task_count -= 1
            if task_count == 0:
                stopped = True
            return
        next_future.add_done_callback(self.step)

task_count = 0
```

`loop` 仍然只做一件事：`select` 到事件就调 callback。真正把生成器往前推的，是 Task。

## `yield from` 与 await

生成器委托让子生成器看起来像普通调用。给 `Future` 写 `__iter__`，它就能出现在 `yield from` 右边，于是 `yield from f` 与 `yield f` 被收成同一种等待。再往后，语法上就把这件事写成 `await`。

```python
class Future:
    def __init__(self):
        self.result = None
        self._callbacks = []

    def add_done_callback(self, fn):
        self._callbacks.append(fn)

    def set_result(self, result):
        self.result = result
        for fn in self._callbacks:
            fn(self)

    def __iter__(self):
        yield self
        return self.result

def read(sock):
    f = Future()
    def on_readable():
        f.set_result(sock.recv(4096))
    selector.register(sock.fileno(), EVENT_READ, on_readable)
    chunk = yield from f
    selector.unregister(sock.fileno())
    return chunk

def read_all(sock):
    chunks = []
    chunk = yield from read(sock)
    while chunk:
        chunks.append(chunk)
        chunk = yield from read(sock)
    return b"".join(chunks)
```

`Fetcher.fetch` 里连接写成 `yield from f`，读整页写成 `self.response = yield from read_all(sock)`。冒到 Task 的仍然是 `Future`，`Task.step` 不用改。

## 回看 `async def`

回到现在的写法，`async def` 定义协程。`create_task` / `gather` 造出已经交给 event loop 的 Task。`await Task` 是等一个已在 loop 里跑的驱动器结束；`await` 普通协程是当前 Task 里做一次类似 `yield from sub_generator` 的委托；`await Future` 与最初的 `yield f` 同一件事。Task 负责往前推，loop 负责在 I/O 上叫醒它。
