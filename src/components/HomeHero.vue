<script setup lang="ts">
  import { inject, computed, ref, onUnmounted, onMounted } from 'vue';
  import { languageKey, type Language} from '@/stores/lang';

  const language : Language = inject(languageKey, ref('en'));
  const titleText = computed(() => {
    if (language.value === 'es') {
      return `Desarrollador Web <strong class="highlighted">{Front End}</strong> Junior_`
    }
    return `Junior <strong class="highlighted">{Front End}</strong> Web Developer_`
  })

  const shapesMap = new Map([
    ["transition", "50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%"],
    ["pentagon", "50% 0%, 50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%"],
    ["edges clip", "0% 40%, 40% 0%, 100% 0%, 100% 60%, 60% 100%, 0% 100%"],
    ["rhombus", "50% 0%, 50% 0%, 100% 50%, 50% 100%, 0% 50%, 50% 0%"],
    ["trapezoid", "20% 0%, 20% 0%, 80% 0%, 100% 100%, 0% 100%, 20% 0%"]
  ]);

  const currentShape = ref(shapesMap.get("pentagon"));
  let timeoutId : undefined | number;
  let intervalId : undefined | number;
  const updateShape = () => {
    const keys = Array.from(shapesMap.keys());
    const values = Array.from(shapesMap.values());
    const currentIndex = currentShape.value ? values.indexOf(currentShape.value) : 1;
    currentShape.value = shapesMap.get("transition");
    timeoutId = setTimeout(()=>{
      if (currentIndex < values.length-1) {
        currentShape.value = shapesMap.get(keys[currentIndex+1])
      } else currentShape.value = shapesMap.get(keys[1]);
    },1000)
  }
  onMounted(() => intervalId = setInterval(updateShape, 5000))
  onUnmounted(() => {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
  })

</script>

<template>
  <section class="hero-container">
    <div class="img-container">
      <div class="clipper"></div>
      <img :style="{clipPath: `polygon(${currentShape})`}" class="hero-image" src="../../public/img/hero.jpeg" alt="a picture of Franco">
      <div class="img-logo-container">
        <img src="../../public/img/code.png" alt="a symbol representing coding">
      </div>
    </div>
    <div class="text-container">
      <span>
        <i class="tag">{{`<span>`}}</i>
          {{language === 'en' ? "Hey! I'm Franco" : "¡Hola! Mi nombre es Franco."}}
        <i class="tag">{{ `</span>` }}</i>
      </span>
      <h1 v-html="titleText"></h1>
      <p class="description">
        <i class="tag">{{ `<p>` }} </i>
        <slot></slot>
        <i class="tag"> {{ `</p>` }}</i>
      </p>
    </div>
  </section>
</template>

<style scoped>
  img {
   width: 100%;
   height: 100%;
   object-fit: cover;
  }
  .hero-container {
    display: flex;
    min-height: 70vh;
    justify-content: space-around;
    background-color: var(--container-color-background);
  }
  .img-container {
    width: 40%;
    position: relative;
    z-index: 1;
  }
  .hero-image {
    transition: 1s clip-path;
  }
  .clipper {
    background-color: var(--container-color-background);
  }
  .img-logo-container {
    position: absolute;
    z-index: 3;
    width: 5rem;
    right: 10px;
    bottom: 10px;
  }
  .text-container {
    width: 45%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
  }
  .tag {
    color: var(--color-tag);
  }
  .highlighted {
    color: var(--color-highlight);
  }
  .description {
    color: var(--color-secondary);
  }
</style>
