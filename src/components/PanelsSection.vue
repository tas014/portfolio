<script setup lang="ts">
import { languageKey, type Language } from '@/stores/lang'
import { inject, computed, ref, type Ref } from 'vue'
import SinglePanel from './SinglePanel.vue'
import EnHomeContent from '@/content/en/home.json'
import EsHomeContent from '@/content/es/home.json'
import PortraitPanel from './PortraitPanel.vue'

type Coord = {
  left: string
  top: string
  zindex: number
}

type Panel = {
  id: number
  title: string
  description: string
  pos: Coord
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

const initialCoords: Coord[] = []
const populateInitialCoords = (): void => {
  for (let i = 0; i <= EnHomeContent.panels.length; i++) {
    // idea: change spreading based on even numbers
    const x = 10 + Math.floor(Math.random() * 60)
    const y = 10 + Math.floor(Math.random() * 40)
    initialCoords.push({
      left: `${x}%`,
      top: `${y}%`,
      zindex: i,
    })
  }
}
populateInitialCoords()
initialCoords.sort(() => 0.5 - Math.random())

const panelPositions = ref(initialCoords)
const language: Language = inject(languageKey, ref('en'))
const visiblePanels = computed(() => {
  if (language.value === 'es')
    return EsHomeContent.panels.map((panel, ind): Panel => {
      return {
        id: ind,
        pos: initialCoords[ind],
        ...panel,
      }
    })
  return EnHomeContent.panels.map((panel, ind): Panel => {
    return {
      id: ind,
      pos: initialCoords[ind],
      ...panel,
    }
  })
})
const minimizedPanels: Ref<MinimizedPanel[]> = ref([])

let maxZIndex = initialCoords.length
const minimizePanel = (panelId: number): void => {
  console.log(`Minimized panel ${panelId}`)
}
const maximizePanel = (panelId: number): void => {
  maxZIndex++
  console.log(`Maximized panel ${panelId} with Zindex ${maxZIndex}`)
}
const closePanel = (panelId: number): void => {
  console.log(`Closed panel ${panelId}`)
}

const draggableElement = ref<HTMLElement | null>(null)
const draggableElementPos = ref({
  x: 0,
  y: 0,
})

let startX = 0
let startY = 0
let isDragging = false
const dragStart = (event: MouseEvent | TouchEvent): void => {
  event.preventDefault()
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY
  startX = clientX - draggableElementPos.value.x
  startY = clientY - draggableElementPos.value.y
  isDragging = true
  // Add event listeners to the window to track movement and release
  window.addEventListener('mousemove', drag, { passive: false })
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', drag, { passive: false })
  window.addEventListener('touchend', stopDrag)
}
const drag = (event: MouseEvent | TouchEvent) => {
  if (!isDragging) return
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

  // Update the new position relative to the initial offset
  draggableElementPos.value.x = clientX - startX
  draggableElementPos.value.y = clientY - startY
}
const stopDrag = () => {
  isDragging = false

  // Remove the event listeners from the window to prevent memory leaks
  window.removeEventListener('mousemove', drag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', drag)
  window.removeEventListener('touchend', stopDrag)
}
</script>

<template>
  <section>
    <h1 class="about-title">{{ language === 'es' ? 'Sobre Mi' : 'About Me' }}</h1>
    <div class="visible-panels">
      <SinglePanel
        v-for="panel in visiblePanels"
        :key="panel.id"
        :panel-id="panel.id"
        :minimize="minimizePanel"
        :maximize="maximizePanel"
        :close="closePanel"
        :drag="dragStart"
        :style="{
          top: panelPositions[panel.id].top,
          left: panelPositions[panel.id].left,
          zIndex: panelPositions[panel.id].zindex,
          transform: `translate(${draggableElementPos.x}px, ${draggableElementPos.y}px)`,
        }"
        draggable="true"
        ref="draggableElement"
        @mousedown="drag"
        @touchstart="drag"
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
      <PortraitPanel
        :panel-id="-1"
        :key="-1"
        :maximize="maximizePanel"
        :minimize="minimizePanel"
        :close="closePanel"
        :drag="dragStart"
        :style="{
          top: panelPositions[panelPositions.length - 1].top,
          left: panelPositions[panelPositions.length - 1].left,
          zIndex: panelPositions[panelPositions.length - 1].zindex,
          transform: `translate(${draggableElementPos.x}px, ${draggableElementPos.y}px)`,
        }"
        draggable="true"
        ref="draggableElement"
        @mousedown="drag"
        @touchstart="drag"
      >
        <template #title>{{ language === 'es' ? 'retrato' : 'portrait' }}</template>
        {{ language === 'es' ? '¡Hola! Este soy yo.' : 'Hi! This is me' }}
      </PortraitPanel>
    </div>
    <ul class="minimized-panels">
      <li v-for="panel in minimizedPanels" :key="panel.id">
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
  min-height: 100vh;
}
.about-title {
  padding: 5rem;
  font-size: var(--primary-title);
}
</style>
