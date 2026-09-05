<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import Header from '../Components/Header.vue';
import Footer from '../Components/Footer.vue';

// 使用可能な言語を明示的に定義
const availableLocales = ref(['ja', 'en', 'zh-CN', 'ko', 'fr', 'es']);
const darkMode = ref(false);

const screenWidth = ref(0);
const screenHeight = ref(0);
const dpi = ref(0);
const screenInches = ref(0);
const roundedInches = ref(0);
const floorInches = ref(0);
const ppi = ref(0);

const locale = ref('ja');

const resolution = computed(() => `${screenWidth.value} × ${screenHeight.value}`);
const aspectRatio = computed(() => calculateAspectRatio(screenWidth.value, screenHeight.value));

// i18nを使わない直接的な翻訳オブジェクト
const translations = {
    'ja': {
        'app.screen_size': '画面サイズ',
        'app.inches': 'インチ',
        'app.diagonal': '対角線',
        'app.width': '幅',
        'app.pixels': 'ピクセル',
        'app.height': '高さ',
        'app.device_info': 'デバイス情報',
        'app.resolution': '解像度',
        'app.aspect_ratio': 'アスペクト比',
        'app.pixel_density': 'ピクセル密度',
        'app.ppi': 'PPI',
        'app.home': 'ホーム',
        'app.privacy_policy': 'プライバシーポリシー',
        'app.estimate_note': '※ デバイス情報に基づく推定値です(ブラウザでは実寸を取得できません)'
    },
    'en': {
        'app.screen_size': 'Screen Size',
        'app.inches': 'inches',
        'app.diagonal': 'Diagonal',
        'app.width': 'Width',
        'app.pixels': 'pixels',
        'app.height': 'Height',
        'app.device_info': 'Device Info',
        'app.resolution': 'Resolution',
        'app.aspect_ratio': 'Aspect Ratio',
        'app.pixel_density': 'Pixel Density',
        'app.ppi': 'PPI',
        'app.home': 'Home',
        'app.privacy_policy': 'Privacy Policy',
        'app.estimate_note': '* Estimated based on device profile (browsers can\'t read physical size directly)'
    },
    'zh-CN': {
        'app.screen_size': '屏幕尺寸',
        'app.inches': '英寸',
        'app.diagonal': '对角线',
        'app.width': '宽度',
        'app.pixels': '像素',
        'app.height': '高度',
        'app.device_info': '设备信息',
        'app.resolution': '分辨率',
        'app.aspect_ratio': '宽高比',
        'app.pixel_density': '像素密度',
        'app.ppi': 'PPI',
        'app.home': '首页',
        'app.privacy_policy': '隐私政策',
        'app.estimate_note': '* 基于设备信息的估算值(浏览器无法直接获取实际尺寸)'
    },
    'ko': {
        'app.screen_size': '화면 크기',
        'app.inches': '인치',
        'app.diagonal': '대각선',
        'app.width': '너비',
        'app.pixels': '픽셀',
        'app.height': '높이',
        'app.device_info': '장치 정보',
        'app.resolution': '해상도',
        'app.aspect_ratio': '화면비',
        'app.pixel_density': '픽셀 밀도',
        'app.ppi': 'PPI',
        'app.home': '홈',
        'app.privacy_policy': '개인정보 보호정책',
        'app.estimate_note': '* 장치 정보 기반 추정값(브라우저는 실제 크기를 직접 읽을 수 없음)'
    },
    'fr': {
        'app.screen_size': 'Taille d\'écran',
        'app.inches': 'pouces',
        'app.diagonal': 'Diagonale',
        'app.width': 'Largeur',
        'app.pixels': 'pixels',
        'app.height': 'Hauteur',
        'app.device_info': 'Infos appareil',
        'app.resolution': 'Résolution',
        'app.aspect_ratio': 'Ratio d\'aspect',
        'app.pixel_density': 'Densité de pixels',
        'app.ppi': 'PPP',
        'app.home': 'Accueil',
        'app.privacy_policy': 'Politique de confidentialité',
        'app.estimate_note': '* Estimé selon le profil de l\'appareil (taille réelle non accessible au navigateur)'
    },
    'es': {
        'app.screen_size': 'Tamaño de pantalla',
        'app.inches': 'pulgadas',
        'app.diagonal': 'Diagonal',
        'app.width': 'Ancho',
        'app.pixels': 'píxeles',
        'app.height': 'Altura',
        'app.device_info': 'Info del dispositivo',
        'app.resolution': 'Resolución',
        'app.aspect_ratio': 'Relación de aspecto',
        'app.pixel_density': 'Densidad de píxeles',
        'app.ppi': 'PPI',
        'app.home': 'Inicio',
        'app.privacy_policy': 'Política de privacidad',
        'app.estimate_note': '* Estimado según el perfil del dispositivo (el navegador no puede leer el tamaño real directamente)'
    }
};

