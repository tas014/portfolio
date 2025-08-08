import { ref, type Ref } from 'vue'

type Language = Ref<'en' | 'es'>
const language: Language = ref('en')
const languageKey = Symbol('language')
function swapLanguage() {
  language.value = language.value === 'en' ? 'es' : 'en'
}

export { language, languageKey, swapLanguage, type Language }
