<template>
  <div class="toolbar" v-if="activeBlock">
    <h3>ИНСТРУМЕНТЫ</h3>
    
    <div class="toolbar-section">
      <label>Стили блока:</label>
      
      <!-- Цвет фона -->
      <div class="style-control">
        <span>Фон:</span>
        <input 
          type="color" 
          v-model="localStyles.backgroundColor"
          @change="updateStyles"
        >
      </div>
      
      <!-- Цвет текста -->
      <div class="style-control" v-if="hasText">
        <span>Текст:</span>
        <input 
          type="color" 
          v-model="localStyles.color"
          @change="updateStyles"
        >
      </div>
      
      <!-- Размер шрифта -->
      <div class="style-control" v-if="hasText">
        <span>Размер шрифта:</span>
        <input 
          type="range" 
          min="12" 
          max="72" 
          v-model="localStyles.fontSize"
          @input="updateStyles"
        >
        <span class="value">{{ localStyles.fontSize }}px</span>
      </div>
      
      <!-- Выравнивание -->
      <div class="style-control" v-if="hasText">
        <span>Выравнивание:</span>
        <select v-model="localStyles.textAlign" @change="updateStyles">
          <option value="left">Слева</option>
          <option value="center">По центру</option>
          <option value="right">Справа</option>
        </select>
      </div>
      
      <!-- Отступы -->
      <div class="style-control">
        <span>Отступы:</span>
        <input 
          type="range" 
          min="0" 
          max="50" 
          v-model="localStyles.padding"
          @input="updateStyles"
        >
        <span class="value">{{ localStyles.padding }}px</span>
      </div>
    </div>

    <div class="toolbar-actions">
      <button @click="moveBlockUp" class="toolbar-btn" :disabled="!canMoveUp">
        ↑ Вверх
      </button>
      <button @click="moveBlockDown" class="toolbar-btn" :disabled="!canMoveDown">
        ↓ Вниз
      </button>
      <button @click="duplicateBlock" class="toolbar-btn">
        📋 Дублировать
      </button>
    </div>
  </div>
</template>

<script setup>
import { useEditorStore } from '../stores/editor';
import { storeToRefs } from 'pinia';
import { ref, watch, computed } from 'vue';

const editorStore = useEditorStore();
const { activeBlock, blocks } = storeToRefs(editorStore);
const { updateBlockStyles, moveBlock, duplicateBlock: duplicateStoreBlock } = editorStore;

const localStyles = ref({
  backgroundColor: '#ffffff',
  color: '#000000',
  fontSize: '16',
  textAlign: 'left',
  padding: '10'
});

const hasText = computed(() => {
  const textTypes = ['hero', 'heading', 'paragraph', 'text', 'button'];
  return textTypes.includes(activeBlock.value?.type);
});

const currentBlockIndex = computed(() => 
  blocks.value.findIndex(block => block.id === activeBlock.value?.id)
);

const canMoveUp = computed(() => currentBlockIndex.value > 0);
const canMoveDown = computed(() => currentBlockIndex.value < blocks.value.length - 1 && currentBlockIndex.value !== -1);

watch(activeBlock, (newBlock) => {
  if (newBlock) {
    localStyles.value = {
      backgroundColor: newBlock.styles?.backgroundColor || '#ffffff',
      color: newBlock.styles?.color || '#000000',
      fontSize: newBlock.styles?.fontSize?.replace('px', '') || '16',
      textAlign: newBlock.styles?.textAlign || 'left',
      padding: newBlock.styles?.padding?.replace('px', '') || '10'
    };
  }
}, { immediate: true });

const updateStyles = () => {
  if (activeBlock.value) {
    const styles = {
      ...localStyles.value,
      fontSize: localStyles.value.fontSize + 'px',
      padding: localStyles.value.padding + 'px'
    };
    updateBlockStyles(activeBlock.value.id, styles);
  }
};

const moveBlockUp = () => {
  if (canMoveUp.value) {
    moveBlock(currentBlockIndex.value, currentBlockIndex.value - 1);
  }
};

const moveBlockDown = () => {
  if (canMoveDown.value) {
    moveBlock(currentBlockIndex.value, currentBlockIndex.value + 1);
  }
};

const duplicateBlock = () => {
  if (activeBlock.value) {
    duplicateStoreBlock(activeBlock.value.id);
  }
};
</script>

<style scoped>
.toolbar {
  width: 280px;
  padding: 2rem;
  background: var(--bg-tertiary);
  border-left: 1px solid var(--border-color);
  min-height: 100vh;
}

.toolbar h3 {
  margin: 0 0 2rem 0;
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 2px;
  opacity: 0.8;
  text-transform: uppercase;
}

.toolbar-section {
  margin-bottom: 2rem;
}

.toolbar-section label {
  display: block;
  margin-bottom: 1rem;
  font-weight: 300;
  color: var(--text-secondary);
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.style-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.8rem;
}

.style-control span:first-child {
  color: var(--text-secondary);
  min-width: 80px;
}

.style-control input[type="color"] {
  width: 40px;
  height: 30px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
}

.style-control input[type="range"] {
  flex: 1;
  margin: 0 10px;
}

.style-control select {
  padding: 5px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.value {
  font-size: 0.7rem;
  color: var(--text-tertiary);
  min-width: 40px;
  text-align: right;
}

.toolbar-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toolbar-btn {
  padding: 0.8rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
}

.toolbar-btn:hover:not(:disabled) {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>