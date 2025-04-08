<script setup lang="ts">
import { Link } from "@inertiajs/inertia-vue3";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({
    darkMode: {
        type: Boolean,
        default: false
    }
});
</script>

<template>
    <q-footer reveal bordered :class="darkMode ? 'bg-dark' : 'bg-grey-8'" class="text-white q-pa-md">
        <div class="row justify-center q-mb-sm">
            <div class="col-auto q-mx-xs">
                <Link :href="route('index')" class="footer-link">{{ t('app.home') }}</Link>
            </div>
            <div class="col-auto q-mx-xs">
                <Link :href="route('privacy')" class="footer-link">{{ t('app.privacy_policy') }}</Link>
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
