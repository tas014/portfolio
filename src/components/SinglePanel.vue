<script setup lang="ts">
import { ref } from 'vue'
defineProps<{
  panelId: number
  minimize: (id: number) => void
  maximize: (id: number) => void
  close: (id: number) => void
  drag: (event: MouseEvent | TouchEvent, container: HTMLElement | null) => void
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
      <h2>
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
    <div class="text-container">
      <p
        @click="
          (e) => {
            e.stopPropagation()
          }
        "
      >
        <slot> Default text </slot>
      </p>
      <ul class="links-container">
        <slot name="links"></slot>
      </ul>
    </div>
  </article>
</template>

<style>
.panel-container {
  position: absolute;
  background-color: var(--color-background);
  border-radius: 1rem;
  max-width: 30vw;
  border: 1px solid var(--hover-color-highlight);
}
.links-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  padding-left: 0px;
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
.panel-interactables {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  place-content: center;
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
.panel-interactables i:last-of-type {
  border-top-right-radius: 1rem;
}
.panel-interactables i:hover:last-of-type {
  background-color: #9b0b0b;
}
.title-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 1rem;
  height: 5rem;
  padding-left: 3rem;
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
}

.text-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem 3rem;
  min-height: 30vh;
}

.title-container h2,
.text-container {
  user-select: text;
}
</style>
