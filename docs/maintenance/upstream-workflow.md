# 上游同步

Bewly_Nocturne 是个人定制仓库；BewlyCat Fork 只用于跟随原上游。两者共享 Git 历史，但品牌、界面定制和发布内容必须保持隔离。

## Remote 职责

| Remote | 仓库 | 职责 |
| --- | --- | --- |
| `origin` | `STERILITZIA02/Bewly_Nocturne` | Bewly_Nocturne 开发与发布 |
| `upstream` | `keleus/BewlyCat` | 只读原上游 |
| `contrib` | `STERILITZIA02/BewlyCat` | 与原上游保持一致的正式 Fork |

不得向 `upstream` 推送。`contrib/main` 和本地 `codex/upstream-main` 必须只跟随 `upstream/main`，不得包含 Bewly_Nocturne 的品牌、文档、界面或个人设置。

## 开始前检查

```sh
git status --short --branch
git remote -v
git branch -vv
git fetch --multiple --prune origin upstream contrib
```

工作树不干净、remote URL 不一致或分支职责不清楚时，先停止同步并确认现状。

## 更新纯上游镜像

先更新本地只读镜像分支：

```sh
git branch -f codex/upstream-main upstream/main
git branch --set-upstream-to=upstream/main codex/upstream-main
```

确认本地镜像没有差异：

```sh
git rev-list --left-right --count upstream/main...codex/upstream-main
```

预期输出为 `0  0`。随后将同一提交快进到正式 Fork：

```sh
git push contrib refs/remotes/upstream/main:refs/heads/main
git fetch contrib
git rev-list --left-right --count upstream/main...contrib/main
```

最终也必须输出 `0  0`。如果 `contrib/main` 已经产生独有提交，不得 force-push；应停止并先确认差异来源。

## 将上游更新带回 Bewly_Nocturne

从最新个人主分支创建审查分支：

```sh
git switch -c sync/upstream-YYYYMMDD origin/main
git merge --no-ff upstream/main
```

合并后逐项检查上游提交、冲突和最终差异：

```sh
git log --oneline origin/main..HEAD
git diff --stat origin/main...HEAD
```

无冲突文件正常接收。涉及 Dock、TopBar、Settings、页面模式或品牌的冲突，保留 Bewly_Nocturne 的产品决策，再最小化吸收上游必要修复。不得使用整批 `ours`、`theirs` 或全局 merge driver。

完成检查后再将审查结果合入个人 `main`。不得直接在 `main` 上合并 `upstream/main`，也不得把 Bewly_Nocturne 分支推送到 `contrib` 或 `upstream`。

## 验证

```sh
pnpm lint
pnpm typecheck
```

涉及界面时，还需要使用开发构建复核浅色、深色、刷新和页面切换状态。只能根据刚运行且退出码为零的命令声明检查通过。
