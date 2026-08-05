# 上游协作流程

本文约定 BewlyMac 与 BewlyCat 上游之间的分支、Fork、修复移植和同步流程。所有命令都应在确认当前工作区无误后执行。

## Remote 职责

- `origin`：`STERILITZIA02/BewlyMac`，BewlyMac 外观定制版的开发与发布仓库。
- `upstream`：`keleus/BewlyCat`，只读原上游，用于获取更新并作为上游 PR 目标；禁止向其推送。
- `contrib`：`STERILITZIA02/BewlyCat`，BewlyCat 的正式贡献 Fork，只承载可提交给上游的修复分支。

开始工作前先确认状态、remote 和当前分支：

```sh
git status --short --branch
git remote -v
git branch -vv
```

## 创建上游修复

从最新的 `upstream/main` 创建 `fix/<issue>-<slug>` 临时 Worktree：

```sh
git fetch --multiple --prune upstream contrib origin
git worktree add .worktrees/fix-<issue> -b fix/<issue>-<slug> upstream/main
cd .worktrees/fix-<issue>
git merge-base --is-ancestor upstream/main HEAD
```

提交上游修复前检查提交和文件范围：

```sh
git log --oneline upstream/main..HEAD
git diff --stat upstream/main...HEAD
```

`fix/*` 只推送到 `contrib`：

```sh
git push -u contrib HEAD
```

PR 的目标固定为 `keleus/BewlyCat:main`，来源为 `STERILITZIA02:fix/<issue>-<slug>`。PR 只能包含可独立贡献给 BewlyCat 的最小修复，不得夹带 BewlyMac 品牌、外观或维护文件。

## 移植底层修复

需要立即将底层修复带回 BewlyMac 时，从最新的 `origin/main` 创建 `port/<issue>-<slug>`，并使用 `-x` 记录来源提交：

```sh
git fetch --multiple --prune origin contrib upstream
git switch -c port/<issue>-<slug> origin/main
git cherry-pick -x <fix-sha>
git diff --stat origin/main...HEAD
git log --oneline origin/main..HEAD
git push -u origin HEAD
```

`port/*` 只推送到 `origin`。不得把整个 `fix/*` 分支 merge 到 BewlyMac。

## 同步上游

批量接收上游更新时，从最新的 `origin/main` 创建 `sync/*`，并显式保留 merge 提交：

```sh
git fetch --multiple --prune upstream origin
git switch -c sync/upstream-YYYYMMDD origin/main
git merge --no-ff upstream/main
```

`sync/*` 只推送到 `origin`。禁止在 `main` 直接 merge `upstream/main`。

## 冲突处理

冲突必须逐文件、逐项审查，并检查最终 diff。普通底层冲突按修复意图逐块解决；简单 UI 冲突应保留 BewlyMac 现有结构并最小化吸收上游修复。复杂或语义不明确的 UI 冲突应暂停 merge 或中止 cherry-pick，列出两个版本的行为差异并请求用户决定。

禁止使用 `git merge -X ours`、`git merge -X theirs`、全局 merge driver 或整批文件统一选择 ours/theirs。不得为了消除冲突而重构无关文件。

## 验证与清理

任何实际 commit 前都必须运行：

```sh
pnpm lint
pnpm typecheck
```

只有各命令最新一次完整运行的退出码均为 `0`，才能声明检查通过。

清理临时 Worktree 前，先回到仓库主工作区并确认目标 Worktree 没有未提交修改：

```sh
git -C .worktrees/fix-<issue> status --short
git worktree remove .worktrees/fix-<issue>
```

只有第一条命令没有输出时才能执行移除；禁止使用 `--force` 绕过检查，也不得批量删除 Worktree 或用户分支。
