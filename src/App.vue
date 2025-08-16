<script setup lang="ts">
import { RouterView } from 'vue-router'
import { language, languageKey } from './stores/lang'
import { provide } from 'vue'
import FooterComponent from './components/FooterComponent.vue'
import HeaderComponent from './components/HeaderComponent.vue'

provide(languageKey, language)
</script>

<template>
  <HeaderComponent />
  <main>
    <RouterView />
  </main>
  <FooterComponent />
</template>

<style scoped></style>
