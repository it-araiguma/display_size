import "./bootstrap";
// import '../css/app.css';

import { createApp, h } from "vue";
import { createInertiaApp } from "@inertiajs/vue3";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { Quasar, Notify } from "quasar";
import quasarLang from "quasar/lang/ja";
import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";
import i18n from "./i18n";

// 本番環境でのデバッグ情報
const isProduction = import.meta.env.PROD;
if (isProduction) {
    console.log('Running in production mode');
}

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`,
            import.meta.glob("./Pages/**/*.vue")
        ),
    setup({ el, App, props, plugin }) {
        const app = createApp({ render: () => h(App, props) });
        
        // プラグインを使用
        app.use(plugin);
        app.use(Quasar, {
            plugins: {
                Notify,
            },
            lang: quasarLang,
        });
        
        // i18nを明示的に設定（本番環境では特別な処理を追加）
        if (isProduction) {
            // 本番環境では、i18nの初期化を確実に行う
            console.log('Initializing i18n in production mode');
            
            // グローバルプロパティとしてi18nを追加（本番環境用の対策）
            app.config.globalProperties.$i18n = i18n.global;
            app.config.globalProperties.$t = i18n.global.t;
        }
        
        app.use(i18n);
        
        // グローバルメソッドを追加
        app.mixin({ methods: { route } });
        
        // アプリをマウント
        app.mount(el);
        
        return app;
    },
    progress: {
        color: "#4B5563",
    },
});
