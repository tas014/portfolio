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
      <nav class="nav-menu">
        <div class="flex-center languages-container" @click="() => (isDisplayed = !isDisplayed)">
          <i class="pi pi-globe dropdown-container">
            <div class="dropdown-languages" v-if="isDisplayed">
              <span @click="() => hanldeLangSwap('en')">EN</span>
              <span @click="() => hanldeLangSwap('es')">ES</span>
            </div>
          </i>
          <span>{{ language.toUpperCase() }}</span>
        </div>
        <RouterLink class="link" to="/">Home</RouterLink>
        <RouterLink class="link" to="/projects">Projects</RouterLink>
      </nav>
    </div>
  </header>
</template>
<style scoped>
header {
  background-color: var(--color-highlight);
  padding: 1rem 3rem;
}
.wrapper,
.nav-menu {
  display: flex;
  gap: 1rem;
}
.wrapper {
  justify-content: flex-end;
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
}
.dropdown-container {
  position: relative;
}
.dropdown-languages {
  position: absolute;
  top: 3.4rem;
  left: 0px;
  display: grid;
  place-content: center;
}
.dropdown-languages span {
  padding: 1rem;
  background-color: var(--hover-color-highlight);
  transition: all 0.5s;
}
.dropdown-languages span:hover {
  background-color: var(--color-highlight);
}
</style>
