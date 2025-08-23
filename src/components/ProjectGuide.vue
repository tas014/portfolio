<script setup lang="ts">
type ProjectSection = {
  title: string
  reference: {
    url?: string
    alt?: string
    code?: string
  }
  description: string
}
defineProps<{
  content: {
    title: string
    sections: ProjectSection[]
    conclusion: string
  }
}>()
</script>
<template>
  <article class="container-article">
    <h1 class="project-title">{{ content.title }}</h1>
    <div
      class="project-section-container"
      v-for="section in content.sections"
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
    <p class="project-conclusion">{{ content.conclusion }}</p>
  </article>
</template>
<style scoped>
.container-article {
  padding: 2rem;
  display: grid;
  max-width: 1400px;
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
  width: clamp(50rem, 25%, 100%);
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
</style>
