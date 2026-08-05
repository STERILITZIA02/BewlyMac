# Bewly_Nocturne

> 夜曲设计 · 为 Bilibili 打磨一套安静、连贯、细腻的浏览体验。

Bewly_Nocturne 是一款以个人使用习惯为中心持续维护的浏览器扩展。它在保留 Bilibili 原有能力的同时，重新整理页面导航、Dock、设置与视觉反馈，让常用操作保持一致节奏，并允许用户在原版页面、Bewly 页面和自定义配置之间自由选择。

## 体验

- 以“夜曲设计”为核心，强调克制的层级、平滑的状态变化和统一的交互反馈；
- 保留 Bewly_Nocturne 的 Dock、页面模式切换与设置体验；
- 继续吸收 BewlyCat 的底层修复，对涉及本地 UI 决策的冲突逐项审查；
- 仅作为浏览器扩展维护，不提供桌面端、移动端或其他客户端封装。

## 快速开始

需要 Node.js 当前 LTS 版本与 `pnpm 11.17.0`。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

开发产物位于 `extension/`。可以在 Chromium 扩展管理页加载该目录，或在另一终端运行：

```sh
pnpm start:chromium
```

## 文档

| 文档 | 内容 |
| --- | --- |
| [文档导航](docs/README.md) | 推荐阅读路径与文档职责 |
| [开发指南](docs/development.md) | 环境、命令、目录结构与质量要求 |
| [构建与发布](docs/deployment.md) | 本地加载、打包与 GitHub Release 流程 |
| [夜曲设计语言](docs/design-language.md) | 品牌定位、视觉原则与兼容边界 |
| [上游同步](docs/maintenance/upstream-workflow.md) | BewlyCat 镜像和选择性同步规则 |

## 来源与维护

Bewly_Nocturne 基于 [BewlyCat](https://github.com/keleus/BewlyCat) 开发；BewlyCat 基于 [BewlyBewly](https://github.com/BewlyBewly/BewlyBewly)。本仓库保留原项目历史与贡献者信息。

个人版本发布于 [STERILITZIA02/Bewly_Nocturne](https://github.com/STERILITZIA02/Bewly_Nocturne)。用于跟随上游的 BewlyCat Fork 保持原名和纯净历史，不承载 Bewly_Nocturne 品牌或界面定制。

## 许可

本项目使用[基于 MIT 并附加使用限制的自定义许可](LICENSE)。额外限制包括禁止将项目封装、转换或发布为独立客户端。复制、修改或分发时必须保留适用的版权声明与许可文本。
