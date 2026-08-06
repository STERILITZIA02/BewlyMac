# AGENTS.md

BewlyCat：基于 BewlyBewly 的 bilibili 浏览器扩展（Vue 3 + TS + Vite + UnoCSS，包管理用 `pnpm`）。

## 命令

- `pnpm lint` / `pnpm lint:fix`
- `pnpm typecheck`
- 验证时不执行任何 `build` 操作；开发阶段使用 `pnpm dev` 持续编译与验证。
- 构建产物：Chrome/Edge → `extension/`，Firefox → `extension-firefox/`

仅当本次任务实际执行 `git commit` 时，提交前必须通过：

```sh
pnpm lint
pnpm typecheck
```

未执行 `git commit` 时，不要求运行上述检查。

## 结构（速查）

- `src/background/`：后台、消息与 API
- `src/contentScripts/`：页面注入主逻辑（入口 `index.ts`）
- `src/components/`：TopBar / Dock / VideoCard / Settings 等
- `src/stores/`、`src/logic/storage.ts`：状态与设置
- `src/manifest.ts`：manifest
- `src/_locales/`：i18n
- 主 UI 跑在 Shadow DOM 内，注意样式隔离

## 样式规范

### Token 与复用

- 全局视觉 token 统一维护在 `src/styles/variables.scss`，不要在页面组件中重复定义同义尺寸、字号、字重或状态颜色。
- 紧凑胶囊、标签栏、分段选择器和图标切换器使用 `src/styles/segmentControl.scss` 的 `.bew-segment-control` / `.bew-segment-control__item` 基础类；页面组件只负责定位、宽度和响应式布局。
- 使用液态指示器时，选项必须包含 `data-segment-item`，激活项使用 `data-active="true"`；无液态指示器的分组增加 `.bew-segment-control--static`。
- 液态指示器统一使用 `src/components/LiquidSegmentIndicator.vue`，页面不要重复调用 `useLiquidSegmentIndicator` 或手写 `.bew-liquid-indicator` DOM；组件通过 `active-key` 接收当前值，必要时用组件 ref 调用 `updateIndicator(true)`。
- 同一行的同类控件必须使用一致的 surface 变体、外层高度、padding、gap、圆角、阴影和交互状态，避免一个透明、一个悬浮或各自维护胶囊样式。
- 通用组件 token 使用 `--bew-control-*` / `--bew-segment-*` 命名；仅真正局限于 TopBar 的变量才使用 `--bew-top-bar-*`。

### 排版

- 基础界面文字限定为：caption `12/16px`、control `13/18px`、body `15/24px`、title `15/22px`、heading `20/28px`，优先使用对应的 `--bew-font-size-*` 和 `--bew-line-height-*` token。
- 品牌锁定字等极少量展示文字使用 `--bew-font-size-display`，比分等大号数据使用 `--bew-font-size-data/data-emphasis`；图标字体只使用 `--bew-icon-size-sm/md/lg/xl`。这些不参与正文层级，也不要用任意字号模拟。
- 字重仅使用 `400/500/600/700` 对应的 `--bew-font-weight-regular/medium/semibold/bold`；不要新增 `650`、裸写 `bold` 或其他中间值。
- 正文默认 `400`，次要强调和普通按钮用 `500`，标签/卡片标题/区块标题用 `600`，`700` 仅用于品牌文字、强标题和少量关键数字。
- 页面主标题复用 `.bew-page-heading`，不要在页面里重复组合字号、字重和行高。
- 同组标签的未选中与选中状态保持相同字重，依靠颜色、背景和液态指示器表达状态，避免切换字重导致文字宽度和指示器跳动。
- 新样式不要混用无语义的 px/rem 字号；确需特殊字号时应先判断能否扩充语义 token。

### 紧凑控件

- 默认规格：外层高 `36px`、padding `4px`、gap `4px`、内部项高 `28px`、文字 `13/18px 600`、图标 `16px`。
- 普通文字项水平 padding 为 `12px`；页面主标签使用 `.bew-segment-control__item--wide` 的 `16px`；纯图标项使用 `.bew-segment-control__item--icon`。
- 必须覆盖 default、hover、focus-visible、active、disabled 状态；不要移除键盘焦点反馈。
- `src/styles/main.scss` 提供全局 `focus-visible` 兜底；组件可以细化焦点环，但只有在提供等价反馈时才能覆盖或移除。
- 点击目标不得小于 `24 × 24 CSS px`，普通文本与背景对比度目标不低于 `4.5:1`。

