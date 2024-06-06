<script setup lang="ts">
import { onMounted, ref } from 'vue';

const screenWidth = ref(0);
const screenHeight = ref(0);
const dpi = ref(0);
const screenInches = ref(0);
const roundedInches = ref(0);
const floorInches = ref(0);

onMounted(() => {
    // window.addEventListener('resize', updateDimensions);
    // updateDimensions();
    const dpiCalculator = document.getElementById('dpi-calculator');
    if (dpiCalculator) {
        dpi.value = dpiCalculator.offsetWidth;
    }

    screenWidth.value = window.screen.width;
    screenHeight.value = window.screen.height;

    screenInches.value = calculateScreenInches(screenWidth.value, screenHeight.value, dpi.value);
    roundedInches.value = Math.round(screenInches.value);
    floorInches.value = truncateToDecimal(screenInches.value, 2);
    console.log(floorInches.value);
});

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
    <q-layout view="hHh lpR fFf">

        <q-header bordered class="bg-primary text-white">
            <q-toolbar>
                <q-toolbar-title>
                    画面サイズ確認
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-page-container class="container q-ma-lg">
            <div id="dpi-calculator" style="width:1in; height:1in; position:absolute; left:-100%; top:-100%;"></div>
            <div class="q-mt-lg">
                <p class="text-h3">現在の画面サイズ</p>
                <p class="text-h6">幅: {{ screenWidth }} px</p>
                <p class="text-h6">高さ: {{ screenHeight }} px</p>
                <p class="text-h6">DPI: {{ dpi }}</p>
                <p class="text-h6">サイズ: 約{{ roundedInches }}({{ floorInches }})インチ</p>
            </div>
        </q-page-container>

        <q-footer reveal bordered class="bg-grey-8 text-white q-pa-md text-center">
            Copyright © <a href="https://x.com/it_araiguma" target="_blank">Saasで働くアライグマ</a> AllRights Reserved.
        </q-footer>
    </q-layout>
</template>

<style>
.container {
    max-width: 800px;
    margin: 0 auto;
}

.content {
    text-align: right;
}
</style>
