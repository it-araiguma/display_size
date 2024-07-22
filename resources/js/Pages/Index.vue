<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Header from '../Components/Header.vue';
import Footer from '../Components/Footer.vue';

const screenWidth = ref(0);
const screenHeight = ref(0);
const dpi = ref(0);
const screenInches = ref(0);
const roundedInches = ref(0);
const floorInches = ref(0);

onMounted(() => {
    const dpiCalculator = document.getElementById('dpi-calculator');
    if (dpiCalculator) {
        dpi.value = dpiCalculator.offsetWidth;
    }

    screenWidth.value = window.screen.width;
    screenHeight.value = window.screen.height;

    screenInches.value = calculateScreenInches(screenWidth.value, screenHeight.value, dpi.value);
    roundedInches.value = Math.round(screenInches.value);
    floorInches.value = truncateToDecimal(screenInches.value, 2);
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
        <Header />
        <q-page-container class="container q-ma-lg">
            <div id="dpi-calculator"></div>
            <div class="q-ma-lg">
                <p class="text-h4 text-grey-7">
                    現在の画面サイズ
                </p>
                <p class="text-h6 text-grey-7">
                    <q-icon class="q-mb-xs" name="sync_alt" /> 幅 : {{ screenWidth }} px
                </p>
                <p class="text-h6 text-grey-7">
                    <q-icon class="q-mb-xs" name="height" /> 縦 : {{ screenHeight }} px
                </p>
                <p class="text-h6 text-grey-7">
                    DPI: {{ dpi }}
                </p>
                <p class="text-h6 text-grey-7">
                    <q-icon class="q-mb-xs" name="monitor" /> : 約{{ roundedInches }}({{ floorInches }}) inch
                </p>
            </div>
        </q-page-container>
        <Footer />
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

#dpi-calculator {
    width: 1in;
    height: 1in;
    position: absolute;
    left: -100%;
    top: -100%;
}
</style>
