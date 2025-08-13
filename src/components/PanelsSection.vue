<script setup lang="ts">
import { languageKey, type Language } from '@/stores/lang'
import { inject, ref, type Ref, onMounted, onUnmounted, watch } from 'vue'
import SinglePanel from './SinglePanel.vue'
import EnHomeContent from '@/content/en/home.json'
import EsHomeContent from '@/content/es/home.json'
import PortraitPanel from './PortraitPanel.vue'

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
const panels = ref<Panel[]>([])
const dropBox = ref<HTMLElement | null>(null)
const dropBoxRect = ref<DOMRect | null>(null)

watch(
  language,
  (newLang) => {
    if (newLang === 'es') {
      panels.value = EsHomeContent.panels.map((panel, ind) => {
        return {
          id: ind,
          ...panel,
        }
      })
    } else {
      panels.value = EnHomeContent.panels.map((panel, ind) => {
        return {
          id: ind,
          ...panel,
        }
      })
    }
  },
  { immediate: true },
)

const panelRefs = ref<HTMLElement[]>([])
const highestZIndex = ref(0)

let initialized = false
watch(
  panelRefs,
  (newValue) => {
    if (!initialized) {
      initialized = true
      highestZIndex.value = newValue.length
    }
  },
  { deep: true },
)

const setPanelRef: any = (panel: InstanceType<typeof SinglePanel | typeof PortraitPanel>) => {
  if (panel && panel.container) {
    panelRefs.value?.push(panel.container)
  }
}

// Automatic shuffling
let shuffleInterval: number
const startShuffle = () => {
  shuffleInterval = setInterval(() => {
    const len = panelRefs.value.length
    const firstInd = Math.floor(Math.random() * len)
    let secondInd = Math.floor(Math.random() * len)
    if (secondInd === firstInd) {
      secondInd = secondInd + (1 % len)
    }
    const firstPanel = panelRefs.value[firstInd]
    const secondPanel = panelRefs.value[secondInd]
    const firstPanelComputedStyles = window.getComputedStyle(firstPanel)
    const secondPanelComputedStyles = window.getComputedStyle(secondPanel)
    const firstPanelStyles = {
      top: firstPanelComputedStyles.top,
      left: firstPanelComputedStyles.left,
      zIndex: firstPanelComputedStyles.zIndex,
    }
    const secondPanelStyles = {
      top: secondPanelComputedStyles.top,
      left: secondPanelComputedStyles.left,
      zIndex: secondPanelComputedStyles.zIndex,
    }
    for (const key in firstPanelStyles) {
      const styleProperty = key as 'top' | 'left' | 'zIndex'
      firstPanel.style[styleProperty] = secondPanelStyles[styleProperty]
      secondPanel.style[styleProperty] = firstPanelStyles[styleProperty]
    }
  }, 3000)
}
const handleMouseOver = () => {
  clearInterval(shuffleInterval)
  dropBox.value?.style.setProperty('--transition-time', '0s')
}
const handleMouseLeave = () => {
  dropBox.value?.style.setProperty('--transition-time', '0.5s')
  startShuffle()
}

// Button actions logic
const minimizedPanels: Ref<MinimizedPanel[]> = ref([])
const minimizePanel = (panelId: number): void => {
  console.log(`Minimized panel ${panelId}`)
}
const maximizePanel = (panelId: number): void => {
  highestZIndex.value++
  console.log(`Maximized panel ${panelId} with Zindex ${highestZIndex.value}`)
}
const closePanel = (panelId: number): void => {
  console.log(`Closed panel ${panelId}`)
}

// Dragging logic
const updateDropBoxRect = () => {
  if (dropBox.value) dropBoxRect.value = dropBox.value?.getBoundingClientRect()
}

type Draggable = {
  x: number
  y: number
  draggedElement: HTMLElement | null
}
const draggableElementPos = ref<Draggable>({
  x: 0,
  y: 0,
  draggedElement: null,
})
const resetDraggableElementPos = () => {
  if (draggableElementPos.value.draggedElement) {
    draggableElementPos.value.draggedElement.style.transform = ''
  }
  draggableElementPos.value = {
    x: 0,
    y: 0,
    draggedElement: null,
  }
}

