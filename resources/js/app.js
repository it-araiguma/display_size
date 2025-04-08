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
        
        // i18nを明示的に設定
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
