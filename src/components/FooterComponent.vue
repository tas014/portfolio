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
        <h2 v-html="content.title"></h2>
        <h4>{{ content.subtitle }}</h4>
        <a href="mailto:francopiccobusiness@gmail.com">francopiccobusiness@gmail.com</a>
      </div>
      <div class="profile-container">
        <img src="/img/hero-1.webp" alt="a picture of Franco" />
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
.titles-container,
.socials-container {
  width: 30%;
  overflow: hidden;
}
.profile-container {
  width: 50rem;
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
.socials-container > h3 {
  display: flex;
  justify-content: center;
}
.socials-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
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
  filter: brightness(0) saturate(100%) invert(64%) sepia(35%) saturate(3470%) hue-rotate(115deg)
    brightness(86%) contrast(102%);
}

@media (max-width: 1800px) {
  .profile-container {
    width: 40rem;
  }
}

@media (max-width: 1210px) {
  .main-container {
    flex-direction: column;
    width: 95%;
  }
  .titles-container,
  .socials-container {
    width: 80%;
    margin-top: 2rem;
  }
  .titles-container {
    order: 2;
    text-align: center;
    gap: 3rem;
  }
  .profile-container {
    order: 1;
  }
  .socials-container {
    order: 3;
    margin-top: 5rem;
  }
  .socials-container > h3,
  .socials-list {
    justify-content: center;
  }
  .socials-list {
    align-items: center;
    flex-direction: row;
    gap: 5rem;
  }
}
@media (max-width: 800px) {
  .main-container {
    padding: 3rem;
    width: 100%;
  }
  .titles-container,
  .socials-container {
    width: 95%;
  }
  .profile-container {
    width: 30rem;
  }
  .socials-list {
    gap: 3rem;
  }
}
</style>
