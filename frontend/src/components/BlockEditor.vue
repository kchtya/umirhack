<template>
  <div class="block-editor">
    <h3>РЕДАКТОР БЛОКА</h3>
    
    <div class="editor-section">
      <label>Тип блока:</label>
      <div class="block-type">{{ getBlockTypeName(activeBlock.type) }}</div>
    </div>

    <div class="editor-section">
      <label>Содержимое:</label>
      <textarea 
        v-if="isTextBlock" 
        v-model="localContent" 
        @input="updateContent"
        @blur="updateContent"
        rows="4"
        placeholder="Введите текст..."
        class="content-input"
      />
      <input 
        v-else-if="activeBlock.type === 'image'"
        v-model="localContent"
        @input="updateContent"
        @blur="updateContent"
        type="text"
        placeholder="URL изображения"
        class="content-input"
      />
      <input 
        v-else
        v-model="localContent"
        @input="updateContent"
        @blur="updateContent"
        type="text"
        placeholder="Введите содержимое..."
        class="content-input"
      />
    </div>

    <div class="editor-actions">
      <button @click="deleteCurrentBlock" class="btn-danger">
        УДАЛИТЬ БЛОК
      </button>
    </div>
  </div>
</template>

<script setup>
import { useEditorStore } from '../stores/editor';
import { storeToRefs } from 'pinia';
import { ref, watch, computed } from 'vue';

const editorStore = useEditorStore();
const { activeBlock } = storeToRefs(editorStore);
const { updateBlockContent, deleteBlock } = editorStore;

const localContent = ref('');

// Следим за изменением активного блока
watch(activeBlock, (newBlock) => {
  if (newBlock) {
    localContent.value = newBlock.content || '';
    console.log('BlockEditor: Active block changed', newBlock);
  } else {
    localContent.value = '';
  }
}, { immediate: true, deep: true });

const isTextBlock = computed(() => {
  const textTypes = ['hero', 'heading', 'paragraph', 'text', 'button', 'features', 'testimonials', 'contact', 'footer'];
  return textTypes.includes(activeBlock.value?.type);
});

const updateContent = () => {
  if (activeBlock.value && localContent.value !== undefined) {
    console.log('BlockEditor: Updating content', activeBlock.value.id, localContent.value);
    updateBlockContent(activeBlock.value.id, localContent.value);
  }
};

const deleteCurrentBlock = () => {
  if (activeBlock.value) {
    deleteBlock(activeBlock.value.id);
  }
};

const getBlockTypeName = (type) => {
  const typeNames = {
    'hero': 'ШАПКА',
    'heading': 'ЗАГОЛОВОК',
    'paragraph': 'ПАРАГРАФ', 
    'button': 'КНОПКА',
    'image': 'ИЗОБРАЖЕНИЕ',
    'text': 'ТЕКСТ',
    'features': 'ФУНКЦИИ',
    'testimonials': 'ОТЗЫВЫ',
    'contact': 'КОНТАКТЫ',
    'footer': 'ФУТЕР'
  };
  return typeNames[type] || type.toUpperCase();
};
</script>

<style scoped>
.block-editor {
  width: 100%;
  padding: 1.5rem;
  background: var(--bg-tertiary);
  min-height: auto;
}

.block-editor h3 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 2px;
  opacity: 0.8;
  text-transform: uppercase;
}

.editor-section {
  margin-bottom: 1.5rem;
}

.editor-section label {
  display: block;
  margin-bottom: 0.8rem;
  font-weight: 300;
  color: var(--text-secondary);
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.block-type {
  padding: 0.8rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  color: var(--text-primary);
  font-weight: 400;
  letter-spacing: 1px;
}

.content-input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  resize: vertical;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-family: inherit;
}

.content-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(59, 31, 161, 0.2);
}

.editor-actions {
  margin-top: 1.5rem;
}

.btn-danger {
  width: 100%;
  padding: 0.8rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.2s;
}

.btn-danger:hover {
  background: #c82333;
  transform: translateY(-1px);
}
</style>