<script setup lang="ts">
import { languageKey, type Language } from '@/stores/lang'
import { computed, inject, ref } from 'vue'
import EsChessContent from '@/content/es/chess.json'
import EnChessContent from '@/content/en/chess.json'
import EsEnergyContent from '@/content/es/energy.json'
import EnEnergyContent from '@/content/en/energy.json'
import ProjectPreview from './ProjectPreview.vue'

const language: Language = inject(languageKey, ref('en'))
const chessContent = computed(() => {
  if (language.value === 'es') {
    return EsChessContent
  }
  return EnChessContent
})
const energyContent = computed(() => {
  if (language.value === 'es') {
    return EsEnergyContent
  }
  return EnEnergyContent
})
</script>
<template>
  <section class="projects-section" id="projects">
    <h1>{{ language === 'es' ? 'Mis Proyectos' : 'My Projects' }}</h1>
    <div class="wrapper">
      <ProjectPreview :content="chessContent" />
      <ProjectPreview :content="energyContent" />
    </div>
  </section>
</template>
<style scoped>
.projects-section {
  padding: 5rem 3rem;
  background-color: var(--container-color-background);
  margin-top: 5rem;
}
.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 10rem;
  margin-top: 4rem;
}

@media (max-width: 1000px) {
  .wrapper {
    grid-template-columns: 1fr;
  }
}
</style>
