<script setup lang="ts">
defineProps<{
  panelId: number
  minimize: (id: number) => void
  maximize: (id: number) => void
  close: (id: number) => void
}>()
</script>

<template>
  <article class="panel-container">
    <div class="title-container">
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
    <div class="text-container">
      <p>
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
  background-color: var(--color-background);
  border-radius: 1rem;
  max-width: 50%;
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
  background-color: var(--hover-color-highlight);
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
}

.text-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem 3rem;
  min-height: 30vh;
}
</style>