// i18nを使わない直接的な翻訳関数
const getText = (key) => {
    const currentLocale = locale.value || 'ja';
    if (translations[currentLocale] && translations[currentLocale][key]) {
        return translations[currentLocale][key];
    }
    // フォールバック：英語
    if (translations['en'] && translations['en'][key]) {
        return translations['en'][key];
    }
    // キーをそのまま返す
    return key;
};

// SEOメタタグを言語に応じて更新する関数
const updateSeoMetaTags = () => {
    const titles = {
        'ja': '画面サイズチェッカー | ディスプレイ画面の幅、縦、インチが計測できる便利ツール',
        'en': 'Screen Size Checker | A Handy Tool to Measure Display Width, Height, and Inches',
        'zh-CN': '屏幕尺寸检查器 | 测量显示屏宽度、高度和英寸的便捷工具',
        'ko': '화면 크기 체커 | 디스プ레이 화면의 너비, 높이, 인치를 측정할 수 있는 편리한 도구',
        'fr': 'Vérificateur de taille d\'écran | Un outil pratique pour mesurer la largeur, la hauteur et les pouces de votre écran',
        'es': 'Comprobador de tamaño de pantalla | Una herramienta útil para medir el ancho, alto y pulgadas de su pantalla'
    };

    const descriptions = {
        'ja': '画面サイズチェッカーはディスプレイ画面の幅、縦、インチが計測できる便利ツールです。',
        'en': 'Screen Size Checker is a handy tool that allows you to measure the width, height, and inches of your display screen.',
        'zh-CN': '屏幕尺寸检查器是一个方便的工具，可以测量显示屏的宽度、高度和英寸。',
        'ko': '화면 크기 체커는 디스플레이 화면의 너비, 높이, 인치를 측정할 수 있는 편리한 도구입니다.',
        'fr': 'Le vérificateur de taille d\'écran est un outil pratique qui vous permet de mesurer la largeur, la hauteur et les pouces de votre écran.',
        'es': 'El comprobador de tamaño de pantalla es una herramienta útil que le permite medir el ancho, alto y pulgadas de su pantalla.'
    };

    const siteNames = {
        'ja': '画面サイズチェッカー',
        'en': 'Screen Size Checker',
        'zh-CN': '屏幕尺寸检查器',
        'ko': '화면 크기 체커',
        'fr': 'Vérificateur de taille d\'écran',
        'es': 'Comprobador de tamaño de pantalla'
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
        
        // URLのlangパラメータを更新（ページリロードなし）
        const url = new URL(window.location.href);
        url.searchParams.set('lang', newLocale);
        window.history.pushState({}, '', url);
        
        // 言語切替後に翻訳キーが正しく適用されるように強制的に再レンダリング
        document.documentElement.setAttribute('lang', newLocale === 'zh-CN' ? 'zh' : newLocale);
        
        // SEOメタタグを更新
        updateSeoMetaTags();
    }
};

interface DeviceProfile {
    baseLogicalPpi: number;
    deviceType: 'mobile' | 'tablet' | 'mac' | 'desktop';
}

