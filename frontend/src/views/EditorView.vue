<template>
  <div class="editor-view">
    <header class="header">
      <nav class="nav">
        <!-- Логотип слева -->
        <div class="logo-section">
          <div class="logo-image" @click="goToHome">
            <img src="@/assets/images/logo.svg" alt="Digitalize" class="logo-svg">
          </div>
        </div>
        
        <!-- Центральное меню -->
        <div class="nav-center">
          <div class="nav-menu">
            <span @click="scrollToSection('editor')" class="nav-item">Конструктор</span>
            <span @click="scrollToSection('templates')" class="nav-item">Шаблоны</span>
            <span @click="scrollToSection('export')" class="nav-item">Экспорт</span>
          </div>
        </div>
        
        <!-- Кнопка темы справа -->
        <div class="nav-right">
          <button 
            class="theme-toggle" 
            @click="toggleThemeWithRipple"
          >
            <span class="theme-icon">{{ isDark ? '☀️' : '🌙' }}</span>
          </button>
        </div>
      </nav>
    </header>
    
    <div class="editor-layout">
      <BlockLibrary />
      <div 
        class="canvas" 
        @drop="handleDrop"
        @dragover="allowDrop"
      >
        <div class="canvas-header">
          <h3>РАБОЧАЯ ОБЛАСТЬ</h3>
          <div class="canvas-stats">
            <div class="stat">
              <span class="stat-number">{{ activeBlocksCount }}</span>
              <span class="stat-label">АКТИВНЫХ БЛОКОВ</span>
            </div>
            <div class="stat">
              <span class="stat-number">85%</span>
              <span class="stat-label">БЫСТРЕЕ</span>
            </div>
          </div>
        </div>
        
        <!-- Отображаем добавленные блоки -->
        <div 
          v-for="block in canvasBlocks" 
          :key="block.id"
          class="canvas-block"
          :class="`block-${block.type}`"
        >
          <div v-if="block.type === 'text'" class="text-block">
            {{ block.content }}
          </div>
          <div v-else-if="block.type === 'image'" class="image-block">
            🖼️ {{ block.content }}
          </div>
          <div v-else-if="block.type === 'button'" class="button-block">
            <button>{{ block.content }}</button>
          </div>
          <div v-else-if="block.type === 'header'" class="header-block">
            <h2>{{ block.content }}</h2>
          </div>
          <div v-else-if="block.type === 'paragraph'" class="paragraph-block">
            <p>{{ block.content }}</p>
          </div>
        </div>
        
        <!-- Пустое состояние -->
        <div v-if="canvasBlocks.length === 0" class="empty-state">
          ПЕРЕТАЩИТЕ БЛОКИ ДЛЯ НАЧАЛА РАБОТЫ
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { storeToRefs } from 'pinia'
import BlockLibrary from '../components/BlockLibrary.vue'

export default {
  name: 'EditorView',
  components: {
    BlockLibrary
  },
  setup() {
    const themeStore = useThemeStore()
    const { isDark } = storeToRefs(themeStore)
    const router = useRouter()
    const canvasBlocks = ref([])
    const startRipple = inject('startRipple')

    const activeBlocksCount = computed(() => {
      return canvasBlocks.value.length
    })

    const toggleThemeWithRipple = (event) => {
      if (startRipple) {
        startRipple(event)
      } else {
        themeStore.toggleTheme()
      }
    }

    const goToHome = () => {
      router.push('/')
    }

    const scrollToSection = (sectionId) => {
      console.log('Scroll to:', sectionId)
    }

    const allowDrop = (event) => {
      event.preventDefault()
    }

    const handleDrop = (event) => {
      event.preventDefault()
      const type = event.dataTransfer.getData('blockType')
      const content = event.dataTransfer.getData('blockContent')
      
      if (type) {
        canvasBlocks.value.push({
          id: Date.now(),
          type: type,
          content: content,
          styles: {}
        })
      }
    }

    return {
      canvasBlocks,
      activeBlocksCount,
      isDark,
      toggleThemeWithRipple,
      goToHome,
      scrollToSection,
      allowDrop,
      handleDrop
    }
  }
}
</script>

