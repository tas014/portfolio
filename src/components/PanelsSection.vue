<script setup lang="ts">
import { languageKey, type Language } from '@/stores/lang'
import { inject, ref, type Ref, onMounted, onUnmounted, watch, computed, onBeforeUpdate } from 'vue'
import SinglePanel from './SinglePanel.vue'
import EnHomeContent from '@/content/en/home.json'
import EsHomeContent from '@/content/es/home.json'
import PortraitPanel from './PortraitPanel.vue'

type Panel = {
  id: number
  title: string
  description: string
  minimized: boolean
  maximized: boolean
  prevStyle: Partial<CSSStyleDeclaration> | null
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
const renderedPanels = computed(() => {
  return panels.value.filter((pan) => !pan.minimized)
})
const dropBox = ref<HTMLElement | null>(null)
const dropBoxRect = ref<DOMRect | null>(null)

watch(
  language,
  (newLang) => {
    if (newLang === 'es') {
      panels.value = EsHomeContent.panels.map((panel, ind) => {
        return {
          id: ind,
          maximized: false,
          minimized: false,
          prevStyle: null,
          ...panel,
        }
      })
    } else {
      panels.value = EnHomeContent.panels.map((panel, ind) => {
        return {
          id: ind,
          maximized: false,
          minimized: false,
          prevStyle: null,
          ...panel,
        }
      })
    }
  },
  { immediate: true },
)

type PanelRef = {
  ref: HTMLElement
  id: number
}
const panelRefs = ref<PanelRef[]>([])
const highestZIndex = ref(10)

onBeforeUpdate(() => {
  panelRefs.value = []
})

const setPanelRef: any = (
  panel: InstanceType<typeof SinglePanel | typeof PortraitPanel>,
  id: number,
) => {
  if (panel && panel.container) {
    panelRefs.value?.push({
      ref: panel.container,
      id,
    })
  }
}

// Automatic shuffling
const shuffleFlag = computed(() => {
  let flag = true
  if (portrait.value.maximized) flag = false
  for (const pan of panels.value) {
    if (pan.maximized) {
      flag = false
      break
    }
  }
  return flag
})
let shuffleInterval: number
const startShuffle = () => {
  shuffleInterval = setInterval(() => {
    const len = panelRefs.value.length
    if (len <= 2 || !shuffleFlag.value) return
    const firstInd = Math.floor(Math.random() * len)
    let secondInd = Math.floor(Math.random() * len)
    if (secondInd === firstInd) {
      secondInd = secondInd + 1 >= len ? 0 : secondInd + 1
    }
    const firstPanel = panelRefs.value[firstInd].ref
    const secondPanel = panelRefs.value[secondInd].ref
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
  }, 2000)
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
const isPanelMaximized = computed(() => {
  if (portrait.value.maximized) return true
  for (const pan of panels.value) {
    if (pan.maximized) {
      return true
    }
  }
  return false
})
const portrait = ref({
  title: computed(() => {
    return language.value === 'es' ? 'retrato' : 'portrait'
  }),
  description: computed(() => {
    return language.value === 'es' ? '¡Hola! Este soy yo.' : 'Hi! This is me.'
  }),
  minimized: false,
  maximized: false,
  deleted: false,
  prevStyle: <Partial<CSSStyleDeclaration> | null>null,
})
const minimizePanel = (panelId: number) => {
  if (panelId === -1) {
    minimizedPanels.value.push({
      id: -1,
      title: portrait.value.title,
    })
    portrait.value.minimized = true
    return
  }
  const panelRef = panels.value.find((pan) => pan.id === panelId)
  if (panelRef) {
    panelRef.maximized = false
    panelRef.minimized = true
    minimizedPanels.value.push({
      id: panelRef.id,
      title: panelRef.title,
    })
  }
  console.log(`Minimized panel ${panelId}`)
}
const maximizePanel = (panelId: number) => {
  highestZIndex.value++

  // special portrait case
  if (panelId === -1) {
    if (portrait.value.minimized) {
      minimizedPanels.value = minimizedPanels.value.filter((pan) => pan.id !== -1)
      portrait.value.minimized = false
      return
    }
    const portraitRef = panelRefs.value.find((ref) => ref.id === -1)?.ref
    if (!portraitRef) {
      console.error('Portrait panel not found.')
      return
    }
    if (portrait.value.maximized) {
      if (portrait.value.prevStyle) {
        Object.assign(portraitRef.style, portrait.value.prevStyle)
        portrait.value.prevStyle = null
      }
    } else {
      portrait.value.prevStyle = {
        top: portraitRef.style.top,
        left: portraitRef.style.left,
        zIndex: portraitRef.style.zIndex,
      }
      portraitRef.style.top = '5%'
      portraitRef.style.left = '10%'
    }

    portrait.value.maximized = !portrait.value.maximized
    portraitRef.style.zIndex = `${highestZIndex.value}`
    console.log(`Maximized portrait panel with Zindex ${highestZIndex.value}`)
    return
  }

  // Normal Panels
  const panelObj = panels.value.find((pan) => pan.id === panelId)
  const panelRef = panelRefs.value.find((ref) => ref.id === panelId)?.ref

  if (!panelObj) return console.error('Panel not found.')
  if (panelObj.minimized) {
    minimizedPanels.value = minimizedPanels.value.filter((pan) => pan.id !== panelId)
    panelObj.minimized = false
    return
  }
  if (!panelRef) return console.error('Panel ref not found')
  if (panelObj.maximized) {
    if (panelObj.prevStyle) {
      Object.assign(panelRef.style, panelObj.prevStyle)
      panelObj.prevStyle = null
    }
  } else {
    panelObj.prevStyle = {
      top: panelRef.style.top,
      left: panelRef.style.left,
      zIndex: panelRef.style.zIndex,
    }
    panelRef.style.top = '5%'
    panelRef.style.left = '10%'
  }

  panelObj.maximized = !panelObj.maximized
  panelRef.style.zIndex = `${highestZIndex.value}`
  console.log(`Maximized panel ${panelId} with Zindex ${highestZIndex.value}`)
}

const closePanel = (panelId: number) => {
  const newMinimized = minimizedPanels.value.filter((pan) => pan.id !== panelId)
  minimizedPanels.value = newMinimized
  if (panelId === -1) {
    portrait.value.deleted = true
    return
  }
  const newPanels = panels.value.filter((pan) => pan.id !== panelId)
  panels.value = newPanels
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
  if (!panel || isPanelMaximized.value) return
  resetDraggableElementPos()
  draggableElementPos.value.draggedElement = panel

  panelRefs.value.forEach((panelRef) => {
    if (panel === panelRef.ref) {
      panelRef.ref.style.zIndex = `${highestZIndex.value + 1}`
      highestZIndex.value++
    }
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
    <div
      class="max-background"
      :style="{ zIndex: highestZIndex - 1 }"
      v-if="isPanelMaximized"
    ></div>
    <h1 class="about-title">{{ language === 'es' ? 'Sobre Mi' : 'About Me' }}</h1>
    <div class="visible-panels">
      <SinglePanel
        v-for="panel in renderedPanels"
        :key="panel.id"
        :panel-id="panel.id"
        :minimize="minimizePanel"
        :maximize="maximizePanel"
        :close="closePanel"
        :drag="dragStart"
        :ref="
          (e) => {
            setPanelRef(e, panel.id)
          }
        "
        @mouseover="handleMouseOver"
        @mouseleave="handleMouseLeave"
        :class="panel.maximized ? 'maximized' : ''"
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
        v-if="!portrait.minimized && !portrait.deleted"
        :panel-id="-1"
        :key="-1"
        :maximize="maximizePanel"
        :minimize="minimizePanel"
        :close="closePanel"
        :drag="dragStart"
        :ref="
          (e) => {
            setPanelRef(e, -1)
          }
        "
        @mouseover="handleMouseOver"
        @mouseleave="handleMouseLeave"
        :class="portrait.maximized ? 'maximized' : ''"
      >
        <template #title>{{ portrait.title }}</template>
        {{ portrait.description }}
      </PortraitPanel>
    </div>
    <ul class="minimized-panels">
      <li
        v-for="panel in minimizedPanels"
        :key="panel.id"
        @click="
          () => {
            maximizePanel(panel.id)
          }
        "
      >
        <div>
          <h2>{{ panel.title }}</h2>
          <div class="minimized-icon-container">
            <i class="pi pi-expand"></i>
            <i
              @click="
                () => {
                  closePanel(panel.id)
                }
              "
              class="pi pi-times"
            ></i>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
section {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--container-color-background);
  margin-top: 2vh;
  min-height: 100vh;
}
.minimized-panels {
  display: flex;
  margin-top: auto;
  border-top: solid 2px var(--hover-color-highlight);
  list-style: none;
  padding: 0px;
}
.minimized-panels h2 {
  padding-bottom: 5px;
}
.minimized-panels li {
  padding: 0rem 1rem;
  border-right: solid 1px var(--hover-color-highlight);
  transition: background-color 0.3s;
  cursor: pointer;
}
.minimized-panels li:hover {
  background-color: var(--color-highlight);
}
.minimized-panels li > div {
  display: flex;
  gap: 1rem;
}
.minimized-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.minimized-icon-container i {
  padding: 1rem;
  cursor: pointer;
}
.minimized-icon-container i:hover {
  background-color: var(--panel-button-hover);
}
.minimized-icon-container i:last-of-type:hover {
  background-color: #9b0b0b;
}
.maximized {
  position: fixed;
  left: 10%;
  max-width: 100%;
  width: 80%;
  height: 90%;
}
.max-background {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
}
.about-title {
  padding: 5rem;
}
.visible-panels article {
  transition:
    top var(--transition-time),
    left var(--transition-time),
    width 0.5s,
    height 0.5s;
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