const detectDeviceProfile = (): DeviceProfile => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return { baseLogicalPpi: 96, deviceType: 'desktop' };
    }

    const ua = navigator.userAgent || '';
    const dpr = window.devicePixelRatio || 1;
    const maxTouch = navigator.maxTouchPoints || 0;

    const screenW = window.screen.width || 0;
    const screenH = window.screen.height || 0;
    const shortSide = Math.min(screenW, screenH);
    const longSide = Math.max(screenW, screenH);

    // iPad判定 (iPadOS 13+ は Macintosh かつ maxTouchPoints > 1)
    const isIPad = /iPad/i.test(ua) || (/Macintosh/i.test(ua) && maxTouch > 1);
    const isIPhone = /iPhone|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const navAny = navigator as any;
    const isMobileUaData = Boolean(navAny.userAgentData?.mobile);
    const isAndroidMobile = isAndroid && (/Mobile/i.test(ua) || isMobileUaData);
    const isAndroidTablet = isAndroid && !isAndroidMobile;
    const isGenericMobile = isMobileUaData || (maxTouch > 0 && shortSide < 500);

    // 1. スマートフォン (iOS: 163 ppi, Android: 160 dpi)
    if (isIPhone) {
        return { baseLogicalPpi: 163, deviceType: 'mobile' };
    }
    if (isAndroidMobile || (isGenericMobile && !isIPad && !isAndroidTablet)) {
        return { baseLogicalPpi: 160, deviceType: 'mobile' };
    }

    // 2. タブレット (iPad: 132 ppi / mini: 163 ppi, Android Tablet: 160 dpi)
    if (isIPad) {
        const isIPadMini = shortSide <= 768 && longSide <= 1024 && dpr === 2;
        return { baseLogicalPpi: isIPadMini ? 163 : 132, deviceType: 'tablet' };
    }
    if (isAndroidTablet || (maxTouch > 0 && shortSide >= 500 && shortSide <= 900)) {
        return { baseLogicalPpi: 160, deviceType: 'tablet' };
    }

    // 3. Mac (MacBook Retina は約 127 ppi)
    const isMac = /Macintosh/i.test(ua) && maxTouch <= 1;
    if (isMac) {
        const diagCss = Math.sqrt(screenW ** 2 + screenH ** 2);
        if (dpr >= 2 && diagCss >= 1400 && diagCss <= 2300) {
            return { baseLogicalPpi: 127, deviceType: 'mac' };
        }
        return { baseLogicalPpi: 96, deviceType: 'desktop' };
    }

    // 4. 一般デスクトップ / ノートPC (Windows, Linux: 基準 96 ppi)
    return { baseLogicalPpi: 96, deviceType: 'desktop' };
};

const COMMON_DIMENSIONS = [
    720, 1080, 1170, 1179, 1200, 1280, 1290, 1440, 1600, 1620,
    1644, 1668, 1920, 2048, 2160, 2256, 2340, 2360, 2388, 2400,
    2460, 2520, 2532, 2556, 2560, 2732, 2778, 2796, 2880, 3000,
    3024, 3200, 3440, 3840, 4480, 5120
];

const snapToCommonDimension = (val: number, tolerance = 3): number => {
    for (const common of COMMON_DIMENSIONS) {
        if (Math.abs(val - common) <= tolerance) {
            return common;
        }
    }
    return val;
};

interface AspectRatioDefinition {
    ratio: number;
    wideName: string;
    tallName: string;
    tolerance: number;
}

const STANDARD_ASPECT_RATIOS: AspectRatioDefinition[] = [
    { ratio: 1.0, wideName: '1:1', tallName: '1:1', tolerance: 0.02 },
    { ratio: 5 / 4, wideName: '5:4', tallName: '4:5', tolerance: 0.02 },
    { ratio: 4 / 3, wideName: '4:3', tallName: '3:4', tolerance: 0.025 },
    { ratio: 3 / 2, wideName: '3:2', tallName: '2:3', tolerance: 0.025 },
    // 16:10 (1.6) - MacBookノッチ付きモデル (3024x1964 ≒ 1.54, 3456x2234 ≒ 1.547) を含む
    { ratio: 16 / 10, wideName: '16:10', tallName: '10:16', tolerance: 0.065 },
    { ratio: 16 / 9, wideName: '16:9', tallName: '9:16', tolerance: 0.03 }, // 1366x768 (1.7786) を含む
    { ratio: 18 / 9, wideName: '18:9', tallName: '9:18', tolerance: 0.025 },
    { ratio: 19.5 / 9, wideName: '19.5:9', tallName: '9:19.5', tolerance: 0.035 }, // iPhone 13-16, Galaxy
    { ratio: 20 / 9, wideName: '20:9', tallName: '9:20', tolerance: 0.03 },
    { ratio: 20.5 / 9, wideName: '20.5:9', tallName: '9:20.5', tolerance: 0.03 },
    // 21:9 - ウルトラワイド (2560x1080 ≒ 2.37, 3440x1440 ≒ 2.389, 1080x2520 ≒ 2.333) を含む
    { ratio: 2.37, wideName: '21:9', tallName: '9:21', tolerance: 0.07 },
    { ratio: 32 / 9, wideName: '32:9', tallName: '9:32', tolerance: 0.05 },
];

