<script setup lang="ts">
import { Link } from "@inertiajs/inertia-vue3";
</script>

<template>
    <q-footer reveal bordered class="bg-grey-8 text-white q-pa-md text-center text-subtitle2">
        <div class="copyright text-center q-mb-xs">
            <Link :href="route('index')" class="q-mx-xs">ホーム</Link>
            <Link :href="route('privacy')" class="q-mx-xs">プライバシーポリシー</Link>
        </div>

        <div class="copyright text-center">
            Copyright © <a href="https://it-araiguma.com" target="_blank">ITアライグマ</a> AllRights Reserved.
        </div>
    </q-footer>
</template>

<style scoped>
.copyright {
    font-size: 14px;
}

.copyright>a {
    color: #fff;
}
</style>
