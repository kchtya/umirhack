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
        rows="4"
        placeholder="Введите текст..."
        style="white-space: pre-wrap;"
      />
      <input 
        v-else-if="activeBlock.type === 'image'"
        v-model="localContent"
        @input="updateContent"
        type="text"
        placeholder="URL изображения"
      />
      <input 
        v-else
        v-model="localContent"
        @input="updateContent"
        type="text"
        placeholder="Введите содержимое..."
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

watch(activeBlock, (newBlock) => {
  if (newBlock) {
    localContent.value = newBlock.content;
  }
}, { immediate: true });

const isTextBlock = computed(() => {
  const textTypes = ['hero', 'heading', 'paragraph', 'text', 'button'];
  return textTypes.includes(activeBlock.value?.type);
});

const updateContent = () => {
  if (activeBlock.value) {
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
    'text': 'ТЕКСТ'
  };
  return typeNames[type] || type.toUpperCase();
};
</script>

<style scoped>
.block-editor {
  width: 300px;
  padding: 2rem;
  background: var(--bg-tertiary);
  border-left: 1px solid var(--border-color);
  min-height: 100vh;
}

.block-editor h3 {
  margin: 0 0 2rem 0;
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 2px;
  opacity: 0.8;
  text-transform: uppercase;
}

.editor-section {
  margin-bottom: 2rem;
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
  padding: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  color: var(--text-primary);
  font-weight: 400;
  letter-spacing: 1px;
}

input, textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  resize: vertical;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-family: inherit;
}

input:focus, textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(59, 31, 161, 0.2);
}

.editor-actions {
  margin-top: 2rem;
}

.btn-danger {
  width: 100%;
  padding: 1rem;
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