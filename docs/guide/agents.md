# 协作指南（AGENTS）

本页摘录仓库根 `AGENTS.md` 的要点，便于在文档站内查阅。

- 语言与风格：中文、简洁要点优先；引用文件名使用反引号
- 技术栈：pnpm workspaces、Vue 3 + TypeScript、Vite、VitePress、Vitest + jsdom
- Code Style：强类型、避免 any、命名可读、必要注释、不改无关格式
- 构建产物：ESM + CJS + UMD + d.ts；按需导出与 tree-shaking
- 包结构：`packages/common`、`packages/components`、`packages/entry`、`packages/resolver`、`play`、`docs`
- 常用脚本：`pnpm install`、`pnpm lint`、`pnpm typecheck`、`pnpm build`、`pnpm play:dev`
- 自动导入：在使用方配置 `MyWcsResolver()`，可自动注入样式；详见“按需引入与自动导入”
- 版本与发布：Changesets（`pnpm changeset`、`pnpm release`），CI 已配置

完整内容参见仓库根 `AGENTS.md`。
