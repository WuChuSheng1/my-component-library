import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import path from "node:path";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: "./tsconfig.json",
      outDir: "./dist/es",
      entryRoot: "./src",
      exclude: ["node_modules", "vite.config.ts"],
    }),
  ],
  resolve: {
    alias: {
      "@my-wcs/components": path.resolve(
        __dirname,
        "../components/src/index.ts",
      ),
      "@my-wcs/common": path.resolve(__dirname, "../common/src/index.ts"),
    },
  },
  build: {
    emptyOutDir: true,
    cssCodeSplit: true,
    lib: {
      entry: "./src/index.ts",
      name: "MyWcs",
      fileName: (format) =>
        format === "es"
          ? "index.es.js"
          : format === "cjs"
            ? "index.cjs.js"
            : "index.umd.js",
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      // 仅外部化 Vue，合并内部子包
      external: ["vue"],
      output: [
        {
          format: "es",
          entryFileNames: "index.es.js",
          exports: "named",
          preserveModules: false,
          dir: "./dist/es",
          assetFileNames: "style.css",
          globals: { vue: "Vue" },
        },
        {
          format: "cjs",
          entryFileNames: "index.cjs.js",
          exports: "named",
          preserveModules: false,
          dir: "./dist/lib",
          assetFileNames: "style.css",
          globals: { vue: "Vue" },
        },
        {
          format: "umd",
          entryFileNames: "index.js",
          exports: "named",
          name: "MyWcs",
          dir: "./dist/umd",
          globals: { vue: "Vue" },
          assetFileNames: "style.css",
        },
      ],
    },
    sourcemap: true,
  },
});
