import { fileURLToPath } from 'node:url';
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
            // vite 7 は sass modern API がデフォルトのため、ルート相対パスでは
            // 解決できない。絶対パスで明示的に指定する。
            sassVariables: fileURLToPath(new URL('./resources/css/quasar-variables.sass', import.meta.url))
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
