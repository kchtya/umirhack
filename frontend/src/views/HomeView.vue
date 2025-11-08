<template>
  <div class="home" :class="{ 'no-pointer-events': isTransitioning }">
    <header class="header">
      <nav class="nav">
        <div class="logo">Digitalize</div>
        <div class="nav-links">
          <span @click="scrollToSection('editor')">Конструктор</span>
          <span @click="scrollToSection('templates')">Шаблоны</span>
          <span @click="scrollToSection('export')">Экспорт</span>
          <button 
            class="theme-toggle" 
            @click="handleThemeToggle"
            :disabled="isTransitioning"
          >
            <span class="theme-icon">{{ theme === 'theme-dark' ? '☀️' : '🌙' }}</span>
            <span class="theme-ripple" :class="{ active: isTransitioning }"></span>
          </button>
        </div>
      </nav>
      
      <div class="hero">
        <h1 class="hero-title">СОЗДАВАЙТЕ УМНЫЕ ЛЕНДИНГИ</h1>
        <p class="hero-subtitle">Визуальный конструктор для быстрых результатов</p>
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="hero-stat-number">100+</span>
            <span class="hero-stat-label">КЛИЕНТОВ</span>
          </div>
          <div class="hero-stat">
            <span class="hero-stat-number">300%</span>
            <span class="hero-stat-label">РОСТ КОНВЕРСИИ</span>
          </div>
        </div>
      </div>
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
              <span class="stat-number">50+</span>
              <span class="stat-label">БЛОКОВ</span>
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

<script setup>
import { ref } from 'vue'
import BlockLibrary from '../components/BlockLibrary.vue'

defineProps({
  theme: {
    type: String,
    default: 'theme-dark'
  },
  isTransitioning: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-theme'])

const handleThemeToggle = (event) => {
  emit('toggle-theme', event)
}

const scrollToSection = (sectionId) => {
  // Здесь можно добавить логику прокрутки к секциям
  console.log('Scroll to:', sectionId)
}

const canvasBlocks = ref([])

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
</script>

<style scoped>
.home {
  /* УБРАТЬ height: 100vh; */
  min-height: 100vh; /* ← ЗАМЕНИТЬ на это */
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  transition: all 0.3s ease;
}

.home.no-pointer-events {
  pointer-events: none;
}

/* Навигация */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 3rem;
  border-bottom: 1px solid var(--border-color);
}

.logo {
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 2px;
  color: var(--text-primary);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  font-weight: 300;
}

.nav-links span {
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0;
  color: var(--text-secondary);
}

.nav-links span:hover {
  color: #3b1fa1; /* Синий цвет из референса */
  transform: translateY(-1px);
}

.nav-links span::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #3b1fa1; /* Синий акцент */
  transition: width 0.3s ease;
}

.nav-links span:hover::after {
  width: 100%;
}

/* Кнопка переключения темы */
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
  margin-left: 1rem;
  overflow: hidden;
}

.theme-toggle:hover:not(:disabled) {
  background: var(--hover-color);
  transform: scale(1.05);
  border-color: #3b1fa1; /* Синий акцент */
}

.theme-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.theme-icon {
  font-size: 1.3rem;
  z-index: 2;
  position: relative;
}

.theme-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: #3b1fa1; /* Синий акцент */
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: all 0.3s ease;
}

.theme-ripple.active {
  width: 100px;
  height: 100px;
  opacity: 0.3;
}

/* Hero секция */
.hero {
  text-align: center;
  padding: 4rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  color: transparent;
  background: linear-gradient(135deg, #4dabf7 0%, #3b1fa1 100%);
  -webkit-background-clip: text;
  background-clip: text;
  font-family: 'Inter', sans-serif;
  text-shadow: 
    2px 0 0 currentColor,
    0 2px 0 currentColor,
    2px 2px 0 currentColor; /* Пиксельный эффект */
}

.hero-subtitle {
  font-size: 1.1rem;
  font-weight: 600;
  opacity: 0.8;
  letter-spacing: 3px;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-top: 2rem;
}

.hero-stat {
  text-align: center;
}

.hero-stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: 2px;
  color: #3b1fa1; /* Синий акцент */
  margin-bottom: 0.5rem;
}

.hero-stat-label {
  font-size: 0.9rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-tertiary);
  font-weight: 400;
}

/* Основной layout */
.editor-layout {
  display: flex;
  flex: 1;
  /* УБРАТЬ height: calc(100vh - 120px); */
  min-height: 0; /* ← ДОБАВИТЬ это */
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
  color: #3b1fa1; /* Синий акцент */
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
  border-radius: 4px;
  padding: 20px;
  margin: 10px 2rem;
  transition: all 0.2s;
}

.canvas-block:hover {
  background: var(--hover-color);
  border-color: #3b1fa1; /* Синий акцент */
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
}

.button-block button {
  background: #3b1fa1; /* Синий акцент */
  color: white;
  border: 1px solid #3b1fa1;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 400;
  letter-spacing: 0.5px;
  transition: all 0.2s;
}

.button-block button:hover {
  background: #3b1fa1;
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
}
</style>