# Bewly_Nocturne 设计语言

## 品牌定位

**Bewly_Nocturne**，中文定位为“夜曲设计”，是一款围绕个人浏览习惯持续打磨的 Bilibili 浏览器扩展。项目追求安静、连贯、细腻的界面体验：减少突兀的视觉反馈，让导航、设置和内容浏览保持统一节奏，同时保留用户对原版 Bilibili 与定制页面的选择权。

品牌名称在 README、扩展名称、设置界面、发布产物和问题模板中统一写作 `Bewly_Nocturne`。包名使用适合工具链的 `bewly-nocturne`。

## 设计原则

### 安静而清晰

界面以内容为中心。装饰用于建立层级和状态，不制造额外注意力；高亮、模糊、阴影和发光效果应克制，并在浅色与深色模式下保持可读性。

### 连贯而灵动

同类控件共享一致的尺寸、圆角、动效时长和交互反馈。展开、收起、选中、悬停及页面切换都应有连续的状态变化，避免瞬间出现或消失的视觉断层。

### 精细但不过度

优先复用全局 token、通用组件和既有布局结构。视觉校正应有明确理由，不通过堆叠阴影、重复容器或额外安全分支掩盖结构问题。

### 可持续同步

Bewly_Nocturne 保留自身品牌和 UI 决策，同时持续吸收 BewlyCat 的底层修复。上游同步必须经过独立审查分支；冲突按文件和行为逐项处理，不使用整批 `ours` 或 `theirs` 策略。

## 品牌边界

本次品牌更新覆盖：

- 项目与扩展的用户可见名称；
- `package.json` 的包名、描述和主页；
- README、维护文档、问题模板与 CI 产物名称；
- 设置页、关于页、刷新提示及其他用户可见文案；
- 个人仓库名称与对应链接：`STERILITZIA02/Bewly_Nocturne`；
- 本地 `origin` 更新为新的个人仓库地址。

为保护现有安装和用户数据，以下兼容标识保持不变：

- 存储键、设置字段和迁移逻辑；
- DOM ID、CSS 选择器和 Shadow DOM 容器名称；
- 内部事件名、消息协议及浏览器扩展兼容标识；
- 明确指向 BewlyCat 或 BewlyBewly 的上游署名、Issue 链接与代码注释；
- `upstream`、`contrib` 远程及用于纯上游跟踪的分支。

## 文档结构

项目文档保持精简，并由 README 提供统一入口：

```text
docs/
├── README.md
├── development.md
├── deployment.md
├── design-language.md
└── maintenance/
    └── upstream-workflow.md
```

- `README.md`：项目定位、特色、快速开始、文档入口、来源与许可；
- `docs/README.md`：文档索引和阅读路径；
- `docs/development.md`：环境要求、开发命令、目录结构和质量检查；
- `docs/deployment.md`：本地加载、Chrome/Firefox 打包和 GitHub Release 清单；
- `docs/design-language.md`：品牌、视觉原则和兼容边界；
- `docs/maintenance/upstream-workflow.md`：个人仓库与上游镜像的同步规则。

删除三份重复且过时的贡献指南，以及已经完成使命的历史设计稿和实施计划。许可文件、Agent 操作守则和上游同步规则不得因文档精简而丢失。

## 发布边界

部署文档只覆盖可在本地复现的浏览器扩展流程：开发模式加载、生产构建、产物检查、ZIP 打包和 GitHub Release。浏览器商店密钥、账户凭据及自动提交流程不进入公开文档。

## 验收标准

- 除品牌迁移说明外，用户可见位置不再显示旧品牌 `BewlyMac`；
- `Bewly_Nocturne` 的拼写和下划线在所有用户可见位置保持一致；
- 内部兼容标识未因改名而变化；
- README 中的命令、路径和文档链接可以对应到实际文件；
- 文档不存在重复章节、失效链接、占位内容或已完成的一次性计划；
- `pnpm lint` 和 `pnpm typecheck` 通过；
- `origin` 只指向个人仓库，`upstream` 与 `contrib` 的 URL 和职责保持不变。
