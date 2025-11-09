<template>
  <div class="block-library">
    <div class="library-header">
      <h3>БИБЛИОТЕКА БЛОКОВ</h3>
      <div class="block-count">{{ blockTypes.length }} ЭЛЕМЕНТОВ</div>
    </div>
    
    <div class="blocks-grid">
      <div 
        v-for="blockType in blockTypes" 
        :key="blockType.type"
        class="block-item" 
        draggable="true"
        @dragstart="onDragStart(blockType)"
      >
        <span class="block-icon">{{ blockType.emoji }}</span>
        <span class="block-name">{{ blockType.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useEditorStore } from '../stores/editor';

const editorStore = useEditorStore();

const blockTypes = [
  { type: 'heading', name: 'Заголовок', emoji: '📝' },
  { type: 'paragraph', name: 'Параграф', emoji: '📄' },
  { type: 'button', name: 'Кнопка', emoji: '🔘' },
  { type: 'image', name: 'Изображение', emoji: '🖼️' },
  { type: 'text', name: 'Текст', emoji: '✏️' },
  { type: 'hero', name: 'Hero Секция', emoji: '⭐' },
  { type: 'features', name: 'Функции', emoji: '🔧' },
  { type: 'testimonials', name: 'Отзывы', emoji: '💬' },
  { type: 'contact', name: 'Контакт', emoji: '📧' },
  { type: 'footer', name: 'Футер', emoji: '🔻' }
];

const onDragStart = (blockType) => {
  event.dataTransfer.setData('application/json', JSON.stringify(blockType));
};
</script>

<style scoped>
.block-library {
  width: 280px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  min-height: 100vh;
  overflow-y: auto;
}

.library-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  background: var(--bg-secondary);
  z-index: 10;
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

.blocks-grid {
  padding: 1rem;
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
  border-radius: 6px;
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
  font-size: 1.3rem;
  opacity: 0.9;
  flex-shrink: 0;
  width: 24px;
  text-align: center;
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
.block-library::-webkit-scrollbar {
  width: 6px;
}

.block-library::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
}

.block-library::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 3px;
}

.block-library::-webkit-scrollbar-thumb:hover {
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