<style scoped>
.editor-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  transition: all 0.3s ease;
}

/* Новая навигация */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  position: relative;
}

/* Логотип слева - БЕЗ ВИДИМОГО БЛОКА */
.logo-section {
  flex: 1;
  display: flex;
  align-items: center;
}

.logo-image {
  width: 70px; /* Увеличил размер */
  height: 70px; /* Увеличил размер */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 0; /* Убрал отступы */
  background: none; /* Убрал фон */
  border: none; /* Убрал границу */
  border-radius: 0; /* Убрал скругление */
}

.logo-image:hover {
  transform: scale(1.1); /* Увеличил эффект ховера */
}

.logo-svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: invert(var(--logo-invert, 0));
  transition: all 0.3s ease;
}

.logo-image:hover .logo-svg {
  filter: invert(var(--logo-invert, 0)) brightness(1.2);
}

/* Центральное меню */
.nav-center {
  flex: 2;
  display: flex;
  justify-content: center;
}

.nav-menu {
  display: flex;
  gap: 0;
  background: var(--bg-tertiary);
  border-radius: 50px;
  padding: 8px;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
}

.nav-item {
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 30px;
  color: var(--text-secondary);
  font-weight: 400;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.nav-item:hover {
  color: var(--text-primary);
  background: var(--hover-color);
  transform: translateY(-1px);
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: #3b1fa1;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-item:hover::after {
  width: 60%;
}

/* Правая часть с кнопкой темы */
.nav-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.theme-toggle {
  position: relative;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.theme-toggle:hover {
  background: var(--hover-color);
  transform: scale(1.05);
  border-color: #3b1fa1;
}

.theme-icon {
  font-size: 1.3rem;
  z-index: 2;
  position: relative;
}

/* Основной layout */
.editor-layout {
  display: flex;
  flex: 1;
  height: calc(100vh - 120px);
}

/* Холст */
.canvas {
  flex: 1;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.canvas-header h3 {
  font-weight: 400;
  letter-spacing: 2px;
  opacity: 0.8;
  color: var(--text-primary);
}

.canvas-stats {
  display: flex;
  gap: 3rem;
}

.stat {
  text-align: right;
}

.stat-number {
  display: block;
  font-size: 1.8rem;
  font-weight: 300;
  letter-spacing: 1px;
  color: #3b1fa1;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.6;
  letter-spacing: 1px;
  color: var(--text-tertiary);
}

/* Блоки на холсте */
.canvas-block {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  margin: 10px 2rem;
  transition: all 0.2s;
}

.canvas-block:hover {
  background: var(--hover-color);
  border-color: #3b1fa1;
  transform: translateY(-2px);
}

.text-block {
  font-size: 16px;
  line-height: 1.5;
  color: var(--text-primary);
}

.image-block {
  text-align: center;
  padding: 40px;
  background: var(--bg-tertiary);
  border: 2px dashed var(--border-color);
  color: var(--text-secondary);
  border-radius: 8px;
}

.button-block button {
  background: #3b1fa1;
  color: white;
  border: 1px solid #3b1fa1;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 400;
  letter-spacing: 0.5px;
  transition: all 0.2s;
}

.button-block button:hover {
  background: #4dabf7;
  transform: translateY(-1px);
}

.header-block h2 {
  margin: 0;
  color: var(--text-primary);
  font-weight: 400;
  letter-spacing: 1px;
}

.paragraph-block p {
  margin: 0;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Пустое состояние */
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  letter-spacing: 1px;
  font-size: 0.9rem;
  color: var(--text-tertiary);
  flex-direction: column;
  gap: 1rem;
}

.empty-state::before {
  content: "⬇️";
  font-size: 2rem;
  opacity: 0.5;
}

/* CSS переменные для инвертирования лого в темной теме */
.theme-dark {
  --logo-invert: 1;
}

.theme-light {
  --logo-invert: 0;
}
</style>