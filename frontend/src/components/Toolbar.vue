<template>
  <div class="toolbar">
    <div class="toolbar-header">
      <h3>РЕДАКТОР БЛОКА</h3>
      <div class="block-info">
        <span class="block-type">{{ activeBlock?.name }}</span>
        <span class="block-id">ID: {{ activeBlock?.id }}</span>
      </div>
    </div>

    <div class="toolbar-content">
      <!-- Содержимое блока -->
      <div class="section">
        <h4 class="section-title">СОДЕРЖИМОЕ</h4>
        <div class="form-group">
          <label>Текст:</label>
          <textarea 
            v-model="blockContent" 
            @input="updateContent"
            placeholder="Введите текст..."
            rows="3"
          ></textarea>
        </div>
      </div>

      <!-- Стили блока -->
      <div class="section">
        <h4 class="section-title">СТИЛИ БЛОКА</h4>
        
        <!-- Цвет фона -->
        <div class="form-group">
          <label>Цвет фона:</label>
          <div class="color-input-group">
            <input 
              type="color" 
              v-model="styles.backgroundColor"
              @input="updateStyles"
            >
            <input 
              type="text" 
              v-model="styles.backgroundColor"
              @input="updateStyles"
              placeholder="#ffffff"
            >
          </div>
        </div>

        <!-- Фоновое изображение -->
        <div class="form-group">
          <label>Фоновое изображение:</label>
          <input 
            type="text" 
            v-model="styles.backgroundImage"
            @input="updateStyles"
            placeholder="URL изображения"
          >
        </div>

        <!-- Цвет текста -->
        <div class="form-group">
          <label>Цвет текста:</label>
          <div class="color-input-group">
            <input 
              type="color" 
              v-model="styles.color"
              @input="updateStyles"
            >
            <input 
              type="text" 
              v-model="styles.color"
              @input="updateStyles"
              placeholder="#000000"
            >
          </div>
        </div>

        <!-- Размер шрифта -->
        <div class="form-group">
          <label>Размер шрифта:</label>
          <input 
            type="text" 
            v-model="styles.fontSize"
            @input="updateStyles"
            placeholder="16px"
          >
        </div>

        <!-- Выравнивание текста -->
        <div class="form-group">
          <label>Выравнивание:</label>
          <select v-model="styles.textAlign" @change="updateStyles">
            <option value="left">Слева</option>
            <option value="center">По центру</option>
            <option value="right">Справа</option>
            <option value="justify">По ширине</option>
          </select>
        </div>
      </div>

      <!-- Размеры и отступы -->
      <div class="section">
        <h4 class="section-title">РАЗМЕРЫ И ОТСТУПЫ</h4>
        
        <!-- Внутренние отступы -->
        <div class="form-group">
          <label>Внутренние отступы:</label>
          <input 
            type="text" 
            v-model="styles.padding"
            @input="updateStyles"
            placeholder="20px"
          >
        </div>

        <!-- Внешние отступы -->
        <div class="form-group">
          <label>Внешние отступы:</label>
          <input 
            type="text" 
            v-model="styles.margin"
            @input="updateStyles"
            placeholder="0"
          >
        </div>

        <!-- Скругление углов -->
        <div class="form-group">
          <label>Скругление углов:</label>
          <input 
            type="text" 
            v-model="styles.borderRadius"
            @input="updateStyles"
            placeholder="0px"
          >
        </div>

        <!-- Ширина -->
        <div class="form-group">
          <label>Ширина:</label>
          <input 
            type="text" 
            v-model="styles.width"
            @input="updateStyles"
            placeholder="100%"
          >
        </div>
      </div>

      <!-- Быстрые стили -->
      <div class="section">
        <h4 class="section-title">БЫСТРЫЕ СТИЛИ</h4>
        <div class="quick-styles">
          <button 
            v-for="style in quickStyles" 
            :key="style.name"
            class="quick-style-btn"
            @click="applyQuickStyle(style)"
          >
            {{ style.name }}
          </button>
        </div>
      </div>

      <!-- Действия с блоком -->
      <div class="section">
        <h4 class="section-title">ДЕЙСТВИЯ</h4>
        <div class="action-buttons">
          <!-- ИСПРАВЛЕНЫ ИКОНКИ: Используем правильные SVG -->
          <button @click="duplicateBlock" class="action-btn" title="Дублировать">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Дублировать
          </button>
          
          <button 
            v-if="!activeBlock?.isStructural"
            @click="deleteBlock" 
            class="action-btn delete" 
            title="Удалить"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Удалить блок
          </button>

          <button @click="moveBlockUp" class="action-btn" title="Переместить вверх">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m18 15-6-6-6 6"/>
            </svg>
            Вверх
          </button>

          <button @click="moveBlockDown" class="action-btn" title="Переместить вниз">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m6 9 6 6 6-6"/>
            </svg>
            Вниз
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useEditorStore } from '../stores/editor';
import { storeToRefs } from 'pinia';
import { ref, watch, computed } from 'vue';

