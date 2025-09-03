<script setup lang="ts">
import { swapLanguage, language } from '@/stores/lang'
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const isDisplayed = ref(false)
const hanldeLangSwap = (val: 'en' | 'es') => {
  if (language.value !== val) swapLanguage()
}
</script>
<template>
  <header>
    <div class="wrapper">
      <h1>Franco Picco</h1>
      <nav class="nav-menu">
        <RouterLink class="link" to="/">{{ language === 'es' ? 'Inicio' : 'Home' }}</RouterLink>
        <a class="link" href="/#projects">{{ language === 'es' ? 'Proyectos' : 'Projects' }}</a>
      </nav>
      <div class="flex-center languages-container" @click="() => (isDisplayed = !isDisplayed)">
        <i class="pi pi-globe dropdown-container">
          <div class="dropdown-languages" v-if="isDisplayed">
            <span @click="() => hanldeLangSwap('en')">EN</span>
            <span @click="() => hanldeLangSwap('es')">ES</span>
          </div>
        </i>
        <span>{{ language.toUpperCase() }}</span>
      </div>
    </div>
  </header>
</template>
<style scoped>
header {
  padding: 1rem 3rem;
}
.wrapper,
.nav-menu {
  display: flex;
  gap: 1rem;
}
.wrapper {
  justify-content: space-between;
  align-items: center;
  max-width: 2120px;
  box-sizing: border-box;
  margin: 0 auto;
  border: solid 1px var(--color-highlight);
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 1rem 2rem;
  transition: background-color 0.5s;
}
.wrapper:hover {
  background-color: var(--hover-color-highlight);
}
h1 {
  font-size: var(--secondary-title);
}
nav {
  justify-content: center;
}
.link {
  color: var(--color-text);
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.languages-container {
  gap: 0.5rem;
  cursor: pointer;
  transition: color 0.3s;
}
.languages-container:hover {
  color: var(--color-highlight);
}
.dropdown-container {
  position: relative;
}
.dropdown-languages {
  position: absolute;
  top: 4rem;
  left: 0px;
  display: grid;
  place-content: center;
  color: var(--color-text);
}
.dropdown-languages span {
  padding: 1rem;
  background-color: var(--hover-color-highlight);
  transition: all 0.5s;
}
.dropdown-languages span:hover {
  background-color: var(--color-highlight);
}

@media (max-width: 1500px) {
  .dropdown-languages {
    top: 3.5rem;
  }
}
</style>
