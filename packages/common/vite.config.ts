import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "node:path";

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.json",
      outDir: ["./dist/es", "./dist/lib"],
      entryRoot: "./src",
      exclude: ["node_modules", "vite.config.ts"],
    }),
  ],
  build: {
    emptyOutDir: true,
    lib: {
      entry: "./src/index.ts",
      name: "MyWcsCommon",
      fileName: (format) =>
        format === "es"
          ? "index.es.js"
          : format === "cjs"
            ? "index.cjs.js"
            : "index.umd.js",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [],
      output: [
        {
          format: "es",
          entryFileNames: "[name].es.js",
          exports: "named",
          preserveModules: false,
          dir: "./dist/es",
        },
        {
          format: "cjs",
          entryFileNames: "[name].cjs.js",
          exports: "named",
          preserveModules: false,
          dir: "./dist/lib",
        },
      ],
    },
    sourcemap: true,
  },
});
