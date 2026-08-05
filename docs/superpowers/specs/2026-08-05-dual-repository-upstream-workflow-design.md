# BewlyMac 双仓库上游协作设计

## 目标

将外观定制版与上游贡献流程拆成两个职责清晰的 GitHub 仓库：

- `STERILITZIA02/BewlyMac` 是独立仓库，承载品牌、外观和个人定制功能。
- `STERILITZIA02/BewlyCat` 是 `keleus/BewlyCat` 的正式 Fork，只承载可提交给原上游的底层修复。

本地共享同一套 Git 历史，通过独立远程、受约束的分支基线和临时 Worktree 隔离两类开发。底层修复可以精确移植到 BewlyMac，同时避免把 BewlyMac 的 UI 定制带入上游 PR，或在同步上游时静默覆盖本地外观。

## 仓库与远程

| Remote | GitHub 仓库 | 权限与职责 |
| --- | --- | --- |
| `origin` | `STERILITZIA02/BewlyMac` | 可读写；BewlyMac 外观版的唯一发布来源 |
| `upstream` | `keleus/BewlyCat` | 只读；获取原上游更新和 PR 目标 |
| `contrib` | `STERILITZIA02/BewlyCat` | 可读写；正式 Fork 和上游修复分支来源 |

不得向 `upstream` 推送。`contrib/main` 只跟随 `upstream/main`，不得包含 BewlyMac 品牌、外观或个人设置。

当前本地远程名称与目标语义相反。迁移时先将现有 `origin` 重命名为 `upstream`，再将现有 `fork` 重命名为 `origin`，最后添加 `contrib`。远程重命名必须保留已有远程跟踪引用和分支，不删除现有分支，也不改写提交历史。

## 分支模型

### BewlyMac 正式分支

- `main`：只跟踪 `origin/main`，代表可发布的 BewlyMac 外观版。
- 普通 BewlyMac 功能分支：从 `origin/main` 创建，只推送到 `origin`。
- 现有 `codex/chrome-package` 保留为当前品牌与外观候选分支。迁移配置本身不直接重写 `origin/main`；如果它继续领先 `origin/main`，应通过 BewlyMac 仓库内的独立审查流程合入。

### 上游修复分支

- 命名：`fix/<issue>-<slug>`。
- 基线：只能从最新的 `upstream/main` 创建。
- 推送：只能推送到 `contrib`。
- PR：目标固定为 `keleus/BewlyCat:main`，来源为 `STERILITZIA02:fix/<issue>-<slug>`。
- 内容：只包含可独立提交给原上游的底层修复，不包含 BewlyMac 品牌、Dock、TopBar、Settings 等定制差异，除非相关 UI 本身就是被上游接受的修复范围。

### 修复移植分支

- 命名：`port/<issue>-<slug>`。
- 基线：从最新的 `origin/main` 创建。
- 输入：使用 `git cherry-pick -x <sha>` 精确引入一个或一组经过确认的底层修复提交。
- 输出：推送到 `origin`，经 BewlyMac 自身审查后合入 `origin/main`。

`-x` 会在提交信息中记录来源 SHA，便于后续识别该修复是否已经包含在上游同步中。不得把整个 `fix/*` 分支 merge 到 BewlyMac。

### 上游同步分支

- 命名：`sync/upstream-YYYYMMDD`。
- 基线：从最新的 `origin/main` 创建。
- 输入：显式 merge 最新的 `upstream/main`，保留上游提交历史。
- 输出：只推送到 `origin`，完成代码检查和 UI 复核后再合入 `origin/main`。

BewlyMac 的公开 `main` 不做 rebase，不通过 force-push 重写历史。不得直接在 `origin/main` 上执行上游 merge。

## Worktree 隔离

主工作区默认用于 BewlyMac。底层修复在 `.worktrees/fix-*` 临时 Worktree 中完成：

```sh
git fetch --multiple --prune upstream contrib origin
git worktree add .worktrees/fix-<issue> -b fix/<issue>-<slug> upstream/main
```

`.worktrees/` 加入 `.gitignore`。修复合并或放弃后，只有在确认目标 Worktree 无未提交修改时才能移除；不得批量删除 Worktree 或用户分支。

Worktree 的作用是让上游修复始终从 `upstream/main` 开始，并避免开发者为提交 PR 而在主工作区反复切换到不含 BewlyMac 定制的分支。

## 底层修复流

