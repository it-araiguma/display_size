import { createI18n } from 'vue-i18n';

// 言語ファイルのインポート
import ja from './locales/ja';
import en from './locales/en';
import zhCN from './locales/zh-CN';
import ko from './locales/ko';

// 型定義
type MessageSchema = typeof ja;

// TypeScriptのエラーを回避するために型アサーションを使用
const options = {
    legacy: false, // Composition APIを使用
    locale: 'ja', // デフォルト言語
    fallbackLocale: 'en', // フォールバック言語
    globalInjection: true, // グローバルにt()関数を注入
    silentTranslationWarn: false, // 翻訳警告を表示
    silentFallbackWarn: false, // フォールバック警告を表示
    messages: {
        ja,
        en,
        'zh-CN': zhCN,
        ko
    }
} as any; // 型エラーを回避するためにany型にキャスト

// i18nインスタンスの作成
const i18n = createI18n(options);

export default i18n;
