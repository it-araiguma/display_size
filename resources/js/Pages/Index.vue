<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Header from '../Components/Header.vue';
import Footer from '../Components/Footer.vue';

// i18nの初期化（Options APIとComposition APIの両方で動作するように）
const { t, locale, availableLocales: i18nAvailableLocales } = useI18n({
    useScope: 'global',
    inheritLocale: true
});

// 使用可能な言語を明示的に定義
const availableLocales = ref(['ja', 'en', 'zh-CN', 'ko']);
const darkMode = ref(false);

const screenWidth = ref(0);
const screenHeight = ref(0);
const dpi = ref(0);
const screenInches = ref(0);
const roundedInches = ref(0);
const floorInches = ref(0);
const ppi = ref(0);

const resolution = computed(() => `${screenWidth.value} × ${screenHeight.value}`);
const aspectRatio = computed(() => {
    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
    const divisor = gcd(screenWidth.value, screenHeight.value);
    return `${screenWidth.value / divisor}:${screenHeight.value / divisor}`;
});

onMounted(() => {
    updateDisplaySizeValue();
    window.addEventListener('resize', updateDisplaySizeValue);

    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
        darkMode.value = savedDarkMode === 'true';
        applyTheme();
    }

    // Check for saved language preference
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && availableLocales.value.includes(savedLocale)) {
        locale.value = savedLocale;
    }

    // URLからlangパラメータを取得して言語を設定
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && availableLocales.value.includes(langParam)) {
        locale.value = langParam;
        localStorage.setItem('locale', langParam);
    }

    // 言語に応じてSEOメタタグを更新
    updateSeoMetaTags();

    // 広告の初期化（遅延実行）
    setTimeout(() => {
        initializeAds();
    }, 1000);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateDisplaySizeValue);
});

const toggleDarkMode = () => {
    darkMode.value = !darkMode.value;
    localStorage.setItem('darkMode', darkMode.value.toString());
    applyTheme();
};

const applyTheme = () => {
    document.body.classList.toggle('body--dark', darkMode.value);
};

// 言語切替関数
const changeLocale = (newLocale: string) => {
    if (availableLocales.value.includes(newLocale)) {
        locale.value = newLocale;
        localStorage.setItem('locale', newLocale);
        
        // グローバル変数にも現在のロケールを設定（緊急対策）
        window.$locale = newLocale;
        
        // URLのlangパラメータを更新（ページリロードなし）
        const url = new URL(window.location.href);
        url.searchParams.set('lang', newLocale);
        window.history.pushState({}, '', url);
        
        // 言語切替後に翻訳キーが正しく適用されるように強制的に再レンダリング
        document.documentElement.setAttribute('lang', newLocale === 'zh-CN' ? 'zh' : newLocale);
        
        // SEOメタタグを更新
        updateSeoMetaTags();
        
        // 開発環境でのデバッグ情報
        if (process.env.NODE_ENV !== 'production') {
            console.log('Locale changed to:', newLocale);
            console.log('Current translations sample:', {
                title: t('app.title'),
                screenSize: t('app.screen_size'),
                inches: t('app.inches')
            });
        }
    }
};

const updateDisplaySizeValue = () => {
    const dpiCalculator = document.getElementById('dpi-calculator');
    if (dpiCalculator) {
        dpi.value = dpiCalculator.offsetWidth;
    }

    screenWidth.value = window.screen.width;
    screenHeight.value = window.screen.height;

    const inches = calculateScreenInches(screenWidth.value, screenHeight.value, dpi.value);
    screenInches.value = inches;
    roundedInches.value = Math.round(inches);
    floorInches.value = truncateToDecimal(inches, 2);

    // Calculate PPI (Pixels Per Inch)
    const diagonalResolution = Math.sqrt(Math.pow(screenWidth.value, 2) + Math.pow(screenHeight.value, 2));
    ppi.value = Math.round(diagonalResolution / inches);
};

const calculateScreenInches = (width: number, height: number, dpi: number) => {
    const widthInches = width / dpi;
    const heightInches = height / dpi;

    return Math.sqrt(widthInches ** 2 + heightInches ** 2);
};

const truncateToDecimal = (value: number, decimals: number) => {
    const factor = Math.pow(10, decimals);
    return Math.floor(value * factor) / factor;
}

