<template>
  <div id="app" :class="currentTheme">
    <!-- Эффект перетекания темы -->
    <div 
      class="theme-transition-overlay" 
      :class="{ active: isTransitioning }"
      :style="overlayStyle"
    ></div>
    
    <HomeView 
      :theme="currentTheme" 
      @toggle-theme="toggleTheme" 
      :is-transitioning="isTransitioning"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import HomeView from './views/HomeView.vue'

const isDarkTheme = ref(true)
const isTransitioning = ref(false)
const transitionOrigin = reactive({ x: 0, y: 0 })

const currentTheme = computed(() => {
  return isDarkTheme.value ? 'theme-dark' : 'theme-light'
})

const overlayStyle = computed(() => {
  return {
    '--origin-x': `${transitionOrigin.x}px`,
    '--origin-y': `${transitionOrigin.y}px`
  }
})

const toggleTheme = (event) => {
  if (event) {
    transitionOrigin.x = event.clientX
    transitionOrigin.y = event.clientY
  } else {
    transitionOrigin.x = window.innerWidth / 2
    transitionOrigin.y = window.innerHeight / 2
  }
  
  isTransitioning.value = true
  
  setTimeout(() => {
    isDarkTheme.value = !isDarkTheme.value
  }, 300)
  
  setTimeout(() => {
    isTransitioning.value = false
  }, 900)
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-weight: 300;
  line-height: 1.6;
  overflow-x: hidden;
  transition: all 0.3s ease;
}

/* Подключаем шрифты */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap&subset=cyrillic');

/* Тёмная тема (по умолчанию) */
.theme-dark {
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-tertiary: rgba(255,255,255,0.05);
  --text-primary: #ffffff;
  --text-secondary: rgba(255,255,255,0.8);
  --text-tertiary: rgba(255,255,255,0.6);
  --border-color: rgba(255,255,255,0.1);
  --accent-color: rgba(255,255,255,0.2);
  --hover-color: rgba(255,255,255,0.08);
}

/* Светлая тема */
.theme-light {
  --bg-primary: #f8f6f2;
  --bg-secondary: #ffffff;
  --bg-tertiary: #ffffff;
  --text-primary: #2a2a2a;
  --text-secondary: rgba(0,0,0,0.7);
  --text-tertiary: rgba(0,0,0,0.5);
  --border-color: rgba(0,0,0,0.1);
  --accent-color: rgba(0,0,0,0.1);
  --hover-color: rgba(0,0,0,0.05);
}

#app {
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* Эффект перетекания темы */
.theme-transition-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  opacity: 0;
  background: radial-gradient(
    circle at var(--origin-x, 50%) var(--origin-y, 50%),
    var(--transition-color, rgba(255,255,255,0.1)) 0%,
    transparent 60%
  );
  transform: scale(0.1);
  transition: all 0s;
}

.theme-transition-overlay.active {
  opacity: 1;
  transform: scale(4);
  transition: all 0.9s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-dark .theme-transition-overlay {
  --transition-color: rgba(255, 255, 255, 0.1);
}

.theme-light .theme-transition-overlay {
  --transition-color: rgba(0, 0, 0, 0.1);
}

/* Остальные глобальные стили */
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
}

::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

::selection {
  background: var(--accent-color);
  color: inherit;
}

*:focus {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

button, .block-item, .nav-links span, .theme-toggle {
  transition: all 0.3s ease;
}

img, video {
  max-width: 100%;
  height: auto;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>