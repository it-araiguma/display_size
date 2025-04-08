import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        quasar({
            sassVariables: 'resources/css/quasar-variables.sass'
        }),
    ],
    // 本番ビルドの最適化設定
    build: {
        // ソースマップを生成（デバッグを容易に）
        sourcemap: true,
        // チャンクサイズの警告を無効化
        chunkSizeWarningLimit: 1000,
        // ロールアップオプション
        rollupOptions: {
            // i18nファイルを確実にビルドに含める
            input: {
                main: 'resources/js/app.js',
                i18n: 'resources/js/i18n/index.ts'
            },
            output: {
                // チャンクの分割設定
                manualChunks: {
                    'vendor': ['vue', 'vue-i18n', 'quasar'],
                    'i18n': ['resources/js/i18n/index.ts']
                }
            }
        }
    }
});
