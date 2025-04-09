<script lang="ts" setup>
import { ref } from 'vue';

defineProps({
    darkMode: {
        type: Boolean,
        default: false
    },
    locale: {
        type: String,
        default: 'ja'
    },
    availableLocales: {
        type: Array as () => string[],
        default: () => ['ja', 'en', 'zh-CN', 'ko', 'fr', 'es']
    }
});

const emit = defineEmits(['toggle-dark-mode', 'change-locale']);

const localeLabels = {
    'ja': '日本語',
    'en': 'English',
    'zh-CN': '中文',
    'ko': '한국어',
    'fr': 'Français',
    'es': 'Español'
};

const languageMenu = ref(false);

// アプリタイトルの翻訳
const appTitles = {
    'ja': '画面サイズチェッカー',
    'en': 'Screen Size Checker',
    'zh-CN': '屏幕尺寸检查器',
    'ko': '화면 크기 체커',
    'fr': 'Vérificateur de taille d\'écran',
    'es': 'Comprobador de tamaño de pantalla'
};

// 現在の言語に基づいてアプリタイトルを取得
const getAppTitle = (currentLocale: string) => {
    return appTitles[currentLocale] || appTitles['en'];
};
</script>

<template>
    <q-header bordered :class="darkMode ? 'bg-dark' : 'bg-primary'" class="text-white">
        <q-toolbar>
            <q-toolbar-title class="row items-center">
                <q-icon name="monitor" size="md" class="q-mr-sm" />
                <span class="text-subtitle1 text-weight-bold">{{ getAppTitle(locale) }}</span>
            </q-toolbar-title>

            <q-space />

            <!-- Language Selector -->
            <q-btn flat round icon="translate" class="q-mr-sm">
                <q-menu v-model="languageMenu" anchor="bottom right" self="top right">
                    <q-list style="min-width: 100px">
                        <q-item v-for="lang in availableLocales" :key="lang" clickable v-close-popup
                            @click="emit('change-locale', lang)">
                            <q-item-section>
                                <q-item-label :class="{ 'text-weight-bold': locale === lang }">
                                    {{ localeLabels[lang] }}
                                    <q-icon v-if="locale === lang" name="check" size="xs" class="q-ml-xs" />
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
            </q-btn>

            <!-- Dark Mode Toggle -->
            <q-btn flat round :icon="darkMode ? 'light_mode' : 'dark_mode'" @click="emit('toggle-dark-mode')" />
        </q-toolbar>
    </q-header>
</template>

<style scoped>
.q-toolbar {
    min-height: 60px;
}

.q-toolbar-title {
    font-size: 1.2rem;
}
</style>
