import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: [
      "packages/**/test/**/*.{test,spec}.ts",
      "packages/**/__tests__/**/*.{test,spec}.ts",
    ],
  },
  projects: [
    {
      test: {
        name: "components",
        environment: "jsdom",
        include: ["packages/components/**/test/**/*.{test,spec}.ts"],
      },
    },
    {
      test: {
        name: "entry",
        environment: "jsdom",
        include: ["packages/entry/**/test/**/*.{test,spec}.ts"],
      },
    },
    {
      test: {
        name: "common",
        environment: "node",
        include: ["packages/common/**/test/**/*.{test,spec}.ts"],
      },
    },
    {
      test: {
        name: "resolver",
        environment: "node",
        include: ["packages/resolver/**/test/**/*.{test,spec}.ts"],
      },
    },
  ],
});
