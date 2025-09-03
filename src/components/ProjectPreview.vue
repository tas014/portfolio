<script setup lang="ts">
import { type Project } from '../definitions/JSONtypes'
defineProps<{
  content: Project
}>()
</script>

<template>
  <article class="project-container">
    <a :href="content.route" class="project-link">
      <div class="project-img-container">
        <img :src="content.previewURL" alt="A preview of this project's UI" />
      </div>
      <h3>{{ content.title }}</h3>
    </a>
    <h4 class="project-year">{{ content.year }}</h4>
    <ul class="tags-container">
      <li v-for="tag in content.tags" :key="tag" class="project-tag">
        {{ tag }}
      </li>
    </ul>
    <p>
      {{ content.description }}
    </p>
  </article>
</template>
<style scoped>
.project-container,
.project-link {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
.project-year {
  font-size: var(--secondary-title);
  color: #636363;
}
</style>
<style>
.tags-container {
  list-style: none;
  padding-left: 0px;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.project-tag {
  padding: 5px 15px;
  border-radius: 20px;
  background-color: #c0c0c0;
  color: var(--color-highlight);
  cursor: context-menu;
  transition: all 0.5s;
}
.project-tag:hover {
  background-color: var(--color-highlight);
  color: #fff;
}
</style>
