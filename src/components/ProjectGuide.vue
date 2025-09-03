<script setup lang="ts">
import { type Project } from '@/definitions/JSONtypes'
import { language } from '@/stores/lang'
defineProps<{
  content: Project
}>()
</script>
<template>
  <article class="container-article">
    <h1 class="project-title">{{ content.title }}</h1>
    <ul class="tags-container">
      <li v-for="tag in content.tags" :key="tag" class="project-tag">
        {{ tag }}
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
          <h3>
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
          <h3>
            {{ language === 'es' ? 'Objetivo' : 'Objective' }}
          </h3>
        </div>
        <p>
          {{ content.objective }}
        </p>
      </div>
    </div>
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
    <p class="project-conclusion">{{ content.project.conclusion }}</p>
  </article>
</template>
<style scoped>
.flex {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.container-article {
  padding: 2rem;
  display: grid;
  max-width: 1400px;
  gap: 1rem;
}
.project-overview-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
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
  margin-top: 5rem;
}
.project-section-title {
  font-size: var(--secondary-title);
  margin-bottom: 1rem;
  font-weight: bold;
}
.project-section-block p {
  display: inline;
}

@media (max-width: 800px) {
  .project-overview-container {
    grid-template-columns: 1fr;
  }
}
</style>
