# 构建与发布

本文只描述可公开复现的浏览器扩展流程，不包含浏览器商店密钥、账户凭据或自动提交配置。

## 发布前检查

确认当前分支、工作树和版本号：

```sh
git status --short --branch
git log -1 --oneline
```

运行质量检查：

```sh
pnpm lint
pnpm typecheck
```

正式发布前在 `package.json` 更新版本号，并确认 Release 说明能够准确概括用户可见变化与重要修复。

## Chrome 与 Edge

生成生产目录：

```sh
pnpm build
```

产物位于 `extension/`。本地检查时，在 `chrome://extensions` 或 `edge://extensions` 启用开发者模式并加载该目录。

生成 ZIP：

```sh
pnpm pack:zip
```

输出文件为 `extension.zip`。

## Firefox

```sh
pnpm build-firefox
pnpm pack:zip-firefox
pnpm pack:zip-firefox-sources
```

输出包括：

- `extension-firefox/`：可临时加载的扩展目录；
- `extension-firefox.zip`：Firefox 扩展包；
- `extension-firefox-sources.zip`：对应源码归档。

在 `about:debugging#/runtime/this-firefox` 中选择 `extension-firefox/manifest.json` 可以完成本地检查。

## 一次生成全部产物

```sh
pnpm build-pack
```

该命令会依次构建 Chromium、Firefox 和相关 ZIP。执行前应确保没有需要保留的旧产物，因为构建脚本会清理对应输出目录。

## 产物检查

至少确认：

- 扩展名称显示为 `Bewly_Nocturne`；
- 版本号与 `package.json` 一致；
- 首页、Dock、设置页和页面模式切换可以正常使用；
- 深色与浅色模式下没有明显视觉回退；
- ZIP 可以完整解压。

可以使用：

```sh
unzip -t extension.zip
unzip -t extension-firefox.zip
```

## GitHub Release

1. 将经过验证的提交合入个人仓库 `main`；
2. 创建与 `package.json` 版本一致的标签；
3. 编写简洁的 Release 说明，区分新功能、修复和兼容性变化；
4. 上传 Chrome/Edge 与 Firefox 产物；
5. 下载一次已发布附件并复核文件完整性。

如发布后发现问题，不改写既有公开标签或提交历史。保留上一版本产物，并通过新的修复版本恢复可用状态。
