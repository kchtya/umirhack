<template>
  <div class="block-editor">
    <h3>Редактор блока</h3>
    
    <div class="editor-section">
      <label>Тип блока:</label>
      <div class="block-type">{{ activeBlock.type }}</div>
    </div>

    <div class="editor-section">
      <label>Содержимое:</label>
      <textarea 
        v-if="isTextBlock" 
        v-model="localContent" 
        @input="updateContent"
        rows="4"
        placeholder="Введите текст..."
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
        Удалить блок
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
  const textTypes = ['heading', 'paragraph', 'text', 'button'];
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
</script>

<style scoped>
.block-editor {
  width: 300px;
  padding: 20px;
  background: #f8f9fa;
  border-left: 2px solid #dee2e6;
  min-height: 100vh;
}

.block-editor h3 {
  margin: 0 0 20px 0;
  color: #495057;
  font-size: 1.2rem;
}

.editor-section {
  margin-bottom: 20px;
}

.editor-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.block-type {
  padding: 8px 12px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
  resize: vertical;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #4dabf7;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.editor-actions {
  margin-top: 30px;
}

.btn-danger {
  width: 100%;
  padding: 10px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-danger:hover {
  background: #c82333;
}
</style>