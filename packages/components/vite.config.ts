import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import path from "node:path";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: "./tsconfig.json",
      outDir: ["./dist/es", "./dist/lib"],
      entryRoot: "./src",
      exclude: ["node_modules", "vite.config.ts"],
    }),
  ],
  build: {
    emptyOutDir: true,
    cssCodeSplit: true,
    lib: {
      entry: "./src/index.ts",
      name: "MyWcsComponents",
      fileName: (format) =>
        format === "es"
          ? "index.es.js"
          : format === "cjs"
            ? "index.cjs.js"
            : "index.umd.js",
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      external: ["vue", "@my-wcs/common"],
      output: [
        {
          format: "es",
          entryFileNames: "[name].js",
          exports: "named",
          preserveModules: true,
          preserveModulesRoot: "src",
          dir: "./dist/es",
          assetFileNames: (assetInfo) => {
            if (assetInfo.names?.some((n) => n.endsWith(".css"))) {
              return path.join(path.dirname(assetInfo.names[0]!), "style.css");
            }
            return "[name].[ext]";
          },
        },
        {
          format: "cjs",
          entryFileNames: "[name].js",
          exports: "named",
          preserveModules: true,
          preserveModulesRoot: "src",
          dir: "./dist/lib",
          assetFileNames: (assetInfo) => {
            if (assetInfo.names?.some((n) => n.endsWith(".css"))) {
              return path.join(path.dirname(assetInfo.names[0]!), "style.css");
            }
            return "[name].[ext]";
          },
        },
        {
          format: "umd",
          entryFileNames: "index.js",
          exports: "named",
          name: "MyWcsComponents",
          dir: "./dist/umd",
          globals: { vue: "Vue" },
        },
      ],
    },
    sourcemap: true,
  },
});