### 间距

- 布局使用 `4px` 基准网格，优先选用 `--bew-space-*`：`4/8/12/16/20/24/32/40/48px`。
- `2px` token 仅用于边框、焦点环和光学微调，不用于常规容器 padding 或同级元素 gap。
- 紧密内联元素使用 `4px`，控件内部或紧凑列表使用 `8px`，关联元素组使用 `12px`，组件/栏位之间使用 `16–24px`，页面区块之间使用 `32–48px`。
- 同层级的卡片、列表和工具栏必须使用相同 gap；避免新增 `3/5/7/10/14/18px` 等一次性布局间距。确有视觉校正需求时需保留局部注释说明原因。
- 区分容器 padding 与同级元素 gap，不用子元素 margin 拼接公共布局间距。

### 圆角

- 圆角使用 `--bew-radius-sm/half/md/lg/xl/2xl/full`（`4/6/8/12/16/24px/full`），不要直接新增 `5/7/10/20/999px` 等一次性值。
- 优先使用语义 token：卡片 `--bew-card-radius`、媒体封面 `--bew-media-radius`、普通面板 `--bew-panel-radius`、Dialog/设置窗口等大型模态容器 `--bew-modal-radius`、顶栏 Pop/浮层 `--bew-popover-radius`、普通交互项 `--bew-interactive-radius`、徽标/胶囊 `--bew-badge-radius`。
- 视频卡片、动态卡片和同层级内容卡片默认使用 `12px`；内部按钮/菜单项通常使用 `8px`；小型状态块和骨架条使用 `4–6px`；头像等真实圆形可使用 `50%`。
- 父子元素需要共享裁切轮廓时，子元素使用 `inherit`；不要通过 `calc(父圆角 - 任意像素)` 猜测内层圆角。
- 同一个 Pop、卡片或媒体容器的四角必须来自同一语义 token，局部直角仅允许用于明确的相邻拼接结构。
- 胶囊与面板之间需要动画时，不要直接从 `--bew-radius-full` 插值；起始值应使用胶囊真实几何半径，结束值使用语义圆角，避免大数值被持续裁切后在动画末尾突然跳变。

### Pop 与浮层

- 顶栏搜索、设置搜索、搜索筛选等同类 Pop 默认与触发控件等宽，并复用 `.bew-popover-surface`；不要在组件内重复维护背景、边框、圆角、阴影和毛玻璃参数。
- Pop 与视口或所属主面板至少保留 `8px` 安全边距；窄屏允许扩展到所属内容区的安全宽度，但不能依赖固定宽度越界后再裁切。
- 结果数量可能变化的 Pop 必须根据下方可用空间限制 `max-height`，内容超出时只在 Pop 内部滚动，并使用 `overscroll-behavior: contain` 避免滚动穿透。

## 工具约束

- **Chrome DevTools MCP**：仅在用户**主动要求排查/调试页面**时使用；非必要不要用。仅当本机已安装且可调用 chrome-devtools-mcp 时参考相关能力；未安装/未开启则整节忽略。

## 提交规范

- 标头遵循 Conventional Commits：`<type>(<scope>)!: <description>`；`scope` 和表示破坏性变更的 `!` 均为可选项
- 支持的 `type`：
  - `feat:`：新增功能
  - `fix:`：修复问题
  - `docs:`：仅修改文档
  - `style:`：仅调整格式，不改变代码行为
  - `refactor:`：重构代码，不新增功能也不修复问题
  - `perf:`：性能优化
  - `test:`：新增或调整测试
  - `build:`：构建系统或依赖变更
  - `ci:`：CI 配置或脚本变更
  - `chore:`：其他维护性变更
  - `revert:`：回退既有提交
  - `merge:`：将 PR 或分支合并到目标分支