1. 获取 `upstream/main`、`contrib/main` 和 `origin/main` 最新状态。
2. 从 `upstream/main` 创建 `fix/*` Worktree。
3. 只实现与上游问题有关的最小修复，运行项目要求的检查。
4. 推送到 `contrib`，向 `keleus/BewlyCat:main` 创建 PR。
5. 如 BewlyMac 需要立即采用修复，从 `origin/main` 创建 `port/*`。
6. 使用 `git cherry-pick -x` 移植经过确认的修复提交。
7. 检查 `origin/main...port/*` 的文件清单和差异，确保没有引入上游无关 UI。
8. 运行 BewlyMac 检查，必要时进行浏览器目测，再合入 `origin/main`。

如果修复已经进入 `upstream/main` 且不紧急，优先通过下一次 `sync/*` 合入，避免重复移植。同一修复如果已经 cherry-pick 到 BewlyMac，后续上游 merge 时应检查 Git 是否产生等价补丁冲突，不能再次机械 cherry-pick 上游 squash SHA。

## 上游同步流

1. 从最新 `origin/main` 创建 `sync/upstream-YYYYMMDD`。
2. 在该分支合并最新 `upstream/main`。
3. 无冲突文件按 Git 正常结果接收。
4. 对 BewlyMac 定制区域逐文件审查；保留本地产品决策，同时人工吸收上游必要修复。
5. 检查品牌、扩展兼容标识、Dock、TopBar、Settings 和页面切换行为。
6. 运行静态检查和类型检查；涉及 UI 时使用开发构建并目测相关页面。
7. 通过 BewlyMac 自身审查后再合入 `origin/main`。

不得配置全局 `ours` merge driver、整文件忽略规则或 `git merge -X ours/theirs`。这些机制会把安全修复和必要变更一起静默丢弃。

## 冲突处理

- 普通底层文件冲突：按修复意图逐块解决，并检查完整 diff。
- BewlyMac 定制 UI 文件发生简单冲突：保留现有 UI 结构，将上游底层修复最小化移植到当前实现。
- 定制 UI 文件发生复杂或语义不明确的冲突：中止 cherry-pick 或暂停 merge，列出冲突和两个版本的行为差异，由用户取舍。
- 禁止整文件使用 `--ours` 或 `--theirs` 作为默认处理。
- 禁止为了消除冲突而重构无关文件。
- 任何无法证明不会改变现有 UI 的修复，都必须进入 `port/*` 或 `sync/*` 审查，而不能直接提交到 `main`。

## 本地 Git 配置

迁移后设置仓库级配置：

```sh
git config fetch.prune true
git config pull.ff only
git config rerere.enabled true
git config push.default simple
```

`fetch.prune` 清理已删除的远程跟踪引用；`pull.ff only` 防止一次普通 pull 意外产生 merge；`rerere` 复用已经人工确认过的冲突解决；`push.default simple` 要求当前分支与其追踪分支匹配。初次推送 `fix/*` 和 `port/*` 时仍必须明确写出目标 remote。

不设置全局 `remote.pushDefault`，避免首次推送底层修复时误落到 BewlyMac。

## Agent 操作守则

以下规则应写入 BewlyMac 的 `AGENTS.md`，作为未来 Agent 的强制前置检查。该文件只存在于 BewlyMac 维护分支；向原上游提交的 PR 不得携带 BewlyMac 专用 `AGENTS.md` 改动。

### 1. 开始任务前必须确认拓扑

Agent 在修改文件前必须执行并阅读：

```sh
git status --short --branch
git remote -v
git branch -vv
```

如果三个 remote 的 URL 或当前分支追踪关系不符合本文档，停止写入并报告，不得自行猜测目标仓库。

### 2. 先分类任务，再选择基线

- BewlyMac 品牌、外观、交互或个人定制：从 `origin/main` 创建分支。
- 可独立贡献给 BewlyCat 的底层修复：从 `upstream/main` 创建 `fix/*`。
- 将已有底层修复带回 BewlyMac：从 `origin/main` 创建 `port/*`。
- 批量接收上游更新：从 `origin/main` 创建 `sync/*`。

Agent 不得在任务开始后才通过 rebase 或大范围 reset 修正错误基线。发现基线错误时应保留现有提交、停止写入并报告迁移方案。

### 3. 上游修复必须通过祖先检查

创建或恢复 `fix/*` 后必须验证：

```sh
git merge-base --is-ancestor upstream/main HEAD
git log --oneline upstream/main..HEAD
```

