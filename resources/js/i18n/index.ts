import { createI18n } from 'vue-i18n';

// 言語ファイルのインポート
import ja from './locales/ja';
import en from './locales/en';
import zhCN from './locales/zh-CN';
import ko from './locales/ko';

// 言語メッセージを明示的に定義
const messages = {
    ja,
    en,
    'zh-CN': zhCN,
    ko
};

// 本番環境用の特別な設定
const isProd = process.env.NODE_ENV === 'production';

// オプションを明示的に定義
const i18nOptions = {
    // Composition APIモードを無効化（本番環境での互換性のため）
    legacy: true,
    // グローバルにt()関数を注入
    globalInjection: true,
    // デフォルト言語
    locale: 'ja',
    // フォールバック言語
    fallbackLocale: 'en',
    // 翻訳警告を抑制（本番環境のみ）
    silentTranslationWarn: isProd,
    // フォールバック警告を抑制（本番環境のみ）
    silentFallbackWarn: isProd,
    // 言語メッセージ
    messages
};

// i18nインスタンスの作成
const i18n = createI18n(i18nOptions);

// デバッグ情報
if (!isProd) {
    console.log('i18n initialized with options:', i18nOptions);
    console.log('Available locales:', Object.keys(messages));
}

export default i18n;
