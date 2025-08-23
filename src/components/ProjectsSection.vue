<script setup lang="ts">
import { languageKey, type Language } from '@/stores/lang'
import { computed, inject, ref } from 'vue'
import EsChessContent from '@/content/es/chess.json'
import EnChessContent from '@/content/en/chess.json'
import EsEnergyContent from '@/content/es/energy.json'
import EnEnergyContent from '@/content/en/energy.json'

const language: Language = inject(languageKey, ref('en'))
const chessContent = computed(() => {
  if (language.value === 'es') {
    return EsChessContent
  }
  return EnChessContent
})
const energyContent = computed(() => {
  if (language.value === 'es') {
    return EsEnergyContent
  }
  return EnEnergyContent
})
</script>
<template>
  <section class="projects-section" id="projects">
    <h1>{{ language === 'es' ? 'Mis Proyectos' : 'My Projects' }}</h1>
    <div class="wrapper">
      <article class="project-container">
        <a href="/projects/chess-app" class="project-link">
          <div class="project-img-container">
            <img src="/img/chess-ss.webp" alt="A picture of the chess project UI" />
          </div>
          <h3>{{ chessContent.title }}</h3>
        </a>
        <p>
          {{ chessContent.description }}
        </p>
      </article>
      <article class="project-container">
        <a href="/projects/energy-app" class="project-link">
          <div class="project-img-container">
            <img src="/img/cpt-ss.webp" alt="A picture of the energy project UI" />
          </div>
          <h3>{{ energyContent.title }}</h3>
        </a>
        <p>
          {{ energyContent.description }}
        </p>
      </article>
    </div>
  </section>
</template>
<style scoped>
.projects-section {
  padding: 5rem 3rem;
  background-color: var(--container-color-background);
  margin-top: 5rem;
}
.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 10rem;
  margin-top: 4rem;
}
.project-container,
.project-link {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.project-img-container {
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
}
.project-img-container img {
  width: 100%;
  object-fit: contain;
  transition: transform 0.5s;
}
.project-img-container img:hover {
  transform: scale(1.05);
}
.project-link {
  cursor: pointer;
}
.project-link:hover {
  background-color: transparent;
}
.project-link h3 {
  position: relative;
  width: fit-content;
  font-size: var(--secondary-title);
}
.project-link h3::after {
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: var(--color-highlight);
  transition: transform 0.25s ease-out;
}
.project-link h3:hover::after {
  transform: scaleX(1);
}
.project-link h3::after {
  transform-origin: bottom right;
}
.project-link h3::after {
  transform-origin: bottom left;
}

@media (max-width: 1000px) {
  .wrapper {
    grid-template-columns: 1fr;
  }
}
</style>
