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
      <h2>
        <slot name="title">
          <h2>Default title</h2>
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
    <div class="portrait-container">
      <img src="/img/portrait.webp" alt="a portrait of Franco" />
      <p v-html="styleText(description)"></p>
      <div>
        <div class="contacts-container">
          <a href="https://github.com/tas014" target="_blank" rel="noopener noreferrer">
            <i class="pi pi-github"></i>
            <span>GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/franco-picco/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="pi pi-linkedin"></i>
            <span>LinkedIn</span>
          </a>
          <a href="mailto:francopiccobusiness@gmail.com" target="_blank" rel="noopener noreferrer">
            <i class="pi pi-envelope"></i>
            <span>Mail</span>
          </a>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.portrait-container:hover .contacts-container {
  visibility: visible;
}
.contacts-container {
  visibility: hidden;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  justify-content: space-around;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
}
.contacts-container {
  visibility: hidden;
  display: flex;
  justify-content: space-around;
}
.contacts-container a {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.portrait-container {
  position: relative;
  height: 90%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  padding-bottom: 1rem;
}
.portrait-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  margin-bottom: 1rem;
}
</style>
