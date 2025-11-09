<template>
  <div class="block-library">
<<<<<<< HEAD
    <div class="library-header">
      <h3>BLOCKS</h3>
      <div class="block-count">{{ blocks.length }} ELEMENTS</div>
    </div>
    
    <div class="blocks-grid">
      <div 
        v-for="block in blocks" 
        :key="block.id"
        class="block-item" 
        draggable="true"
        @dragstart="dragStart($event, block)"
      >
        <span class="block-icon">{{ block.icon }}</span>
        <span class="block-name">{{ block.name }}</span>
      </div>
=======
    <h3>Библиотека блоков</h3>
    <div 
      v-for="blockType in blockTypes" 
      :key="blockType.type"
      class="block-item" 
      draggable="true"
      @dragstart="onDragStart(blockType)"
    >
      {{ blockType.emoji }} {{ blockType.name }}
>>>>>>> malix
    </div>
  </div>
</template>

<script setup>
<<<<<<< HEAD
import { ref } from 'vue'

const blocks = ref([
  { id: 1, type: 'text', name: 'Text', icon: '📝', content: 'Your text here...' },
  { id: 2, type: 'image', name: 'Image', icon: '🖼️', content: 'Image URL' },
  { id: 3, type: 'button', name: 'Button', icon: '🔘', content: 'Click me' },
  { id: 4, type: 'header', name: 'Header', icon: '🏆', content: 'Main Header' },
  { id: 5, type: 'paragraph', name: 'Paragraph', icon: '📄', content: 'Description text...' },
  { id: 6, type: 'hero', name: 'Hero Section', icon: '⭐', content: 'Hero content' },
  { id: 7, type: 'features', name: 'Features', icon: '🔧', content: 'Features list' },
  { id: 8, type: 'testimonials', name: 'Testimonials', icon: '💬', content: 'Customer reviews' },
  { id: 9, type: 'contact', name: 'Contact Form', icon: '📧', content: 'Contact information' },
  { id: 10, type: 'footer', name: 'Footer', icon: '🔻', content: 'Footer content' },
  { id: 11, type: 'gallery', name: 'Gallery', icon: '🖼️', content: 'Image gallery' },
  { id: 12, type: 'video', name: 'Video', icon: '🎬', content: 'Video embed' }
])

const dragStart = (event, block) => {
  event.dataTransfer.setData('blockType', block.type)
  event.dataTransfer.setData('blockContent', block.content)
}
=======
import { useEditorStore } from '../stores/editor';

const editorStore = useEditorStore();

const blockTypes = [
  { type: 'heading', name: 'Заголовок', emoji: '📝' },
  { type: 'paragraph', name: 'Параграф', emoji: '📄' },
  { type: 'button', name: 'Кнопка', emoji: '🔘' },
  { type: 'image', name: 'Изображение', emoji: '🖼️' },
  { type: 'text', name: 'Текст', emoji: '✏️' }
];

const onDragStart = (blockType) => {
  event.dataTransfer.setData('application/json', JSON.stringify(blockType));
};
>>>>>>> malix
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