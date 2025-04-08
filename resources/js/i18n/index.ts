import { createI18n } from 'vue-i18n';

// 言語ファイルのインポート
import ja from './locales/ja';
import en from './locales/en';
import zhCN from './locales/zh-CN';
import ko from './locales/ko';

// 型定義の拡張
declare global {
    interface Window {
        $t: (key: string) => string;
        $locale: string;
    }
}

// 言語メッセージを明示的に定義
const messages = {
    ja,
    en,
    'zh-CN': zhCN,
    ko
};

// 本番環境用の特別な設定
const isProd = process.env.NODE_ENV === 'production';

// 本番環境用のハードコードされたメッセージ（緊急対策）
const hardcodedMessages = {
    'app.screen_size': {
        'ja': '画面サイズ',
        'en': 'Screen Size',
        'zh-CN': '屏幕尺寸',
        'ko': '화면 크기'
    },
    'app.inches': {
        'ja': 'インチ',
        'en': 'inches',
        'zh-CN': '英寸',
        'ko': '인치'
    },
    'app.diagonal': {
        'ja': '対角線',
        'en': 'Diagonal',
        'zh-CN': '对角线',
        'ko': '대각선'
    },
    'app.width': {
        'ja': '幅',
        'en': 'Width',
        'zh-CN': '宽度',
        'ko': '너비'
    },
    'app.pixels': {
        'ja': 'ピクセル',
        'en': 'pixels',
        'zh-CN': '像素',
        'ko': '픽셀'
    },
    'app.height': {
        'ja': '高さ',
        'en': 'Height',
        'zh-CN': '高度',
        'ko': '높이'
    },
    'app.device_info': {
        'ja': 'デバイス情報',
        'en': 'Device Info',
        'zh-CN': '设备信息',
        'ko': '장치 정보'
    },
    'app.resolution': {
        'ja': '解像度',
        'en': 'Resolution',
        'zh-CN': '分辨率',
        'ko': '해상도'
    },
    'app.aspect_ratio': {
        'ja': 'アスペクト比',
        'en': 'Aspect Ratio',
        'zh-CN': '宽高比',
        'ko': '화면비'
    },
    'app.pixel_density': {
        'ja': 'ピクセル密度',
        'en': 'Pixel Density',
        'zh-CN': '像素密度',
        'ko': '픽셀 밀도'
    },
    'app.ppi': {
        'ja': 'PPI',
        'en': 'PPI',
        'zh-CN': 'PPI',
        'ko': 'PPI'
    }
};

// カスタム翻訳関数（緊急対策）
const customTranslate = (key: string, locale: string): string => {
    if (hardcodedMessages[key] && hardcodedMessages[key][locale]) {
        return hardcodedMessages[key][locale];
    }
    
    // キーをドット区切りで分解
    const parts = key.split('.');
    if (parts.length > 1) {
        let current = messages[locale];
        for (const part of parts) {
            if (current && current[part]) {
                current = current[part];
            } else {
                return key; // 翻訳が見つからない場合はキーをそのまま返す
            }
        }
        if (typeof current === 'string') {
            return current;
        }
    }
    
    return key; // 翻訳が見つからない場合はキーをそのまま返す
};

// グローバル翻訳関数を定義
window.$t = (key: string) => {
    const locale = window.$locale || 'ja';
    return customTranslate(key, locale);
};

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

// 現在のロケールをグローバルに保存
window.$locale = i18nOptions.locale;

// デバッグ情報
if (!isProd) {
    console.log('i18n initialized with options:', i18nOptions);
    console.log('Available locales:', Object.keys(messages));
}

export default i18n;
