# BewlyMac

BewlyMac 是一个面向个人使用习惯定制的 Bilibili 浏览器扩展。它仍是浏览器扩展，不是 macOS、桌面或移动客户端。

## 来源与维护

BewlyMac 基于 [BewlyCat](https://github.com/keleus/BewlyCat) 开发；BewlyCat 基于 [BewlyBewly](https://github.com/BewlyBewly/BewlyBewly)。本仓库保留原项目历史和贡献者信息。

本项目会继续选择性合并 BewlyCat 上游更新。无冲突的更新正常接收；与 BewlyMac 定制行为冲突时，经人工审查后保留本地定制。

维护者的分支、Fork、cherry-pick 与上游同步流程见[上游协作流程](docs/maintenance/upstream-workflow.md)。

## 本地构建

```sh
pnpm install
pnpm dev
```

Chrome 生产版及 ZIP：

```sh
pnpm build
pnpm pack:zip
```

构建目录为 `extension/`，压缩包为 `extension.zip`。

## 许可

本项目使用[基于 MIT 并附加使用限制的自定义许可](LICENSE)。额外限制包括禁止将项目封装、转换或发布为独立客户端。复制、修改或分发本项目时，必须保留适用的版权声明与许可文本。
