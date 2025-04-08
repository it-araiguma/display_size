<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Header from '../Components/Header.vue';
import Footer from '../Components/Footer.vue';

const { t, locale } = useI18n();
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

const changeLocale = (newLocale: string) => {
    locale.value = newLocale;
    localStorage.setItem('locale', newLocale);
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
                            <div class="text-h6">{{ t('app.screen_size') }}</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="text-center q-py-md">
                                <div class="text-h2 text-weight-bold text-primary">{{ roundedInches }}"</div>
                                <div class="text-subtitle1 text-grey-7">{{ floorInches }} {{ t('app.inches') }}</div>
                            </div>

                            <q-list>
                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon name="monitor" color="primary" size="md" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ t('app.diagonal') }}</q-item-label>
                                        <q-item-label caption>{{ floorInches }} {{ t('app.inches') }}</q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-separator />

                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon name="swap_horiz" color="primary" size="md" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ t('app.width') }}</q-item-label>
                                        <q-item-label caption>{{ screenWidth }} {{ t('app.pixels') }}</q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-separator />

                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon name="swap_vert" color="primary" size="md" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ t('app.height') }}</q-item-label>
                                        <q-item-label caption>{{ screenHeight }} {{ t('app.pixels') }}</q-item-label>
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
                            <div class="text-h6">{{ t('app.device_info') }}</div>
                        </q-card-section>

                        <q-card-section>
                            <q-list>
                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon name="aspect_ratio" color="secondary" size="md" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ t('app.resolution') }}</q-item-label>
                                        <q-item-label caption>{{ resolution }}</q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-separator />

                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon name="photo_size_select_small" color="secondary" size="md" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ t('app.aspect_ratio') }}</q-item-label>
                                        <q-item-label caption>{{ aspectRatio }}</q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-separator />

                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon name="grain" color="secondary" size="md" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ t('app.pixel_density') }}</q-item-label>
                                        <q-item-label caption>{{ ppi }} {{ t('app.ppi') }}</q-item-label>
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
    color: #f5f5f5;
}

.body--dark .q-card {
    background-color: #1e1e1e;
    color: #f5f5f5;
}

.body--dark .q-item {
    color: #f5f5f5;
}

.body--dark .q-separator {
    background-color: rgba(255, 255, 255, 0.12);
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
</style>
