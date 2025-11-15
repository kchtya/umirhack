<template>
  <div id="app" :class="currentTheme" :style="pageStyles">
    <div class="global-ripple" :class="{ active: isRippling }" :style="rippleStyle"></div>
    <router-view />
  </div>
</template>

<script>
import { ref, computed, provide, watch } from 'vue'
import { useThemeStore } from './stores/theme'
import { useEditorStore } from './stores/editor'
import { storeToRefs } from 'pinia'

export default {
  name: 'App',
  setup() {
    const themeStore = useThemeStore()
    const editorStore = useEditorStore()
    const { currentTheme } = storeToRefs(themeStore)
    const { pageSettings } = storeToRefs(editorStore)
    const isRippling = ref(false)
    const rippleOrigin = ref({ x: 0, y: 0 })

    const rippleStyle = computed(() => {
      return {
        left: `${rippleOrigin.value.x}px`,
        top: `${rippleOrigin.value.y}px`
      }
    })

    const pageStyles = computed(() => {
      const styles = {
        backgroundColor: pageSettings.value.backgroundColor || 'var(--bg-primary)',
        minHeight: '100vh',
        transition: 'all 0.3s ease'
      }

      if (pageSettings.value.backgroundImage && pageSettings.value.backgroundImage !== '') {
        styles.backgroundImage = `url(${pageSettings.value.backgroundImage})`
        styles.backgroundSize = pageSettings.value.backgroundSize || 'cover'
        styles.backgroundPosition = pageSettings.value.backgroundPosition || 'center'
        styles.backgroundRepeat = 'no-repeat'
        styles.backgroundAttachment = 'fixed'
      }

      return styles
    })

    const startRipple = (event) => {
      const rect = event.currentTarget.getBoundingClientRect()
      rippleOrigin.value = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
      
      isRippling.value = true
      setTimeout(() => {
        themeStore.toggleTheme()
        setTimeout(() => {
          isRippling.value = false
        }, 600)
      }, 300)
    }

    provide('startRipple', startRipple)

    return {
      currentTheme,
      isRippling,
      rippleStyle,
      pageStyles
    }
  }
}
</script>

<style>
/* Подключаем monospace шрифты с поддержкой кириллицы */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'JetBrains Mono', 'IBM Plex Mono', 'Fira Code', 'Cascadia Code', 'Source Code Pro', 'Courier New', monospace;
  font-weight: 300;
  line-height: 1.6;
  overflow-x: hidden;
  font-feature-settings: "calt" 1;
}

/* Тёмная тема (по умолчанию) */
.theme-dark {
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --bg-tertiary: #2a2a2a;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --text-tertiary: #808080;
  --border-color: #404040;
  --accent-color: #3b1fa1;
  --hover-color: rgba(255,255,255,0.08);
}

/* Светлая тема */
.theme-light {
  --bg-primary: #f8f9fa;
  --bg-secondary: #ffffff;
  --bg-tertiary: #e9ecef;
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --text-tertiary: #adb5bd;
  --border-color: #dee2e6;
  --accent-color: #3b1fa1;
  --hover-color: rgba(0,0,0,0.05);
}

#app {
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* Глобальный ripple эффект */
.global-ripple {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: radial-gradient(circle, #3b1fa1 0%, transparent 70%);
  transform: translate(-50%, -50%);
  opacity: 0;
  z-index: 1000;
  pointer-events: none;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.global-ripple.active {
  width: 200vmax;
  height: 200vmax;
  opacity: 0.3;
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