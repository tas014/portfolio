<script setup lang="ts">
import { languageKey, type Language } from '@/stores/lang'
import { ref, computed, inject } from 'vue'
import ProjectGuide from '@/components/ProjectGuide.vue'
import EnContent from '@/content/en/chess.json'
import EsContent from '@/content/es/chess.json'

const language: Language = inject(languageKey, ref('en'))
const chessContent = computed(() => {
  if (language.value === 'es') {
    return EsContent
  }
  return EnContent
})
</script>
<template>
  <section>
    <ProjectGuide :content="chessContent" />
  </section>
</template>
<style scoped>
section {
  display: grid;
  place-content: center;
}
</style>
