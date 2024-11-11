<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue';
import Header from '../Components/Header.vue';
import Footer from '../Components/Footer.vue';

const screenWidth = ref(0);
const screenHeight = ref(0);
const dpi = ref(0);
const screenInches = ref(0);
const roundedInches = ref(0);
const floorInches = ref(0);

onMounted(() => {
  updateDisplaySizeValue();
  window.addEventListener('resize', updateDisplaySizeValue);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateDisplaySizeValue);
});


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
  <q-layout view="hHh lpR fFf">
    <Header/>
    <q-page-container class="container q-ma-lg">
      <div id="dpi-calculator"></div>
      <div class="q-ma-lg">
        <p class="text-h4 text-grey-7">
          現在の画面サイズ
        </p>
        <p class="text-grey-7">
          <q-icon class="q-mb-xs" name="sync_alt"/>
          <span class="text-subtitle1">幅 : </span>{{ screenWidth }}
          px
        </p>
        <p class="text-grey-7">
          <q-icon class="q-mb-xs" name="height"/>
          縦 : {{ screenHeight }} px
        </p>
        <p class="text-grey-7">
          DPI : {{ dpi }}
        </p>
        <p class="text-grey-7">
          <q-icon class="q-mb-xs" name="monitor"/>
          : 約{{ roundedInches }}({{ floorInches }}) inch
        </p>
      </div>
    </q-page-container>
    <Footer/>
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

body {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  line-height: 1.5;
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
