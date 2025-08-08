<script setup lang="ts">
import HomeHero from '@/components/HomeHero.vue'
import PanelsSection from '@/components/PanelsSection.vue'
import EnHomeContent from '@/content/en/home.json'
import EsHomeContent from '@/content/es/home.json'
import { languageKey } from '@/stores/lang'
import { inject } from 'vue'

const language = inject(languageKey)

const englishHeroContent = EnHomeContent.hero
const spanishHeroContent = EsHomeContent.hero
</script>

<template>
  <main>
    <HomeHero>
      {{ language === 'en' ? englishHeroContent : spanishHeroContent }}
    </HomeHero>
    <PanelsSection>
      {{ language === 'en' ? englishHeroContent : spanishHeroContent }}
    </PanelsSection>
  </main>
</template>
