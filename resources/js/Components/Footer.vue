<script setup lang="ts">
import { Link } from "@inertiajs/vue3";

const props = defineProps({
    darkMode: {
        type: Boolean,
        default: false
    },
    locale: {
        type: String,
        default: 'ja'
    }
});

// フッターの翻訳
const translations = {
    'ja': {
        'app.home': 'ホーム',
        'app.privacy_policy': 'プライバシーポリシー'
    },
    'en': {
        'app.home': 'Home',
        'app.privacy_policy': 'Privacy Policy'
    },
    'zh-CN': {
        'app.home': '首页',
        'app.privacy_policy': '隐私政策'
    },
    'ko': {
        'app.home': '홈',
        'app.privacy_policy': '개인정보 보호정책'
    },
    'fr': {
        'app.home': 'Accueil',
        'app.privacy_policy': 'Politique de confidentialité'
    },
    'es': {
        'app.home': 'Inicio',
        'app.privacy_policy': 'Política de privacidad'
    }
};

// 翻訳テキストを取得する関数
const getText = (key) => {
    const currentLocale = props.locale;
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
</script>

<template>
    <q-footer reveal bordered :class="darkMode ? 'bg-dark' : 'bg-grey-8'" class="text-white q-pa-md">
        <div class="row justify-center q-mb-sm">
            <div class="col-auto q-mx-xs">
                <Link :href="route('index')" class="footer-link">{{ getText('app.home') }}</Link>
            </div>
            <div class="col-auto q-mx-xs">
                <Link :href="route('privacy')" class="footer-link">{{ getText('app.privacy_policy') }}</Link>
            </div>
        </div>

        <div class="text-center text-caption q-mt-sm">
            Copyright &copy; <a href="https://it-araiguma.com" target="_blank" class="footer-link">ITアライグマ</a> AllRights
            Reserved.
        </div>
    </q-footer>
</template>

<style scoped>
.footer-link {
    color: #fff;
    text-decoration: none;
    opacity: 0.9;
    transition: opacity 0.2s;
}

.footer-link:hover {
    opacity: 1;
    text-decoration: underline;
}
</style>
