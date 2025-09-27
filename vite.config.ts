import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: "tsconfig.json",
      outDir: "./dist/es",
      entryRoot: "./src",
      exclude: ["node_modules", "vite.config.ts"],
    }),
    dts({
      tsconfigPath: "tsconfig.json",
      outDir: "./dist/lib",
      entryRoot: "./src",
      exclude: ["node_modules", "vite.config.ts"],
    }),
  ],
  build: {
    emptyOutDir: true,
    minify: true,
    cssCodeSplit: true,
    lib: {
      entry: "./src/index.ts",
      name: "MyComponentLibrary",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: [
        {
          format: "es",
          entryFileNames: "[name].js",
          exports: "named",
          preserveModules: true,
          preserveModulesRoot: "src",
          dir: "./dist/es",
          assetFileNames: (assetInfo) => {
            if (
              assetInfo.names &&
              assetInfo.names.some((name) => name.endsWith(".css"))
            ) {
              return path.join(path.dirname(assetInfo.names[0]), "style.css");
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
            if (
              assetInfo.names &&
              assetInfo.names.some((name) => name.endsWith(".css"))
            ) {
              return path.join(path.dirname(assetInfo.names[0]), "style.css");
            }
            return "[name].[ext]";
          },
        },
        {
          format: "umd",
          entryFileNames: "index.js",
          exports: "named",
          name: "my-wcs-component-library",
          dir: "./dist/umd",
          globals: {
            vue: "vue",
          },
        },
      ],
    },
  },
});
