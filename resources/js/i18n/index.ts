import { createI18n } from 'vue-i18n';

// 言語ファイルのインポート
import ja from './locales/ja';
import en from './locales/en';
import zhCN from './locales/zh-CN';
import ko from './locales/ko';

// 型定義
type MessageSchema = typeof ja;

// i18nインスタンスの作成
const i18n = createI18n<[MessageSchema], 'ja' | 'en' | 'zh-CN' | 'ko'>({
    legacy: false, // Composition APIを使用
    locale: 'ja', // デフォルト言語
    fallbackLocale: 'en', // フォールバック言語
    messages: {
        ja,
        en,
        'zh-CN': zhCN,
        ko
    }
});

export default i18n;