let startX = 0
let startY = 0
let isDragging = false

const dragStart = (event: MouseEvent | TouchEvent, panel: HTMLElement | null): void => {
  event.preventDefault()
  if (!panel) return
  draggableElementPos.value.draggedElement = panel
  panelRefs.value = panelRefs.value.map((panelRef) => {
    if (panel === panelRef) {
      panel.style.zIndex = `${highestZIndex.value + 1}`
      highestZIndex.value++
    }
    return panel
  })
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY
  startX = clientX - draggableElementPos.value.x
  startY = clientY - draggableElementPos.value.y
  isDragging = true
  // Add listeners to the window to track movement and release
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
  if (draggableElementPos.value.draggedElement)
    draggableElementPos.value.draggedElement.style.transform = `translate(${draggableElementPos.value.x}px, ${draggableElementPos.value.y}px)`
}

const stopDrag = () => {
  isDragging = false
  // Constrain final position
  if (draggableElementPos.value.draggedElement && dropBoxRect.value) {
    const element = draggableElementPos.value.draggedElement
    const elementRect = element.getBoundingClientRect()

    // Calculate final top and left positions relative to the container
    let finalLeft = elementRect.left - dropBoxRect.value.left
    let finalTop = elementRect.top - dropBoxRect.value.top

    // Constrain the final position within the container's bounds
    finalLeft = Math.floor(
      Math.max(0, Math.min(finalLeft, dropBoxRect.value.width - elementRect.width)),
    )
    finalTop = Math.floor(
      Math.max(0, Math.min(finalTop, dropBoxRect.value.height - elementRect.height)),
    )

    element.style.top = `${finalTop}px`
    element.style.left = `${finalLeft}px`
  }
  resetDraggableElementPos()
  // Remove listeners to prevent memory leaks
  window.removeEventListener('mousemove', drag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', drag)
  window.removeEventListener('touchend', stopDrag)
}
onMounted(() => {
  window.addEventListener('resize', updateDropBoxRect)
  updateDropBoxRect()
  handleMouseLeave()
})
onUnmounted(() => {
  window.removeEventListener('resize', updateDropBoxRect)
  clearInterval(shuffleInterval)
})
</script>

<template>
  <section ref="dropBox">
    <h1 class="about-title">{{ language === 'es' ? 'Sobre Mi' : 'About Me' }}</h1>
    <div class="visible-panels">
      <SinglePanel
        v-for="panel in panels"
        :key="panel.id"
        :panel-id="panel.id"
        :minimize="minimizePanel"
        :maximize="maximizePanel"
        :close="closePanel"
        :drag="dragStart"
        :ref="setPanelRef"
        @mouseover="handleMouseOver"
        @mouseleave="handleMouseLeave"
        draggable="true"
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
        :ref="setPanelRef"
        draggable="true"
        @mouseover="handleMouseOver"
        @mouseleave="handleMouseLeave"
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
.visible-panels article {
  transition:
    top var(--transition-time),
    left var(--transition-time);
}
.visible-panels article:nth-child(1) {
  top: 10%;
  left: 17%;
  z-index: 1;
}
.visible-panels article:nth-child(2) {
  top: 11%;
  left: 45%;
  z-index: 2;
}
.visible-panels article:nth-child(3) {
  top: 35%;
  left: 12%;
  z-index: 3;
}
.visible-panels article:nth-child(4) {
  top: 35%;
  left: 65%;
  z-index: 4;
}
.visible-panels article:nth-child(5) {
  top: 55%;
  left: 15%;
  z-index: 5;
}
.visible-panels article:nth-child(6) {
  top: 55%;
  left: 50%;
  z-index: 6;
}
.visible-panels article:nth-child(7) {
  top: 31%;
  left: 35%;
  z-index: 7;
}
</style>
