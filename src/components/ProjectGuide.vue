<script setup lang="ts">
import { type Project } from '@/definitions/JSONtypes'
import { language } from '@/stores/lang'
defineProps<{
  content: Project
}>()
</script>
<template>
  <article class="container-article">
    <h1 class="project-title">
      {{ content.title }} - {{ language === 'es' ? 'Vistazo General' : 'Project Overview' }}
    </h1>
    <ul class="tags-container">
      <li v-for="tag in content.tags" :key="tag" class="project-tag">
        {{ tag }}
      </li>
    </ul>
    <ul class="techs-container">
      <li v-for="tech in content.software" :key="tech.name" class="tech-item">
        <img :src="tech.icon" :alt="`an image of ${tech.name}'s logo'`" />
        <span>{{ tech.name }}</span>
      </li>
    </ul>
    <ul class="project-links">
      <li v-for="projectLink in content.links" :key="projectLink.text">
        <a
          :href="projectLink.URL"
          :download="projectLink.download ? projectLink.download : null"
          :target="projectLink.download ? '_self' : '_blank'"
          >{{ projectLink.text }}</a
        >
      </li>
    </ul>
    <div class="project-overview-container">
      <div>
        <div class="flex">
          <i class="pi pi-shop"></i>
          <h3 class="project-section-title">
            {{ language === 'es' ? 'Un vistazo al cliente:' : 'The client:' }}
            {{ content.client.name }}
          </h3>
        </div>
        <p>
          {{ content.client.description }}
        </p>
      </div>
      <div>
        <div class="flex">
          <i class="pi pi-bullseye"></i>
          <h3 class="project-section-title">
            {{ language === 'es' ? 'Objetivo' : 'Objective' }}
          </h3>
        </div>
        <p>
          {{ content.objective }}
        </p>
      </div>
      <div class="outcome">
        <div class="flex">
          <i class="pi pi-check-circle"></i>
          <h3 class="project-section-title">
            {{ language === 'es' ? 'Resultado del Projecto' : 'Project Outcome' }}
          </h3>
        </div>
        <p>
          {{ content.outcome }}
        </p>
      </div>
    </div>
    <div>
      <h1 class="project-title">
        {{ language === 'es' ? 'Guía Completa del Proyecto' : 'Full Project Breakdown' }}
      </h1>
      <div
        class="project-section-container"
        v-for="section in content.project.sections"
        :key="section.title + Math.random()"
      >
        <h3 class="project-section-title">{{ section.title }}</h3>
        <div class="project-section-block">
          <pre v-if="section.reference.code">
            <code >
              {{ section.reference.code }}
            </code>
          </pre>
          <img
            v-if="section.reference.url && section.reference.alt"
            :src="section.reference.url"
            :alt="section.reference.alt"
          />
          <p>{{ section.description }}</p>
        </div>
      </div>
    </div>
    <p class="project-conclusion">{{ content.project.conclusion }}</p>
  </article>
</template>
<style scoped>
ul {
  padding-left: 0px;
  list-style: none;
}
.pi {
  color: var(--color-highlight);
  font-size: 2.5rem;
}
.flex {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.container-article {
  padding: 2rem;
  display: grid;
  max-width: 1400px;
  gap: 2rem;
}
.project-overview-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
}
.techs-container {
  display: flex;
  gap: 5rem;
}
.tech-item {
  display: grid;
  width: clamp(7rem, 2vw, 20rem);
  grid-template-columns: 1fr;
  justify-items: center;
  align-items: end;
}
.outcome {
  grid-column: span 2;
}
.project-section-container:nth-of-type(even) img,
.project-section-container:nth-of-type(even) pre {
  float: left;
  margin-right: 3rem;
}
.project-section-container:nth-of-type(odd) img,
.project-section-container:nth-of-type(odd) pre {
  float: right;
  margin-left: 3rem;
}
img,
pre {
  margin-bottom: 2rem;
  max-width: 100%;
  width: clamp(40rem, 25%, 100%);
}
.project-title {
  font-size: var(--primary-title);
  font-weight: bold;
  margin-top: 2rem;
}
.project-section-title {
  font-size: 1.5em;
  font-weight: bold;
}
.project-section-container .project-section-title {
  margin: 1.5rem 0rem;
}
.project-section-block p {
  display: inline;
}

@media (max-width: 800px) {
  .project-overview-container {
    grid-template-columns: 1fr;
  }
  .outcome {
    grid-column: 1;
  }
}
</style>
