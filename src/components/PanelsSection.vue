<script setup lang="ts">
import { languageKey, type Language } from '@/stores/lang'
import {
  inject,
  ref,
  type Ref,
  onMounted,
  onUnmounted,
  watch,
  computed,
  onBeforeUpdate,
  nextTick,
  type ComputedRef,
} from 'vue'
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
  prevStyle: null | { top: string; left: string; zIndex: string }
  links: {
    text: string
    URL: string
    icon: string
    alt: string
    download?: boolean
  }[]
  top: string
  left: string
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
const initialPositions: { [string: string]: { top: string; left: string } } = {
  0: { top: '10%', left: '17%' },
  1: { top: '11%', left: '45%' },
  2: { top: '35%', left: '12%' },
  3: { top: '35%', left: '60%' },
  4: { top: '55%', left: '15%' },
  '-1': { top: '31%', left: '35%' },
}

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
          top: initialPositions[ind].top,
          left: initialPositions[ind].left,
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
          top: initialPositions[ind].top,
          left: initialPositions[ind].left,
        }
      })
    }
    nextTick(() => {
      setTimeout(() => {
        setInitialPositions()
        constrainAll()
      }, 200)
    })
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

const setInitialPositions = () => {
  const portraitRef = panelRefs.value.find((ref) => ref.id === -1)?.ref
  if (portraitRef) {
    const rect = portraitRef.getBoundingClientRect()
    if (dropBoxRect.value) {
      portrait.value.top = `${rect.top - dropBoxRect.value.top}px`
      portrait.value.left = `${rect.left - dropBoxRect.value.left}px`
    }
  }
  panels.value.forEach((panel) => {
    const panelRef = panelRefs.value.find((ref) => ref.id === panel.id)?.ref
    if (panelRef) {
      const rect = panelRef.getBoundingClientRect()
      if (dropBoxRect.value) {
        panel.top = `${rect.top - dropBoxRect.value.top}px`
        panel.left = `${rect.left - dropBoxRect.value.left}px`
      }
    }
  })
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
let shuffleTimeout: number
const startShuffle = () => {
  shuffleInterval = setInterval(() => {
    const len = panelRefs.value.length
    if (len <= 2 || !shuffleFlag.value) return
    const firstInd = Math.floor(Math.random() * len)
    let secondInd = Math.floor(Math.random() * len)
    if (secondInd === firstInd) {
      secondInd = secondInd + 1 >= len ? 0 : secondInd + 1
    }
    const firstPanelRef = panelRefs.value[firstInd]
    const firstPanelObj =
      firstPanelRef.id === -1
        ? portrait.value
        : panels.value.find((pan) => pan.id === firstPanelRef.id)
    const secondPanelRef = panelRefs.value[secondInd]
    const secondPanelObj =
      secondPanelRef.id === -1
        ? portrait.value
        : panels.value.find((pan) => pan.id === secondPanelRef.id)
    const firstPanelComputedStyles = window.getComputedStyle(firstPanelRef.ref)
    const secondPanelComputedStyles = window.getComputedStyle(secondPanelRef.ref)
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
    if (firstPanelObj && secondPanelObj) {
      firstPanelObj.top = secondPanelStyles.top
      firstPanelObj.left = secondPanelStyles.left
      firstPanelRef.ref.style.zIndex = secondPanelStyles.zIndex
      secondPanelObj.top = firstPanelStyles.top
      secondPanelObj.left = firstPanelStyles.left
      secondPanelRef.ref.style.zIndex = firstPanelStyles.zIndex
    }
    shuffleTimeout = setTimeout(() => {
      constrainWithinBounds(firstPanelRef.ref, secondPanelRef.ref)
    }, 500)
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

type Portrait = {
  id: number
  title: ComputedRef<string>
  description: ComputedRef<string>
  minimized: boolean
  maximized: boolean
  deleted: boolean
  top: string
  left: string
  prevStyle: {
    top: string
    left: string
    zIndex: string
  } | null
}

const portrait = ref<Portrait>({
  id: -1,
  title: computed(() => {
    return language.value === 'es' ? 'retrato' : 'portrait'
  }),
  description: computed(() => {
    return language.value === 'es' ? '¡Hola! Este soy *Yo*.' : 'Hi! This is *Me*.'
  }),
  minimized: false,
  maximized: false,
  deleted: false,
  top: initialPositions['-1'].top,
  left: initialPositions['-1'].left,
  prevStyle: <null | { top: string; left: string; zIndex: string }>null,
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
}
let maxMinTimeout: null | number = null
const maximizePanel = (panelId: number) => {
  highestZIndex.value++
  if (maxMinTimeout) clearTimeout(maxMinTimeout)
  // special portrait case
  if (panelId === -1) {
    if (portrait.value.minimized) {
      minimizedPanels.value = minimizedPanels.value.filter((pan) => pan.id !== -1)
      portrait.value.minimized = false
      const portraitRef = panelRefs.value.find((pan) => pan.id === -1)?.ref
      if (portraitRef)
        maxMinTimeout = setTimeout(() => {
          constrainWithinBounds(portraitRef)
        }, 500)
      return
    }
    const portraitRef = panelRefs.value.find((ref) => ref.id === -1)?.ref
    if (!portraitRef) {
      console.error('Portrait panel not found.')
      return
    }
    if (portrait.value.maximized) {
      if (portrait.value.prevStyle) {
        portraitRef.style.zIndex = portrait.value.prevStyle.zIndex
        portrait.value.top = portrait.value.prevStyle.top
        portrait.value.left = portrait.value.prevStyle.left
        portrait.value.prevStyle = null
        maxMinTimeout = setTimeout(() => {
          constrainWithinBounds(portraitRef)
        }, 500)
      }
    } else {
      portrait.value.prevStyle = {
        top: portrait.value.top,
        left: portrait.value.left,
        zIndex: portraitRef.style.zIndex,
      }
      portrait.value.top = '5%'
      portrait.value.left = '10%'
    }

    portrait.value.maximized = !portrait.value.maximized
    portraitRef.style.zIndex = `${highestZIndex.value}`
    return
  }

  // Normal Panels
  const panelObj = panels.value.find((pan) => pan.id === panelId)
  const panelRef = panelRefs.value.find((ref) => ref.id === panelId)?.ref

  if (!panelObj) return console.error('Panel not found.')
  if (panelObj.minimized) {
    minimizedPanels.value = minimizedPanels.value.filter((pan) => pan.id !== panelId)
    panelObj.minimized = false
    const currentPanelRef = panelRefs.value.find((pan) => pan.id === panelId)?.ref
    if (currentPanelRef)
      maxMinTimeout = setTimeout(() => {
        constrainWithinBounds(currentPanelRef)
      }, 500)
    return
  }
  if (!panelRef) return console.error('Panel ref not found')
  if (panelObj.maximized) {
    if (panelObj.prevStyle) {
      panelRef.style.zIndex = panelObj.prevStyle.zIndex
      panelObj.top = panelObj.prevStyle.top
      panelObj.left = panelObj.prevStyle.left
      panelObj.prevStyle = null
      maxMinTimeout = setTimeout(() => {
        constrainWithinBounds(panelRef)
      }, 500)
    }
  } else {
    panelObj.prevStyle = {
      top: panelObj.top,
      left: panelObj.left,
      zIndex: panelRef.style.zIndex,
    }
    panelObj.top = '5%'
    panelObj.left = '10%'
  }
  panelObj.maximized = !panelObj.maximized
  panelRef.style.zIndex = `${highestZIndex.value}`
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
}

const updateDropBoxRect = () => {
  if (dropBox.value) dropBoxRect.value = dropBox.value?.getBoundingClientRect()
}
let updateTimeoutId: null | number = null
const updatePanelsOnResize = () => {
  if (updateTimeoutId) clearTimeout(updateTimeoutId)
  updateTimeoutId = setTimeout(constrainAll, 300)
}
// Dragging logic

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
  updateDropBoxRect()
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
    constrainWithinBounds(element)
  }
  resetDraggableElementPos()
  // Remove listeners to prevent memory leaks
  window.removeEventListener('mousemove', drag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', drag)
  window.removeEventListener('touchend', stopDrag)
}

const constrainWithinBounds = (...elements: HTMLElement[]): void => {
  if (elements.length === 0) return
  updateDropBoxRect()
  // Constrain final position
  for (const el of elements) {
    const elementRef = panelRefs.value.find((pan) => pan.ref === el)
    const elementObj =
      elementRef?.id === -1 ? portrait.value : panels.value.find((pan) => pan.id === elementRef?.id)
    if (dropBoxRect.value && elementObj) {
      const elementRect = el.getBoundingClientRect()

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

      elementObj.top = `${finalTop}px`
      elementObj.left = `${finalLeft}px`
    }
  }
}
const constrainAll = () => {
  for (const pan of panelRefs.value) {
    constrainWithinBounds(pan.ref)
  }
}

onMounted(() => {
  window.addEventListener('resize', updateDropBoxRect)
  window.addEventListener('resize', updatePanelsOnResize)
  updateDropBoxRect()
  handleMouseLeave()
  setInitialPositions()
  setTimeout(constrainAll, 200)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateDropBoxRect)
  window.removeEventListener('resize', updatePanelsOnResize)
  clearInterval(shuffleInterval)
  if (maxMinTimeout) clearTimeout(maxMinTimeout)
  clearTimeout(shuffleTimeout)
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
    <span class="about-span">{{
      language === 'es' ? '¡Con paneles interactivos!' : 'With interactive panels!'
    }}</span>
    <div class="visible-panels">
      <SinglePanel
        v-for="panel in renderedPanels"
        :key="panel.id"
        :panel-id="panel.id"
        :minimize="minimizePanel"
        :maximize="maximizePanel"
        :close="closePanel"
        :drag="dragStart"
        :description="panel.description"
        :style="{
          top: panel.top,
          left: panel.left,
        }"
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
        <template #links>
          <li v-for="link in panel.links" :key="link.text + link.alt">
            <a
              v-if="link.download !== true"
              :href="link.URL"
              :target="link.URL === '#projects' ? '_self' : '_blank'"
              rel="noopener noreferrer"
            >
              <img :src="link.icon" :alt="link.alt" />
              <span>{{ link.text }}</span>
            </a>
            <a
              v-else
              :href="link.URL"
              :download="language === 'es' ? 'Curriculum' : 'Resume'"
              rel="noopener noreferrer"
            >
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
        :description="portrait.description"
        :style="{
          top: portrait.top,
          left: portrait.left,
        }"
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
  padding: 5rem 0rem 1rem 5rem;
}
.about-span {
  margin: 0rem 5rem;
  color: var(--color-highlight);
}
.visible-panels article {
  transition:
    top var(--transition-time),
    left var(--transition-time),
    width 0.5s,
    height 0.5s;
}
.visible-panels {
  margin-top: 2rem;
}
</style>