- 冒号后说明用中文，准确概括改动
- 合并 PR 时使用 `merge: 合并 PR #<number> <标题>`
- 有对应 [issue](https://github.com/keleus/BewlyCat/issues) 时在 commit 后附 `#{issue}`
- PR 不要提交 tests 文件和 `AGENTS.md`

## 双仓库开发守则

完整流程见[上游协作流程](docs/maintenance/upstream-workflow.md)和[双仓库上游协作设计](docs/superpowers/specs/2026-08-05-dual-repository-upstream-workflow-design.md)。以下规则对未来 Agent 强制生效：

- 开始任何写入前，必须执行并阅读 `git status --short --branch`、`git remote -v` 和 `git branch -vv`；remote URL、当前分支或追踪关系与文档不符时，停止写入并报告。
- 必须先按任务类型选择基线：BewlyMac 品牌、外观、交互、个人定制、`port/*` 和 `sync/*` 从最新 `origin/main` 创建；可独立贡献给 BewlyCat 的 `fix/*` 从最新 `upstream/main` 创建。
- 推送目标必须与任务类型一致：`fix/*` 只能推送到 `contrib`，BewlyMac 功能、`port/*` 和 `sync/*` 只能推送到 `origin`，永远不得推送到 `upstream`。未经用户明确授权，不得 push 或创建、合并 PR。
- 处理上游修复前，必须用 `git merge-base --is-ancestor upstream/main HEAD` 检查 ancestry，并用 `git log --oneline upstream/main..HEAD` 与 `git diff --stat upstream/main...HEAD` 检查提交和差异范围；发现 BewlyMac 定制内容时不得推送。
- 移植修复只能在从 `origin/main` 创建的 `port/*` 上使用 `git cherry-pick -x <sha>`，并检查 `origin/main...HEAD` 的提交与 diff；不得 merge 整个 `fix/*`。
- 同步上游只能在从 `origin/main` 创建的 `sync/*` 上显式执行 `git merge --no-ff upstream/main`，不得在 `main` 直接 merge。
- 冲突必须逐项、逐块审查。复杂或语义不明确的 UI 冲突必须停止操作、列出行为差异并请求用户决定；不得整文件选择 ours/theirs，也不得使用 blanket ours/theirs 策略。
- 必须保护用户已有的 staged、unstaged、untracked 和 stash 内容。未经明确授权，禁止 reset、clean、删除分支或 Worktree、改写历史以及其他 destructive Git 操作。
- 上游 PR 必须排除 BewlyMac 专用 `AGENTS.md`、品牌化 `README.md`、维护文档、构建或打包产物，以及与修复无关的格式化；只包含可独立提交给 BewlyCat 的最小修复。
- 实际执行 commit 前必须重新运行 `pnpm lint` 和 `pnpm typecheck`；只有各命令最新一次完整运行的退出码均为 `0`，才能声明检查通过。

## Bewly_Nocturne 当前维护记录

- 2026-08-06：完成顶栏模式切换重构。顶栏模式现作为 `DockAndSidebar.vue` 的特殊配置项，复用既有全局模式、顶栏状态和 Bilibili Evolved 兼容逻辑；旧的搜索框下方悬浮切换器、Teleport、显隐控制、层级、设置项及废弃文案已清理。
- 顶栏模式配置不属于 Dock 导航项，不参与拖拽排序，不显示“新标签页”选项；旧设置会迁移并继续持久化，自定义顶栏选择与全 Bewly / 全原版模式保持同步。
- 本次变更已在独立测试 Chrome 窗口中加载开发扩展并通过 Bilibili 页面注入验收。后续涉及上游顶栏实现的更新默认不批准，必须先取得用户明确授权后再移植或合入。
- 2026-08-06：深色网页背景统一使用受 OKLCH 明度/色度约束的 `--bew-dark-page-bg` 派生 token；`enableOledDarkMode` 仅在有效深色主题下通过 `oled-dark` class 生效，并同步到相关 iframe。首页不再直接覆盖 Bilibili `body` 背景，纯黑底色由插件自己的 viewport wrapper 承载，以保护原站布局和滚动层。
- 顶栏主题色泛光与 `useLinearGradientThemeColorBackground` 共用同一持久化选择；顶栏设置页的兼容入口也绑定该共享状态，避免再维护独立开关。

## 通用工程原则

- 不保留向后兼容。过时实现直接删除，不增加兼容层、迁移脚本或 fallback。
- 选择能满足当前需求的最简单实现；不做预防性抽象，不增加多余的配置层。
- 分层架构逐步建设：先跑通最小端到端版本，再逐层扩展；不要为了尚未完成的复杂度拆掉可运行的部分。
- 保持组件模块化，严格进行关注点分离。
- 优先使用成熟且持续维护的库；没有明确理由不要自行重写。
- 先检查项目现有依赖能提供什么，再考虑引入新包或自行实现；不要先假设已有库无法满足需求。
- 架构决策面向长期维护，不接受“先这样以后再换”的临时方案。
- 先参考成熟产品解决同类问题的已验证模式，避免从零发明。
