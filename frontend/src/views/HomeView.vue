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
          <div class="hero-stat">
            <span class="hero-stat-number">{{ blocksCount }}</span>
            <span class="hero-stat-label">АКТИВНЫХ БЛОКОВ</span>
          </div>
        </div>
      </div>
    </header>
    
    <div class="editor-layout">
      <BlockLibrary />
      <div 
        class="canvas" 
        @drop="handleDrop"
        @dragover.prevent
        @click="clearSelection"
      >
        <div class="canvas-header">
          <h3>РАБОЧАЯ ОБЛАСТЬ</h3>
          <div class="canvas-stats">
            <div class="stat">
              <span class="stat-number">{{ blocksCount }}</span>
              <span class="stat-label">БЛОКОВ</span>
            </div>
            <div class="stat">
              <button @click="saveProject" class="toolbar-btn">💾 Сохранить</button>
            </div>
          </div>
        </div>
        
        <!-- Пустое состояние -->
        <div v-if="blocksCount === 0" class="empty-state">
          ПЕРЕТАЩИТЕ БЛОКИ ДЛЯ НАЧАЛА РАБОТЫ
        </div>
        
        <!-- Блоки с функциональностью Участника 2 -->
        <div 
          v-for="(block, index) in blocks" 
          :key="block.id"
          class="block-wrapper"
          :class="{ active: activeBlock?.id === block.id }"
          @click.stop="setActiveBlock(block.id)"
        >
          <div v-if="block.type === 'heading'" class="block-element heading">
            {{ block.content }}
          </div>
          <div v-else-if="block.type === 'paragraph'" class="block-element paragraph">
            {{ block.content }}
          </div>
          <button v-else-if="block.type === 'button'" class="block-element button">
            {{ block.content }}
          </button>
          <img v-else-if="block.type === 'image'" :src="block.content" class="block-element image" alt="Image"/>
          <div v-else-if="block.type === 'text'" class="block-element text">
            {{ block.content }}
          </div>
          
          <button 
            v-if="activeBlock?.id === block.id"
            @click="deleteBlock(block.id)"
            class="delete-btn"
            title="Удалить блок"
          >
            ×
          </button>
        </div>
      </div>
      
      <BlockEditor v-if="activeBlock" />
    </div>
  </div>
</template>

<script setup>
import { useEditorStore } from '../stores/editor';
import { storeToRefs } from 'pinia';
import BlockLibrary from '../components/BlockLibrary.vue';
import BlockEditor from '../components/BlockEditor.vue';

// Функциональность Участника 2
const editorStore = useEditorStore();
const { blocks, activeBlock, blocksCount } = storeToRefs(editorStore);
const { addBlock, setActiveBlock, deleteBlock } = editorStore;

const handleDrop = (event) => {
  try {
    const blockData = JSON.parse(event.dataTransfer.getData('application/json'));
    addBlock(blockData.type);
  } catch (error) {
    console.error('Ошибка при добавлении блока:', error);
  }
};

const clearSelection = () => {
  setActiveBlock(null);
};

const saveProject = () => {
  const project = {
    blocks: blocks.value,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem('landing-project', JSON.stringify(project));
  alert('Проект сохранен в localStorage!');
};

// Функциональность Участника 1
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
  console.log('Scroll to:', sectionId)
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  transition: all 0.3s ease;
}

.home.no-pointer-events {
  pointer-events: none;
}

/* Стили Участника 1 - навигация и hero */
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
  color: #3b1fa1;
  transform: translateY(-1px);
}

.nav-links span::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #3b1fa1;
  transition: width 0.3s ease;
}

.nav-links span:hover::after {
  width: 100%;
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
  margin-left: 1rem;
  overflow: hidden;
}

.theme-toggle:hover:not(:disabled) {
  background: var(--hover-color);
  transform: scale(1.05);
  border-color: #3b1fa1;
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
  background: #3b1fa1;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: all 0.3s ease;
}

.theme-ripple.active {
  width: 100px;
  height: 100px;
  opacity: 0.3;
}

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
    2px 2px 0 currentColor;
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
  color: #3b1fa1;
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
  min-height: 0;
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
  align-items: center;
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

/* Стили Участника 2 для блоков */
.block-wrapper {
  position: relative;
  margin: 15px 2rem;
  padding: 15px;
  background: var(--bg-tertiary);
  border: 2px solid transparent;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
}

.block-wrapper:hover {
  border-color: var(--border-color);
}

.block-wrapper.active {
  border-color: #4dabf7;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.block-element {
  margin: 0;
}

.block-element.heading {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
}

.block-element.paragraph {
  line-height: 1.6;
  color: var(--text-secondary);
}

.block-element.button {
  padding: 10px 20px;
  background: #3b1fa1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.block-element.button:hover {
  background: #4dabf7;
  transform: translateY(-1px);
}

.block-element.image {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
}

.block-element.text {
  padding: 10px;
  background: var(--bg-secondary);
  border-radius: 4px;
  color: var(--text-primary);
}

.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  background: #c82333;
}

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

.toolbar-btn {
  padding: 8px 16px;
  background: #3b1fa1;
  border: 1px solid #3b1fa1;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: #4dabf7;
  border-color: #4dabf7;
}
</style>