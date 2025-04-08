import { createI18n } from 'vue-i18n';

// 言語ファイルのインポート
import ja from './locales/ja';
import en from './locales/en';
import zhCN from './locales/zh-CN';
import ko from './locales/ko';

// 型定義
type MessageSchema = typeof ja;

// 言語メッセージを明示的に定義
const messages = {
    ja,
    en,
    'zh-CN': zhCN,
    ko
};

// オプションを明示的に定義
const options = {
    legacy: false,
    locale: 'ja',
    fallbackLocale: 'en',
    globalInjection: true,
    silentTranslationWarn: process.env.NODE_ENV === 'production', // 本番環境では警告を抑制
    silentFallbackWarn: process.env.NODE_ENV === 'production', // 本番環境では警告を抑制
    messages
};

// i18nインスタンスの作成
const i18n = createI18n(options);

// デバッグ情報（開発環境のみ）
if (process.env.NODE_ENV !== 'production') {
    console.log('i18n initialized with options:', options);
    console.log('Available locales:', Object.keys(messages));
}

export default i18n;
