<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
        default: () => ['ja', 'en', 'zh-CN', 'ko']
    }
});

const emit = defineEmits(['toggle-dark-mode', 'change-locale']);

const localeLabels = {
    'ja': '日本語',
    'en': 'English',
    'zh-CN': '中文',
    'ko': '한국어'
};

const languageMenu = ref(false);
</script>

<template>
    <q-header bordered :class="darkMode ? 'bg-dark' : 'bg-primary'" class="text-white">
        <q-toolbar>
            <q-toolbar-title class="row items-center">
                <q-icon name="monitor" size="md" class="q-mr-sm" />
                <span class="text-subtitle1 text-weight-bold">{{ t('app.title') }}</span>
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
                                </q-item-label>
                            </q-item-section>
                            <q-item-section avatar v-if="locale === lang">
                                <q-icon name="check" color="primary" />
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