const editorStore = useEditorStore();
const { activeBlock } = storeToRefs(editorStore);
const { updateBlockContent, updateBlockStyles, duplicateBlock: duplicateStoreBlock, deleteBlock: deleteStoreBlock, moveBlock } = editorStore;

const blockContent = ref('');
const styles = ref({
  backgroundColor: '',
  backgroundImage: '',
  color: '',
  fontSize: '',
  textAlign: '',
  padding: '',
  margin: '',
  borderRadius: '',
  width: ''
});

// Быстрые стили
const quickStyles = [
  { 
    name: 'Заголовок', 
    styles: { 
      fontSize: '32px', 
      fontWeight: 'bold',
      color: '#333333',
      textAlign: 'center'
    } 
  },
  { 
    name: 'Подзаголовок', 
    styles: { 
      fontSize: '24px', 
      fontWeight: '600',
      color: '#666666',
      textAlign: 'left'
    } 
  },
  { 
    name: 'Текст', 
    styles: { 
      fontSize: '16px', 
      color: '#444444',
      lineHeight: '1.6'
    } 
  },
  { 
    name: 'Карточка', 
    styles: { 
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    } 
  }
];

// Следим за изменением активного блока
watch(activeBlock, (newBlock) => {
  if (newBlock) {
    blockContent.value = newBlock.content || '';
    styles.value = { ...styles.value, ...newBlock.styles };
  }
}, { immediate: true });

const updateContent = () => {
  if (activeBlock.value) {
    updateBlockContent(activeBlock.value.id, blockContent.value);
  }
};

const updateStyles = () => {
  if (activeBlock.value) {
    updateBlockStyles(activeBlock.value.id, { ...styles.value });
  }
};

const applyQuickStyle = (style) => {
  if (activeBlock.value) {
    styles.value = { ...styles.value, ...style.styles };
    updateBlockStyles(activeBlock.value.id, { ...style.styles });
  }
};

const duplicateBlock = () => {
  if (activeBlock.value) {
    duplicateStoreBlock(activeBlock.value.id);
  }
};

const deleteBlock = () => {
  if (activeBlock.value && !activeBlock.value.isStructural) {
    deleteStoreBlock(activeBlock.value.id);
  } else if (activeBlock.value?.isStructural) {
    alert('Нельзя удалять структурные блоки');
  }
};

const moveBlockUp = () => {
  if (activeBlock.value) {
    moveBlock(activeBlock.value.id, 'up');
  }
};

const moveBlockDown = () => {
  if (activeBlock.value) {
    moveBlock(activeBlock.value.id, 'down');
  }
};
</script>

<style scoped>
.toolbar {
  height: 100%;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.toolbar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
  flex-shrink: 0;
}

.toolbar-header h3 {
  font-weight: 400;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
  opacity: 0.8;
  font-size: 0.9rem;
  text-transform: uppercase;
  color: var(--text-primary);
}

.block-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.block-type {
  font-weight: 500;
  color: var(--text-primary);
}

.block-id {
  opacity: 0.6;
  color: var(--text-tertiary);
  font-family: monospace;
}

.toolbar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
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
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.8rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(59, 31, 161, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
}

.color-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.color-input-group input[type="color"] {
  width: 40px;
  height: 40px;
  padding: 2px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
}

.color-input-group input[type="text"] {
  flex: 1;
}

.quick-styles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.quick-style-btn {
  padding: 0.75rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.quick-style-btn:hover {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
  transform: translateY(-1px);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.action-btn:hover {
  background: var(--hover-color);
  border-color: var(--accent-color);
  transform: translateY(-1px);
}

.action-btn.delete:hover {
  background: var(--danger-color, #dc3545);
  color: white;
  border-color: var(--danger-color, #dc3545);
}

.action-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Кастомный скроллбар */
.toolbar-content::-webkit-scrollbar {
  width: 6px;
}

.toolbar-content::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
}

.toolbar-content::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 3px;
}

.toolbar-content::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

@media (max-width: 768px) {
  .toolbar-header {
    padding: 1rem;
  }
  
  .toolbar-content {
    padding: 1rem;
  }
  
  .quick-styles {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    gap: 0.25rem;
  }
  
  .action-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.7rem;
  }
}
</style>