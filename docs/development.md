# 开发指南

## 环境要求

- Node.js 当前 LTS 版本；
- `pnpm 11.17.0`；
- Chrome、Edge 或 Firefox 的当前稳定版本。

安装依赖：

```sh
pnpm install --frozen-lockfile
```

## Chromium 开发

启动持续编译：

```sh
pnpm dev
```

开发产物会写入 `extension/`。可以打开 `chrome://extensions` 或 `edge://extensions`，启用开发者模式并选择“加载已解压的扩展程序”；也可以在另一终端启动独立测试浏览器：

```sh
pnpm start:chromium
```

## Firefox 开发

```sh
pnpm dev-firefox
```

开发产物位于 `extension-firefox/`。可以在另一终端运行：

```sh
pnpm start:firefox
```

也可以打开 `about:debugging#/runtime/this-firefox`，选择“临时载入附加组件”，再选择 `extension-firefox/manifest.json`。

## 项目结构

```text
src/
├── background/        后台服务、消息与 API
├── components/        Dock、TopBar、Settings、VideoCard 等组件
├── composables/       可复用状态与交互逻辑
├── contentScripts/    页面注入入口与视图
├── logic/             存储与跨模块逻辑
├── stores/            Pinia 状态
├── styles/            全局 token 与共享样式
└── _locales/          用户可见本地化文案
```

扩展清单由 `src/manifest.ts` 根据 `package.json` 生成。主要 UI 位于 Shadow DOM 内，新增样式时需要同时考虑样式隔离、暗色模式和原版页面兼容性。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | Chromium 开发模式持续编译 |
| `pnpm dev-firefox` | Firefox 开发模式持续编译 |
| `pnpm lint` | ESLint 检查 |
| `pnpm lint:fix` | 修复可自动处理的 lint 问题 |
| `pnpm typecheck` | Vue 与 TypeScript 类型检查 |
| `pnpm knip` | 检查未使用的文件、导出和依赖 |

## 质量要求

提交前至少运行：

```sh
pnpm lint
pnpm typecheck
```

开发验证使用 `pnpm dev`。不要用生产构建代替交互验证；涉及 Dock、TopBar、Settings 或页面模式的改动，还需要在测试浏览器中复核浅色、深色、刷新和页面切换状态。

## 兼容边界

品牌改动只覆盖用户可见名称和项目链接。存储键、设置字段、DOM ID、CSS 选择器、内部事件、消息协议及既有 `bewly`/`bewlycat` 兼容标识不得随品牌名重命名，否则可能破坏现有配置或扩展升级。

上游同步和冲突处理规则见[上游同步](maintenance/upstream-workflow.md)。