如果 `upstream/main` 不是祖先，或提交列表包含 BewlyMac 品牌与 UI 定制，不能推送到 `contrib`，必须重新整理分支。

### 4. 推送目标必须显式匹配任务类型

- BewlyMac 功能、`port/*`、`sync/*`：推送到 `origin`。
- `fix/*`：推送到 `contrib`。
- 永远不向 `upstream` 推送。

初次推送必须显式执行：

```sh
git push -u contrib HEAD
```

或：

```sh
git push -u origin HEAD
```

Agent 在 push 前必须再次展示 `git status --short --branch`、待推送提交和目标 remote。未经用户明确授权，不得 push、创建 PR、合并 PR 或 force-push。

### 5. 上游 PR 范围必须保持纯净

上游 PR 前必须检查：

```sh
git diff --stat upstream/main...HEAD
git log --oneline upstream/main..HEAD
```

PR 不得包含 BewlyMac 品牌、README、专用维护文档、定制 `AGENTS.md`、打包产物或与修复无关的格式化。Agent 只 stage 用户确认属于当前修复的路径，禁止使用 `git add .`、`git add -A` 或 `git add --all`。

### 6. 移植修复必须可追踪

Agent 只能在 `port/*` 使用：

```sh
git cherry-pick -x <sha>
```

cherry-pick 后必须检查：

```sh
git diff --stat origin/main...HEAD
git log --oneline origin/main..HEAD
```

出现 UI 文件冲突时不得直接选择整文件 ours/theirs。简单冲突按最小补丁解决；复杂冲突执行 `git cherry-pick --abort`，保留来源 SHA 并请求用户决定是否手工移植。

### 7. 同步上游必须使用审查分支

Agent 不得在 `main` 直接 merge `upstream/main`。只能在 `sync/*` 执行显式 merge，并在合入前提供：

- 上游新增提交范围。
- 冲突文件清单和每项处理方式。
- BewlyMac 定制文件的最终 diff。
- 静态检查、类型检查和必要的 UI 目测结果。

### 8. 不破坏用户工作区

- 保留用户已有的 staged、unstaged、untracked 和 stash 内容。
- 未经明确授权，不得 reset、clean、删除分支、删除 Worktree 或改写历史。
- 不得通过全局 Git 配置改变其他项目行为；本设计涉及的配置均使用仓库级 `git config`。
- 不得删除兼容性存储键、扩展 ID、事件名或其他为旧用户保留的内部标识。

### 9. 验证要求

- 实际 commit 前遵循项目要求运行 `pnpm lint` 和 `pnpm typecheck`。
- 日常验证不执行生产 build；需要开发编译时使用 `pnpm dev`。
- 上游修复至少验证原问题和受影响模块。
- `port/*` 和 `sync/*` 涉及 UI 时，必须复核现有 BewlyMac 外观和交互未被回退。
- Agent 只能根据刚运行且退出码为零的命令声明检查通过。

## 文档落点

实施阶段创建 `docs/maintenance/upstream-workflow.md`，提供面向维护者的日常命令清单；在精简 README 的“来源与维护”部分增加一个短链接。`AGENTS.md` 增加上述 Agent 守则的精简但完整版本，并链接到维护文档。

不增加自动同步脚本、GitHub Action 或自定义 merge driver。当前规模下，显式命令和可审查分支比自动化更安全，也更容易在上游结构变化时调整。

## 验证

实施后执行以下验证：

1. `origin`、`upstream`、`contrib` URL 与职责完全匹配。
2. `main` 跟踪 `origin/main`，现有功能分支仍然存在。
3. `STERILITZIA02/BewlyCat` 在 GitHub 上显示为 `keleus/BewlyCat` 的 Fork。
4. `contrib/main` 与 `upstream/main` 起点一致或可安全快进。
5. 从 `upstream/main` 创建一次无提交的临时 Worktree，确认路径和基线正确后安全移除。
6. 检查维护文档和 `AGENTS.md` 中不存在错误 remote、模糊 push 指令或 destructive command。
7. 运行 `pnpm lint` 和 `pnpm typecheck`。
8. 检查 Git diff，确认没有修改功能代码、UI、存储结构、扩展标识或许可文本。

## 非目标

- 不在本次迁移中修改 BewlyMac UI 或业务逻辑。
- 不自动把 `codex/chrome-package` 合入 `origin/main`。
- 不自动提交新的上游 PR。
- 不启用自动 merge、自动同步 Fork 或定时任务。
- 不重写 `main`、现有功能分支或已发布提交的历史。
