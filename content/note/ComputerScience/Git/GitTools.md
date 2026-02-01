+++
title = "Git工具"
weight=3
date = 2025-01-18
draft = false
tags=["Git"]
+++
### `git reflog`

- 查看引用日志(记录了最近几个月HEAD和分支引用指向的历史)
<br>

### `git show`

- `git show <branch>@{n}`查看某分支n次前指向的提交
- `git show <branch>@{time}`查看某分支在一定时间前的位置
- `git show <commit>^`解析为该引用的第一父提交
- `git show <commit>^n`适用于合并提交,指明哪一个提交
- `git show <commit>~`与`git show <commit>^`等价
- `git show <commit>~n`根据指定次数获得第一父提交
<br>

### `git log`

- `git log <branch1>..<branch2>`查看在`<branch2>`而不在`<branch2>`的提交 
- `git log <branch1> ^<branch2>` `git log <branch1> --not <branch2>`<br>相比`..`适用于多分支查看的情况
- `git log <branch1>...<branch2>`查看在`<branch1>`或在`<branch2>`但不是两者共有的提交<br>`git log --left-right <branch1>...<branch2>`显示提交属于哪一侧的分支
- `git log -S`显示新增和删除该字符串的提交
- `git log -G`正则表达式搜索得到更精确的结果
- `git log -L`展示代码中一行或一个函数的历史
<br>

### `git add -i(--interactive)`

- 进入交互式终端模式进行暂存
```powershell
git add -i
       staged      unstaged path
1:  unchanged       +0/-1 filename
2:     ......       ......

*** Command ***
  1. [s]tatus   2. [u]pdate    3. [r]evert   4. [a]dd untracked
  5. [p]atch    6. [d]iff      7. [q]uit     8. [h]elp
What now>
```
<br>

### `git stash`

- `git stash` `git stash push`将工作区和暂存区贮藏推到栈上
- `git stash list`查看贮藏的东西
- `git stash apply`应用最近的贮藏的工作区
- `git stash apply --index`应用储藏的工作区和暂存区
- `git stash apply <stashname>`应用指定的贮藏
- `git stash drop`删除堆栈上的贮藏
- `git stash --keep-index`贮藏同时保留已暂存内容在索引中
- `git stash --include-untracked/-u`贮藏未跟踪文件(不包括`ignore`)
- `git stash --all/-a`贮藏所有文件
- `git stash --patch`交互式贮藏
- `git stash branch <new branchname>`创建新分支检出贮藏工作时提交
<br>

### `git clean`

- `git clean -f-d`移除工作目录中未跟踪文件及空子目录(不包括`ignore`)
- `git clean --dry-run/-n -d`做演习展示将要移除什么
- `-x`选项将`ignore`文件包含在移除部分
- `git clean -i`交互式运行clean命令
<br>

### `git grep`

- 查找工作目录的文件
- `git grep -n/--line-number`输出匹配行的行号
- `git grep -c/--count`输出概述的信息
- `git grep -p/--show-function`输出匹配字符串所在的函数
- `git grep --and`查看复杂的字符串组合
<br>

### `git commit`

- `git commit --amend`修改最近一次提交的提交信息
<br>

### `git rebase`

- `git rebase -i <branch>~num`交互式修改最近num次提交信息
```powershell
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log message
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified). Use -c <commit> to reword the commit message.
```

### `git filter-branch`

- `git filter-branch --tree-filter 'rm -f <filename> <branch>'`从整个提交历史中移除文件
- `git filter-branch --subdirectory-filter <directory>`让<directory>作为每个提交的新项目根目录
