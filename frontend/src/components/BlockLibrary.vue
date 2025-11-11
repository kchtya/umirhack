<template>
  <div class="block-library">
    <div class="library-header">
      <h3>БИБЛИОТЕКА БЛОКОВ</h3>
      <div class="block-count">{{ allBlocks.length }} ЭЛЕМЕНТОВ</div>
    </div>
    
    <div class="library-content">
      <div class="library-sections">
        <!-- Контейнеры и секции -->
        <div class="section">
          <h4 class="section-title">СТРУКТУРА</h4>
          <div class="blocks-grid">
            <div 
              v-for="blockType in structureBlocks" 
              :key="blockType.type"
              class="block-item" 
              draggable="true"
              @dragstart="onDragStart(blockType, $event)"
            >
              <div class="block-icon">
                <component :is="blockType.icon" :size="20" />
              </div>
              <span class="block-name">{{ blockType.name }}</span>
            </div>
          </div>
        </div>

        <!-- Основные блоки -->
        <div class="section">
          <h4 class="section-title">ОСНОВНЫЕ</h4>
          <div class="blocks-grid">
            <div 
              v-for="blockType in basicBlocks" 
              :key="blockType.type"
              class="block-item" 
              draggable="true"
              @dragstart="onDragStart(blockType, $event)"
            >
              <div class="block-icon">
                <component :is="blockType.icon" :size="20" />
              </div>
              <span class="block-name">{{ blockType.name }}</span>
            </div>
          </div>
        </div>
        
        <!-- Медиа блоки -->
        <div class="section">
          <h4 class="section-title">МЕДИА</h4>
          <div class="blocks-grid">
            <div 
              v-for="blockType in mediaBlocks" 
              :key="blockType.type"
              class="block-item" 
              draggable="true"
              @dragstart="onDragStart(blockType, $event)"
            >
              <div class="block-icon">
                <component :is="blockType.icon" :size="20" />
              </div>
              <span class="block-name">{{ blockType.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  Heading, 
  Pilcrow, 
  MousePointerClick, 
  Image, 
  Type,
  Star,
  Wrench,
  MessageCircle,
  Mail,
  Minus,
  Container,
  Columns,
  PanelTop
} from 'lucide-vue-next';

const structureBlocks = [
  { type: 'container', name: 'Контейнер', icon: Container },
  { type: 'section', name: 'Секция', icon: PanelTop },
  { type: 'columns', name: 'Колонки', icon: Columns },
  { type: 'header', name: 'Шапка', icon: PanelTop },
  { type: 'footer', name: 'Футер', icon: Minus }
];

const basicBlocks = [
  { type: 'hero', name: 'Hero Секция', icon: Star },
  { type: 'heading', name: 'Заголовок', icon: Heading },
  { type: 'paragraph', name: 'Параграф', icon: Pilcrow },
  { type: 'button', name: 'Кнопка', icon: MousePointerClick },
  { type: 'text', name: 'Текст', icon: Type }
];

const mediaBlocks = [
  { type: 'image', name: 'Изображение', icon: Image },
  { type: 'features', name: 'Функции', icon: Wrench },
  { type: 'testimonials', name: 'Отзывы', icon: MessageCircle },
  { type: 'contact', name: 'Контакты', icon: Mail }
];

const allBlocks = [...structureBlocks, ...basicBlocks, ...mediaBlocks];

const onDragStart = (blockType, event) => {
  console.log('Drag start:', blockType);
  event.dataTransfer.setData('application/json', JSON.stringify({
    type: 'block-library',
    blockType: blockType.type
  }));
  event.dataTransfer.effectAllowed = 'copy';
};
</script>

<style scoped>
.block-library {
  width: 100%;
  height: 100%;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.library-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
  z-index: 10;
  flex-shrink: 0;
}

.library-header h3 {
  font-weight: 400;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
  opacity: 0.8;
  font-size: 0.9rem;
  text-transform: uppercase;
  color: var(--text-primary);
}

.block-count {
  font-size: 0.8rem;
  opacity: 0.5;
  letter-spacing: 1px;
  font-weight: 300;
  color: var(--text-tertiary);
}

.library-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
}

.library-sections {
  padding: 1rem 0;
  flex: 1;
}

.section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 0 1.5rem 1rem 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.blocks-grid {
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.block-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.2rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: grab;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.block-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
  transition: left 0.5s ease;
}

.block-item:hover::before {
  left: 100%;
}

.block-item:hover {
  background: var(--hover-color);
  border-color: var(--accent-color);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.block-item:active {
  cursor: grabbing;
  transform: translateX(4px) scale(0.98);
}

.block-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--bg-primary);
  border-radius: 6px;
  border: 1px solid var(--border-color);
  flex-shrink: 0;
  color: var(--text-primary);
}

.block-name {
  font-weight: 300;
  letter-spacing: 0.5px;
  opacity: 0.9;
  font-size: 0.9rem;
  text-transform: uppercase;
  color: var(--text-primary);
}

/* Custom scrollbar for block library */
.library-content::-webkit-scrollbar {
  width: 6px;
}

.library-content::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
}

.library-content::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 3px;
}

.library-content::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

/* Animation for new blocks */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.block-item {
  animation: slideIn 0.3s ease-out;
}

.block-item:nth-child(odd) {
  animation-delay: 0.05s;
}

.block-item:nth-child(even) {
  animation-delay: 0.1s;
}
</style>