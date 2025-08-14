<script setup lang="ts">
import { inject, computed, ref } from 'vue'
import { languageKey, type Language } from '@/stores/lang'
import EnContent from '@/content/en/footer.json'
import EsContent from '@/content/es/footer.json'
const language: Language = inject(languageKey, ref('en'))
const content = computed(() => {
  if (language.value === 'es') {
    return EsContent
  }
  return EnContent
})
</script>
<template>
  <footer>
    <div class="main-container">
      <div class="titles-container">
        <h2>{{ content.title }}</h2>
        <h4>{{ content.subtitle }}</h4>
        <a href="mailto:francopiccobusiness@gmail.com">francopiccobusiness@gmail.com</a>
      </div>
      <div class="profile-container">
        <img src="/img/hero.jpeg" alt="a picture of Franco" />
      </div>
      <div class="socials-container">
        <h3>{{ content.socials.title }}</h3>
        <ul class="socials-list">
          <li v-for="social in content.socials.items" :key="social.name">
            <a :href="social.url" target="_blank" rel="noopener noreferrer">
              <i :class="social.icon"></i>
              <span>{{ social.name }}</span>
            </a>
          </li>
          <li>
            <a
              href="https://bsky.app/profile/tas014.bsky.social"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img class="blue-sky-logo" src="/img/bluesky.svg" alt="bluesky logo" />
              <span>Bluesky</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
<style>
.main-container,
footer {
  display: flex;
  align-items: center;
}
footer {
  margin: 5rem 0rem;
  background-color: var(--container-color-background);
  justify-content: center;
}
.main-container {
  width: 80%;
  justify-content: space-between;
  padding: 5rem 5rem;
}
.main-container > div {
  width: 30%;
  overflow: hidden;
}
.titles-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.profile-container {
  clip-path: circle();
}
.profile-container img {
  width: 100%;
  object-fit: cover;
  transition: transform 1s;
}
.profile-container img:hover {
  transform: scale(1.2);
}
.socials-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  list-style: none;
  padding-left: 0px;
}
.socials-list li a {
  display: flex;
  gap: 1rem;
  cursor: pointer;
  align-items: center;
}
.blue-sky-logo {
  filter: invert(29%) sepia(98%) saturate(1529%) hue-rotate(194deg) brightness(107%) contrast(107%);
}
</style>
