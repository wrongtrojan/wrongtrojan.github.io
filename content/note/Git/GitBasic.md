+++
title = "Git基础"
weight=1
date = 2025-12-13
draft = false
tags=["Git"]
+++

### `git config`

- `git config <key>`查看某一项配置
- `git config --list`查看所有配置,`--show-origin`查看配置所在文件
- `git config --global user.name/email`设置用户名和邮件地址
- `git config --global core.editor <editorname> `
- `git config --global alias. <aliasname> <command>`为命令设置别名
- 执行外部命令时可在命令前加`!`设置别名
<br>

### `git status`

- 查看文件状态<br>`Untracked` `Umodified`<br>`Modified` `Staged`
- `-s` `--short`选项缩短输出<br>`__`左栏暂存区,右栏工作区<br>` M`修改未暂存 `M `修改已暂存<br>`A `未修改 `??`未追踪<br>`MM`修改暂存后再修改 
<br>

### `git add`

> *"精确地将内容添加到下一次提交中"*
- 追踪未追踪文件文件 `Untracked`->`Staged`
- 缓存已追踪的文件 `Modified`->`Staged`
- 合并时将有冲突文件标记为已解决
- `git add .`添加所有文件
<br>

### `.gitignore` 文件

- 所有空行或以`#`开头的行被忽略
- Glob模式,递归应用在整个工作区中
- 匹配模式可以以`/`开头防止递归
- 匹配模式可以以`/`结尾指定目录
- 忽略指定模式外的文件或目录,`!`取反

>*Glob模式是常用的路径匹配语法*

| 通配符 | 含义 | 示例 |
| --- | --- | --- |
| `*` | 匹配**当前目录**任意多个字符 |`file*.txt`|
|`**`|匹配**任意层级目录**(递归)|`a/**/z`|
| `?` | 匹配**当前目录**任意一个字符 |`file?.txt`|
|`[abc]`|匹配括号内的**单个指定字符**|`file[abc].txt`|
|`[a-z]`|匹配括号内的**单个范围字符**|`file[0-9].txt`|
|`[^abc]`|匹配**非**括号内的单个字符|`file[^0-9].txt`|

<br>

### `git diff`

- 查看未暂存文件更新部分 `git diff`
- 查看已暂存文件与最后提交差异 `git diff --staged`<br>此处`--staged`与`--cached`同义
<br>

### `git commit`

- 提交暂存区文件,回启动文本编辑器输入提交声明
- `git commit -m ""`将提交信息与命令放在同一行
- `git commit -a`在提交前先进行`git add`操作
- `git commit --amend`用后一次提交代替前一次提交
<br>

### `git rm`

- 放弃追踪并从工作目录中删除文件
- `Modified` `Staged`文件需选项`-f` `--force`强制删除
- 放弃追踪但保留在工作目录,需选项`--cached`
- `git rm`后可列出文件或目录名字,也可以使用`Glob`模式
<br>

### `git mv`

- 给文件改名`git mv file_from file_to`
<br>

### `git log`

- 按时间先后顺序列出所有提交
  
> *`git log`常用选项

| 选项 | 说明 |
| :--- | :--- |
|`-<n>`|仅显示最近的n条提交|
|`--since`,`--after`|仅显示指定时间之后的提交|
|`--until`,`--before`|仅显示指定时间之前的提交|
|`--author`|仅显示作者匹配指定字符串的提交|
|`--committer`|仅显示提交者匹配指定字符串的提交|
|`--grep`|仅显示提交说明包含指定字符串的提交|
|`-S`|仅显示添加或删除内容匹配指定字符串的提交|
|`-p` `--patch`|按补丁格式显示提交引入差异|
|`--stat`|显示每次提交的修改统计信息|
|`--shortstat`|只显示`--state`最后的行数修改添加移除|
|`--name-only`|仅在提交信息后显示已修改的文件清单|
|`--name-status`|显示新增、修改、删除的文件清单|
|`--abbrev-commit`|仅显示SHA-1校验和40个字符中前几个|
|`--relative-date`|使用较短的相对时间显示日期|
|`--graph`|在日志旁以ASCLL图形显示分支与合并历史|
|`--pretty`|使用`online` `short` `full` `fuller` `format`显示信息|
|`--oneline`|`--pretty=oneline --abbrev-commit`合用的简写|

<br>

> *`--pretty=format`常用选项
> (例如`git log --pretty=format:"%h-%an,%ar:%s"`)

| 选项 | 说明 | 选项 | 说明 |
| :--- |  --- | :--- | :--- |
|`%H`|提交的完整哈希值|`%h`|提交的简写哈希值|
|`%T`|树的完整哈希值|`%t`|树的简写哈希值|
|`%P`|父提交的完整哈希值|`%p`|父提交的简写哈希值|
|`%an`|作者名字|`%ae`|作者的电子邮箱地址|
|`%ad`|作者修订日期|`%ar`|相对时间作者修订日期|
|`%cn`|提交者的名字|`%ce`|提交者的电子邮箱地址|
|`%cd`|提交日期|`%cr`|相对时间提交日期|
|`%s`|提交说明|

<br>

### `git reset`

- `get reset HEAD <file>`取消暂存的文件
<br>

### `git checkout`

- `git checkout -- <file>`撤销对文件修改
- `git checkout <tagename>`检出标签查看指向的文件版本(会使仓库处于分离头指针`detached HEAD`状态)
<br>

### `git remote`
  
- 查看远程仓库服务器
- `-v`显示读写远程仓库的Git保存简写与其对应URL
- `git remote add <shortname> <url>`添加一个新的远程Git仓库
- `git remote show <remote>`查看远程仓库更多信息
- `git remote rename`修改远程仓库的简写名
- `git remote remove/rm`移除远程仓库
<br>

### `git fetch`

- `git fetch <remote>`从远程仓库获得数据
- 不会自动合并或修改当前的工作
<br>

### `git pull`

- 自动抓取后合并该远程分支到当前分支
<br>

### `git clone`

- 自动设置本地master分支跟踪克隆的远程仓库master分支
<br>

### `git push`
- `git push <remote> <branch>`将项目推送到服务器
- `git push <remote> <tagname>`将标签推送到服务器
- `git push <remote> --tags`推送所有标签
<br>

### `git tag`

- 在Git中列出已有的标签(若按通配模式匹配需强制使用`-l` `--list`)
- `-a`创建附注标签(`annotated`),`-m`指定信息
- `git tag <tagname>`创建轻量标签(`lightweight`) 
- `git tag <tagname> <hash value>`补加标签
- `git tag -d <tagname>`
<br>

### `git show`

- 查看标签信息以及对应的提交信息
<br>
