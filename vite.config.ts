import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: './src/index.ts',
            name: 'MyComponentLibrary',
            formats: ['es', 'umd', 'cjs'],
            fileName: format => `index.${format}.js`,
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                // 在 UMD 模式下为外部化的依赖提供全局变量
                globals: {
                    vue: 'vue'
                }
            }
        }
    }
})