# 按需引入与自动导入

本组件库支持两种用法：

- 全量引入（注册所有组件）
- 按需引入（仅导入使用到的组件），并可配合 `unplugin-vue-components` 自动导入

## 全量引入

```ts
import { createApp } from "vue";
import App from "./App.vue";
import MyWcs from "@my-wcs/entry";
import "@my-wcs/entry/dist/es/style.css";

createApp(App).use(MyWcs).mount("#app");
```

## 按需引入（手动）

```ts
import { StSayHello } from "@my-wcs/components";
```

## 按需自动导入（推荐）

安装插件：

```bash
pnpm add -D unplugin-vue-components unplugin-auto-import
```

在 `vite.config.ts` 中配置解析器：

```ts
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { MyWcsResolver } from "@my-wcs/resolver";

export default defineConfig({
  plugins: [
    AutoImport({ imports: ["vue"] }),
    Components({ resolvers: [MyWcsResolver()] }),
  ],
});
```

现在可以直接使用组件，无需手动 import：

```vue
<template>
  <StSayHello name="world" />
</template>
```

### 样式自动引入

`MyWcsResolver()` 默认会为组件注入对应的样式路径（如 `say-hello/style.css`）。可通过 `MyWcsResolver({ importStyle: false })` 关闭自动样式引入，并改为统一从入口样式：

```ts
import "@my-wcs/entry/dist/es/style.css";
```
