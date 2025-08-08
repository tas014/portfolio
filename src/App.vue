<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { swapLanguage, language, languageKey } from './stores/lang'
import { provide } from 'vue'

provide(languageKey, language)
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="nav-menu">
        <button @click="swapLanguage">Change Language</button>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/projects">Projects</RouterLink>
      </nav>
    </div>
  </header>
  <main>
    <RouterView />
  </main>
  <footer>
    <h3>My Footer</h3>
  </footer>
</template>

<style scoped>
.wrapper,
.nav-menu {
  display: flex;
}
.wrapper {
  justify-content: flex-end;
}
nav {
  justify-content: center;
}
</style>
