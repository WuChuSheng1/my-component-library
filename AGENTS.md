# AGENTS Guide

本仓库为 pnpm + Monorepo 的 Vue 3 组件库工程。本文档说明与本项目中 AI 助手协作的约定、常用脚本与工作流，便于快速上手与统一产出。

## 基本规则（与 `.cursorrules` 一致）

- 语言：中文；风格：简洁要点优先；引用文件名使用反引号，比如 `packages/ui/vite.config.ts`
- Tech：pnpm workspaces、Vue 3 + TypeScript、Vite（库模式）、VitePress、Vitest + jsdom
- Code Style：强类型、避免 any；命名可读性优先；只写必要注释；不改无关格式
- Do：产物 ESM + CJS + UMD + d.ts；组件按需导出、保留 tree-shaking；修改前先找统一入口
- Don’t：不引入大型依赖（除非先提建议）；不绕过 ESLint/TS 报错；不写与实现无关的讲述性注释

## Monorepo 包结构

- `packages/common`：公共方法与安装辅助（`withInstall`）
- `packages/components`：组件源与按需导出（保留 `preserveModules` 以利于 tree-shaking）
- `packages/entry`：库总入口（对标 element-plus 入口，统一打包并汇总样式）
- `packages/resolver`：给 `unplugin-vue-components` 使用的解析器（自动按需引入与样式注入）
- `play`：本地联调示例应用
- `docs`：VitePress 文档

## 常用脚本（在仓库根执行）

- 安装依赖：`pnpm install`
- Lint：`pnpm lint`
- 类型检查：`pnpm typecheck`
- 构建全部包：`pnpm build`
- 构建单个包：`pnpm --filter @my-wcs/components build`
- 示例运行：`pnpm play:dev`（如需局域网：在命令末尾追加 `-- --host`）

## 构建与产物

- `@my-wcs/components`：按需导出，ESM/CJS/UMD 与 `.d.ts`，样式按组件输出
- `@my-wcs/entry`：整体入口，聚合样式为 `dist/es/style.css`，仅外部化 `vue`
- 类型由 `vite-plugin-dts` 生成；样式通过 cssCodeSplit 与每组件 `style.css` 输出

## 自动导入与按需使用

- 解析器：`@my-wcs/resolver` 暴露 `MyWcsResolver({ importStyle?: boolean | 'css' })`
- 在使用方 `vite.config.ts`：
  - `unplugin-auto-import`：自动导入 `vue`
  - `unplugin-vue-components`：`Components({ resolvers: [MyWcsResolver()] })`
- 使用：
  - 全量：`app.use(MyWcs)` + `import '@my-wcs/entry/dist/es/style.css'`
  - 按需：直接 `<StSayHello />`，解析器会注入 `say-hello/style.css`

## 版本与发布（Changesets）

- 新增变更：`pnpm changeset`（选择受影响的包与变更类型）
- 版本与发布：`pnpm release`（内部执行 version、install、build、publish）
- CI：
  - `/.github/workflows/ci.yml`：Lint、Typecheck、Test、Build
  - `/.github/workflows/release.yml`：`changesets/action` 生成 Release PR 或发布

## 典型协作 Prompt 模板

- 工程规范：
  - “全程用中文，遵循 `.cursorrules` 的 Code Style 与 Do/Don’t。若需引入依赖先提建议。”
- 开发请求：
  - “在 `packages/components` 新增组件 `Xxx`，支持全量与按需引入；补充示例与文档；通过 `pnpm build` 与 `play` 验证。”
- 排错请求：
  - “运行 `pnpm build` 报错，请定位并修复；保证 Lint/Typecheck 通过。”

## 提交与质量门禁

- 提交前自动钩子：`simple-git-hooks` 运行 Prettier/Lint/Test（根 `package.json` 配置）
- 禁止绕过 ESLint/TS 错误；修改必须保持类型安全与风格一致

## 附：重要文件

- 根工作区：`pnpm-workspace.yaml`、`package.json`、`tsconfig.json`、`eslint.config.ts`
- 包配置：`packages/*/{package.json, tsconfig.json, vite.config.ts}`
- 文档：`docs/index.md`、`docs/guide/auto-import.md`

如需扩展：

- 主题/样式体系、按需样式聚合策略、更多组件模板、CI 发布分支策略等，可在 Issue 中提出或直接补充 PR。