const calculateAspectRatio = (width: number, height: number): string => {
    if (width <= 0 || height <= 0) return '0:0';

    const isLandscape = width >= height;
    const longSide = Math.max(width, height);
    const shortSide = Math.min(width, height);
    const currentRatio = longSide / shortSide;

    for (const standard of STANDARD_ASPECT_RATIOS) {
        if (Math.abs(currentRatio - standard.ratio) <= standard.tolerance) {
            return isLandscape ? standard.wideName : standard.tallName;
        }
    }

    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
    const divisor = gcd(width, height);
    const reducedW = width / divisor;
    const reducedH = height / divisor;

    if (reducedW > 50 || reducedH > 50) {
        return `${(width / height).toFixed(2)}:1`;
    }

    return `${reducedW}:${reducedH}`;
};

const updateDisplaySizeValue = () => {
    // CSS の 1in は仕様上 96px 固定 (CSS基準DPI)
    const dpiCalculator = document.getElementById('dpi-calculator');
    const cssDpi = dpiCalculator && dpiCalculator.offsetWidth ? dpiCalculator.offsetWidth : 96;
    dpi.value = cssDpi;

    const dpr = window.devicePixelRatio || 1;
    const rawWidth = Math.round(window.screen.width * dpr);
    const rawHeight = Math.round(window.screen.height * dpr);

    // 一般的な解像度へのスナップ（丸め誤差の修正）
    screenWidth.value = snapToCommonDimension(rawWidth);
    screenHeight.value = snapToCommonDimension(rawHeight);

    // デバイス種別の判定と論理密度の取得
    const profile = detectDeviceProfile();
    const baseLogicalPpi = profile.baseLogicalPpi;

    // 対角インチ = CSS論理ピクセルの対角長 ÷ デバイス基準の論理ピクセル密度
    const diagLogicalPx = Math.sqrt(window.screen.width ** 2 + window.screen.height ** 2);
    const inches = diagLogicalPx / baseLogicalPpi;

    screenInches.value = inches;
    roundedInches.value = Math.round(inches);
    floorInches.value = truncateToDecimal(inches, 2);

    // 物理ピクセル密度 (PPI) = 物理対角ピクセル ÷ 対角インチ
    const diagPhysicalPx = Math.sqrt(screenWidth.value ** 2 + screenHeight.value ** 2);
    ppi.value = inches > 0 ? Math.round(diagPhysicalPx / inches) : Math.round(cssDpi * dpr);
};

const truncateToDecimal = (value: number, decimals: number) => {
    const factor = Math.pow(10, decimals);
    return Math.floor(value * factor) / factor;
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
                            <div class="text-h6">{{ getText('app.screen_size') }}</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="text-center q-py-md">
                                <div class="text-h2 text-weight-bold text-primary">{{ roundedInches }}"</div>
                                <div class="text-subtitle1 text-grey-7">{{ floorInches }} {{ getText('app.inches') }}</div>
                                <div class="text-caption text-grey-6 q-mt-xs">{{ getText('app.estimate_note') }}</div>
                            </div>

                            <q-list>
                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon name="monitor" color="primary" size="md" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ getText('app.diagonal') }}</q-item-label>
                                        <q-item-label caption>{{ floorInches }} {{ getText('app.inches') }}</q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-separator />

                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon name="swap_horiz" color="primary" size="md" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ getText('app.width') }}</q-item-label>
                                        <q-item-label caption>{{ screenWidth }} {{ getText('app.pixels') }}</q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-separator />

                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon name="swap_vert" color="primary" size="md" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ getText('app.height') }}</q-item-label>
                                        <q-item-label caption>{{ screenHeight }} {{ getText('app.pixels') }}</q-item-label>
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
                            <div class="text-h6">{{ getText('app.device_info') }}</div>
                        </q-card-section>

                        <q-card-section>
                            <q-list>
                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon name="aspect_ratio" color="secondary" size="md" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ getText('app.resolution') }}</q-item-label>
                                        <q-item-label caption>{{ resolution }}</q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-separator />

                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon name="photo_size_select_small" color="secondary" size="md" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ getText('app.aspect_ratio') }}</q-item-label>
                                        <q-item-label caption>{{ aspectRatio }}</q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-separator />

                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon name="grain" color="secondary" size="md" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ getText('app.pixel_density') }}</q-item-label>
                                        <q-item-label caption>{{ ppi }} {{ getText('app.ppi') }}</q-item-label>
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

        <Footer :dark-mode="darkMode" :locale="locale" />
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
