<script setup lang="ts">
import { languageKey, type Language } from '@/stores/lang'
import { ref, computed, inject } from 'vue'
import ProjectGuide from '@/components/ProjectGuide.vue'
import EnContent from '@/content/en/energy.json'
import EsContent from '@/content/es/energy.json'

const language: Language = inject(languageKey, ref('en'))
const energyContent = computed(() => {
  if (language.value === 'es') {
    return EsContent.project
  }
  return EnContent.project
})
</script>
<template>
  <section>
    <ProjectGuide :content="energyContent" />
  </section>
</template>
<style scoped>
section {
  display: grid;
  place-content: center;
}
</style>