// SEOメタタグを言語に応じて更新する関数
const updateSeoMetaTags = () => {
    const titles = {
        'ja': '画面サイズチェッカー | ディスプレイ画面の幅、縦、インチが計測できる便利ツール',
        'en': 'Screen Size Checker | A Handy Tool to Measure Display Width, Height, and Inches',
        'zh-CN': '屏幕尺寸检查器 | 测量显示屏宽度、高度和英寸的便捷工具',
        'ko': '화면 크기 체커 | 디스플레이 화면의 너비, 높이, 인치를 측정할 수 있는 편리한 도구'
    };

    const descriptions = {
        'ja': '画面サイズチェッカーはディスプレイ画面の幅、縦、インチが計測できる便利ツールです。',
        'en': 'Screen Size Checker is a handy tool that allows you to measure the width, height, and inches of your display screen.',
        'zh-CN': '屏幕尺寸检查器是一个方便的工具，可以测量显示屏的宽度、高度和英寸。',
        'ko': '화면 크기 체커는 디스플레이 화면의 너비, 높이, 인치를 측정할 수 있는 편리한 도구입니다.'
    };

    const siteNames = {
        'ja': '画面サイズチェッカー',
        'en': 'Screen Size Checker',
        'zh-CN': '屏幕尺寸检查器',
        'ko': '화面 크기 체커'
    };

    const currentLang = locale.value;

    // タイトルとメタ説明を更新
    const titleElement = document.getElementById('page-title');
    const descriptionElement = document.getElementById('page-description');
    const ogTitleElement = document.getElementById('og-title');
    const ogDescriptionElement = document.getElementById('og-description');
    const ogSiteNameElement = document.getElementById('og-site-name');

    if (titleElement) titleElement.textContent = titles[currentLang];
    if (descriptionElement) descriptionElement.setAttribute('content', descriptions[currentLang]);
    if (ogTitleElement) ogTitleElement.setAttribute('content', titles[currentLang]);
    if (ogDescriptionElement) ogDescriptionElement.setAttribute('content', descriptions[currentLang]);
    if (ogSiteNameElement) ogSiteNameElement.setAttribute('content', siteNames[currentLang]);

    // HTML要素のlang属性を更新
    document.documentElement.setAttribute('lang', currentLang === 'zh-CN' ? 'zh' : currentLang);
};

// 広告を初期化する関数
const initializeAds = () => {
    try {
        // TypeScriptの型エラーを回避するためにanyを使用
        const win = window as any;
        // グローバルスコープにadsbygooleが存在することを確認
        if (win.adsbygoogle && typeof win.adsbygoogle.push === 'function') {
            // 既に初期化されていない広告要素のみを初期化
            const adElements = document.querySelectorAll('ins.adsbygoogle:not([data-adsbygoogle-status])');
            if (adElements.length > 0) {
                adElements.forEach(ad => {
                    win.adsbygoogle.push({});
                });
            }
        }
    } catch (error) {
        console.error('広告の初期化中にエラーが発生しました:', error);
    }
};

const getTranslation = (key: string) => {
    return t(key);
};
</script>

