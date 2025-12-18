+++
title = "Git分支"
weight=2
date = 2025-12-18
draft = false
tags=["Git"]
+++
### `git branch`

- `git branch`查看当前所有分支的列表`*`标识当前所在分支
- `git branch -v`查看分支最后一次提交
- `--merged` `--no-merged`过滤出已/未合并到当前分支的分支
- `git branch <name>`创建分支
- `git branch -d <name>`删除已合并工作的分支
- `git branch -D <name>`强制删除分支
- `git branch -vv`查看设置的所有跟踪分支
<br>

### `git switch`

- `git switch`能完成的任务`git checkout`都能完成<br>但`git switch`更加安全更加现代更推荐使用
- `git switch <name>`切换到已存在的分支
- `git switch -c <name>`若分支存在只切换,若不存在创建后切换<br>(`git checkout -b <name>`)
<br>

### `git merge`

- `git merge <name>`合并`<name>`分支到所在分支<br>若合并分支是所在提交的直接后继,以`fast-forward`方式合并
<br>

### `git status`

- 查看因包含冲突而未合并的文件
<br>

### `git add`

- 将有冲突的文件标记为冲突已经被解决
<br>

### `git fetch`

- `git fetch`拉取数据的同时会更新远程跟踪分支
<br>

### `git push`

- `git push <remote> <branch>`推送本地分支到远程
- `git push <remote> <branch>:<branchname>`推送本地分支到命名不同的远程分支
- `git push <remote> --deelete <branch>`删除远程分支<br>该命令基本上只移除指针,通常Git服务器保留一段时间数据
<br>

### `git checkout`

- `git checkout -b <branch> <remote>/<branch>`远程仓库的跟踪分支基础上创建分支并切换<br>可以简写为`git checkout --track <remote>/<branch>`创建远程分支同名分支并切换
- 若尝试`checkout`的分支不存在且远程仅唯一名字匹配可使用`git checkout <branch>`
- `-u` `--set-upstream-to`显式设置已有分支跟踪拉取的远程分支或修改上游分支

### `git rebase`

- `git rebase <branch>`将所在分支的补丁和修改变基到`<branch>`分支上
- `git rebase --onto <branch1> <branch2> <branch3>`<br>选中在`<branch3>`不在`<branch2>`的补丁修改变基到`<branch3>`上
- `git rebase <remote>/<master>`基于远程重新排布