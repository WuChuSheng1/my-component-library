import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { MyWcsResolver } from "@my-wcs/resolver";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue"],
      dts: false,
    }),
    Components({
      dts: false,
      resolvers: [MyWcsResolver()],
    }),
  ],
});