<template>
    <q-layout view="hHh lpR fFf" :class="{ 'body--dark': darkMode }">
        <Header :dark-mode="darkMode" @toggle-dark-mode="toggleDarkMode" :locale="locale" @change-locale="changeLocale"
            :available-locales="availableLocales" />

        <q-page-container class="container q-pa-md">
            <div id="dpi-calculator"></div>

            <div class="row q-col-gutter-md q-mt-md">
                <!-- Main Screen Size Card -->
                <div class="col-12 col-md-6">
                    <q-card class="full-height">
                        <q-card-section class="bg-primary text-white">
                            <!-- 緊急対策：直接翻訳テキストを使用 -->
                            <div class="text-h6">{{ getTranslation('app.screen_size') }}</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="text-center q-py-md">
                                <div class="text-h2 text-weight-bold text-primary">{{ roundedInches }}"</div>
                                <div class="text-subtitle1 text-grey-7">{{ floorInches }} {{ getTranslation('app.inches') }}</div>
                            </div>

                            <q-list>
                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon name="monitor" color="primary" size="md" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ getTranslation('app.diagonal') }}</q-item-label>
                                        <q-item-label caption>{{ floorInches }} {{ getTranslation('app.inches') }}</q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-separator />

                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon name="swap_horiz" color="primary" size="md" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ getTranslation('app.width') }}</q-item-label>
                                        <q-item-label caption>{{ screenWidth }} {{ getTranslation('app.pixels') }}</q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-separator />

                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon name="swap_vert" color="primary" size="md" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ getTranslation('app.height') }}</q-item-label>
                                        <q-item-label caption>{{ screenHeight }} {{ getTranslation('app.pixels') }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </div>

                <!-- Technical Details Card -->
                <div class="col-12 col-md-6">
                    <q-card class="full-height">
                        <q-card-section class="bg-secondary text-white">
                            <div class="text-h6">{{ getTranslation('app.device_info') }}</div>
                        </q-card-section>

                        <q-card-section>
                            <q-list>
                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon name="aspect_ratio" color="secondary" size="md" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ getTranslation('app.resolution') }}</q-item-label>
                                        <q-item-label caption>{{ resolution }}</q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-separator />

                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon name="photo_size_select_small" color="secondary" size="md" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ getTranslation('app.aspect_ratio') }}</q-item-label>
                                        <q-item-label caption>{{ aspectRatio }}</q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-separator />

                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon name="grain" color="secondary" size="md" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ getTranslation('app.pixel_density') }}</q-item-label>
                                        <q-item-label caption>{{ ppi }} {{ getTranslation('app.ppi') }}</q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-separator />

                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon name="straighten" color="secondary" size="md" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>DPI</q-item-label>
                                        <q-item-label caption>{{ dpi }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </div>
            </div>

            <!-- Ad Section -->
            <div class="q-mt-md">
                <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-9551028273212184"
                    data-ad-slot="5064784177" data-ad-format="auto" data-full-width-responsive="true"></ins>
            </div>
        </q-page-container>

        <Footer :dark-mode="darkMode" />
    </q-layout>
</template>

<style>
.container {
    max-width: 1200px;
    margin: 0 auto;
}

.content {
    text-align: right;
}

#dpi-calculator {
    width: 1in;
    height: 1in;
    position: absolute;
    left: -100%;
    top: -100%;
}

body {
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    transition: background-color 0.3s ease;
}

.body--dark {
    background-color: #121212;
    color: #ffffff;
}

.body--dark .q-card {
    background-color: #1e1e1e;
    color: #ffffff;
}

.body--dark .q-item {
    color: #ffffff;
}

.body--dark .q-item__label {
    color: #ffffff !important;
}

.body--dark .q-item__label--caption {
    color: #e0e0e0 !important;
    font-size: 0.9rem !important;
    letter-spacing: 0.03em !important;
}

.body--dark .q-item-label {
    color: #ffffff;
}

.body--dark .q-item-label.caption {
    color: #e0e0e0;
}

.body--dark .text-grey-7 {
    color: #e0e0e0 !important;
}

.body--dark .text-primary {
    color: #90CAF9 !important;
}

.body--dark .text-secondary {
    color: #A5D6A7 !important;
}

.body--dark .text-h2 {
    color: #90CAF9 !important;
    text-shadow: 0 0 10px rgba(144, 202, 249, 0.4);
}

.body--dark .text-h6 {
    color: #ffffff !important;
    font-weight: bold;
}

.body--dark .text-subtitle1 {
    color: #e0e0e0 !important;
}

.body--dark .q-separator {
    background-color: rgba(255, 255, 255, 0.3);
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: 'Open Sans', sans-serif;
}

p {
    font-family: 'Lato', sans-serif;
}

/* ダークモード時のカードのスタイル改善 */
.body--dark .q-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
}

/* ダークモード時のアイコンの色を明るく */
.body--dark .q-icon {
    color: #90CAF9;
}

/* ダークモード時のカードヘッダーの色を調整 */
.body--dark .bg-primary {
    background-color: #1976D2 !important;
}

.body--dark .bg-secondary {
    background-color: #2E7D32 !important;
}

/* ダークモード時のアイテムホバー効果 */
.body--dark .q-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

/* キャプション全般の可読性向上 */
.body--dark .caption {
    color: #e0e0e0 !important;
}
</style>
