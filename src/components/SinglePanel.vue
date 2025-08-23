<script setup lang="ts">
import { ref } from 'vue'
import { styleText } from './utils/textFormat'
defineProps<{
  panelId: number
  minimize: (id: number) => void
  maximize: (id: number) => void
  close: (id: number) => void
  drag: (event: MouseEvent | TouchEvent, container: HTMLElement | null) => void
  description: string
}>()
const container = ref<HTMLElement | null>(null)
defineExpose({ container })
</script>

<template>
  <article ref="container" class="panel-container">
    <div
      class="title-container"
      @mousedown="
        (e) => {
          drag(e, container)
        }
      "
      @touchstart="
        (e) => {
          drag(e, container)
        }
      "
    >
      <h2 class="panel-title">
        <slot name="title">
          <h2
            @click="
              (e) => {
                e.stopPropagation()
              }
            "
          >
            Default title
          </h2>
        </slot>
      </h2>
      <div class="panel-interactables">
        <i
          @click="
            (e) => {
              e.stopPropagation()
              minimize(panelId)
            }
          "
          class="pi pi-minus"
        ></i>
        <i
          @click="
            (e) => {
              e.stopPropagation()
              maximize(panelId)
            }
          "
          class="pi pi-expand"
        ></i>
        <i
          @click="
            (e) => {
              e.stopPropagation()
              close(panelId)
            }
          "
          class="pi pi-times"
        ></i>
      </div>
    </div>
    <div class="text-wrapper">
      <div class="text-container">
        <p
          v-html="styleText(description)"
          @click="
            (e) => {
              e.stopPropagation()
            }
          "
          class="panel-description"
        ></p>
      </div>
      <ul class="links-container">
        <slot name="links"></slot>
      </ul>
    </div>
  </article>
</template>

<style>
.panel-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
  border-radius: 1rem;
  width: 70rem;
  border: 1px solid var(--hover-color-highlight);
}
.links-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  padding-left: 0px;
  margin-top: 1rem;
}
.links-container a {
  display: flex;
  gap: 1rem;
  width: fit-content;
}
.links-container img {
  width: 2rem;
  object-fit: scale-down;
}
.panel-title {
  color: #fff;
}
.panel-interactables {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  align-items: stretch;
}
.panel-interactables i {
  cursor: pointer;
  display: grid;
  place-content: center;
  padding: 0rem 2rem;
  color: #fff;
}
.panel-interactables i:hover {
  background-color: var(--panel-button-hover);
}
.panel-interactables i:hover:last-of-type {
  background-color: #9b0b0b;
}
.title-container {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  height: fit-content;
  border-bottom: 1px solid var(--hover-color-highlight);
  background-color: var(--panel-title-color-background);
  overflow: hidden;
  cursor: grab;
  transition: background-color 0.3s;
}
.title-container:hover {
  background-color: var(--color-highlight);
}
.title-container h2 {
  padding-right: 1rem;
  padding: 1rem 0rem 1rem 3rem;
}
.panel-description {
  justify-self: center;
}

.text-container {
  display: flex;
  max-height: 60vh;
  overflow-y: scroll;
}

.text-wrapper {
  padding: 2rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 30vh;
  flex-grow: 1;
}

.title-container h2,
.text-container {
  user-select: text;
}
.green-text {
  color: #a0ea97;
}
.red-text {
  color: #a55b62;
}
.purple-text {
  color: #7d6ac1;
}
.yellow-text {
  color: #cab57d;
}
.maximize-icon {
  display: none;
}

@media (max-width: 1700px) {
  .panel-container {
    width: 60rem;
  }
}
@media (max-width: 1400px) {
  .panel-container {
    width: 50rem;
  }
}
@media (max-width: 1200px) {
  .panel-container {
    width: 40rem;
  }
}
@media (max-width: 1000px) {
  .panel-container {
    width: 100%;
    position: static;
    margin-bottom: 1rem;
  }
  .text-container {
    max-height: none;
  }
  .maximize-icon {
    display: block;
  }
}
</style>
