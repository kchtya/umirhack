import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(true)
  
  const currentTheme = computed(() => {
    return isDark.value ? 'theme-dark' : 'theme-light'
  })
  
  function toggleTheme() {
    isDark.value = !isDark.value
  }
  
  return {
    isDark,
    currentTheme,
    toggleTheme
  }
})
