<script setup lang="ts">
import { languageKey, type Language } from '@/stores/lang'
import { inject, computed, ref, type Ref } from 'vue'
import SinglePanel from './SinglePanel.vue'
import EnHomeContent from '@/content/en/home.json'
import EsHomeContent from '@/content/es/home.json'

type Panel = {
  id: number
  title: string
  description: string
  links: {
    text: string
    URL: string
    icon: string
    alt: string
  }[]
}

type MinimizedPanel = {
  id: number
  title: string
}

const language: Language = inject(languageKey, ref('en'))
const visiblePanels = computed(() => {
  if (language.value === 'es')
    return EsHomeContent.panels.map((panel, ind): Panel => {
      return {
        id: ind,
        ...panel,
      }
    })
  return EnHomeContent.panels.map((panel, ind): Panel => {
    return {
      id: ind,
      ...panel,
    }
  })
})
const minimizedPanels: Ref<MinimizedPanel[]> = ref([])

const minimizePanel = (panelId: number): void => {
  console.log(`Minimized panel ${panelId}`)
}
const maximizePanel = (panelId: number): void => {
  console.log(`Maximized panel ${panelId}`)
}
const closePanel = (panelId: number): void => {
  console.log(`Closed panel ${panelId}`)
}
</script>

<template>
  <section>
    <div class="visible-panels">
      <SinglePanel
        v-for="panel in visiblePanels"
        v-bind:key="panel.id"
        :panel-id="panel.id"
        :minimize="minimizePanel"
        :maximize="maximizePanel"
        :close="closePanel"
      >
        <template #title>{{ panel.title }}</template>
        {{ panel.description }}
        <template #links>
          <li v-for="link in panel.links" :key="link.text + link.alt">
            <a :href="link.URL" target="_blank" rel="noopener noreferrer">
              <img :src="link.icon" :alt="link.alt" />
              <span>{{ link.text }}</span>
            </a>
          </li>
        </template>
      </SinglePanel>
    </div>
    <ul class="minimized-panels">
      <li v-for="panel in minimizedPanels" v-bind:key="panel.id">
        <div>
          <h2>{{ panel.title }}</h2>
          <div>
            <i class="pi pi-expand"></i>
            <i class="pi pi-times"></i>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
section {
  position: relative;
  background-color: var(--container-color-background);
  margin-top: 2vh;
}
</style>
