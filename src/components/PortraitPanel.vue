<script setup lang="ts">
defineProps<{
  panelId: number
  minimize: (id: number) => void
  maximize: (id: number) => void
  close: (id: number) => void
  drag: (event: MouseEvent | TouchEvent) => void
}>()
</script>

<template>
  <article class="panel-container">
    <div class="title-container" @mousedown="drag" @touchstart="drag">
      <h2>
        <slot name="title">
          <h2>Default title</h2>
        </slot>
      </h2>
      <div class="panel-interactables">
        <i @click="() => minimize(panelId)" class="pi pi-minus"></i>
        <i @click="() => maximize(panelId)" class="pi pi-expand"></i>
        <i @click="() => close(panelId)" class="pi pi-times"></i>
      </div>
    </div>
    <div class="portrait-container">
      <img src="/img/hero.jpeg" alt="a portrait of Franco" />
      <slot></slot>
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
  display: flex;
  flex-direction: column;
  text-align: center;
  padding-bottom: 1rem;
}
.portrait-container img {
  width: 60rem;
  margin-bottom: 1rem;
}
</style>
