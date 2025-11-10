<template>
  <div class="toolbar" v-if="activeBlock">
    <h3>ИНСТРУМЕНТЫ</h3>
    
    <div class="toolbar-section">
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

    <div class="toolbar-section">
      <label>Стили блока:</label>
      
      <!-- Цвет фона -->
      <div class="style-control">
        <span>Фон:</span>
        <input 
          type="color" 
          v-model="backgroundColor"
          @change="updateBackgroundColor"
          class="color-input"
        >
        <span class="color-value">{{ backgroundColor }}</span>
      </div>
      
      <!-- Цвет текста -->
      <div class="style-control" v-if="hasText">
        <span>Текст:</span>
        <input 
          type="color" 
          v-model="textColor"
          @change="updateTextColor"
          class="color-input"
        >
        <span class="color-value">{{ textColor }}</span>
      </div>
      
      <!-- Размер шрифта -->
      <div class="style-control" v-if="hasText">
        <span>Размер шрифта:</span>
        <input 
          type="range" 
          min="12" 
          max="72" 
          v-model="fontSizeValue"
          @input="updateFontSize"
          class="range-input"
        >
        <span class="value">{{ fontSizeValue }}px</span>
      </div>
      
      <!-- Шрифт -->
      <div class="style-control" v-if="hasText">
        <span>Шрифт:</span>
        <select v-model="fontFamily" @change="updateFontFamily" class="select-input">
          <option value="inherit">Monospace</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="'Courier New', monospace">Courier New</option>
        </select>
      </div>
      
      <!-- Выравнивание -->
      <div class="style-control" v-if="hasText">
        <span>Выравнивание:</span>
        <select v-model="textAlign" @change="updateTextAlign" class="select-input">
          <option value="left">Слева</option>
          <option value="center">По центру</option>
          <option value="right">Справа</option>
          <option value="justify">По ширине</option>
        </select>
      </div>
      
      <!-- Отступы -->
      <div class="style-control">
        <span>Отступы:</span>
        <input 
          type="range" 
          min="0" 
          max="50" 
          v-model="paddingValue"
          @input="updatePadding"
          class="range-input"
        >
        <span class="value">{{ paddingValue }}px</span>
      </div>

      <!-- Скругление углов -->
      <div class="style-control">
        <span>Скругление:</span>
        <input 
          type="range" 
          min="0" 
          max="20" 
          v-model="borderRadiusValue"
          @input="updateBorderRadius"
          class="range-input"
        >
        <span class="value">{{ borderRadiusValue }}px</span>
      </div>

      <!-- Ширина блока -->
      <div class="style-control">
        <span>Ширина:</span>
        <input 
          type="range" 
          min="50" 
          max="100" 
          v-model="widthValue"
          @input="updateWidth"
          class="range-input"
        >
        <span class="value">{{ widthValue }}%</span>
      </div>

      <!-- Высота блока -->
      <div class="style-control" v-if="activeBlock.type === 'image' || activeBlock.type === 'hero'">
        <span>Высота:</span>
        <input 
          type="range" 
          min="100" 
          max="500" 
          v-model="heightValue"
          @input="updateHeight"
          class="range-input"
        >
        <span class="value">{{ heightValue }}px</span>
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
const { updateBlockContent, updateBlockStyles, moveBlock, duplicateBlock: duplicateStoreBlock } = editorStore;

const localContent = ref('');

// Отдельные переменные для каждого стиля
const backgroundColor = ref('#ffffff');
const textColor = ref('#000000');
const fontSizeValue = ref(16);
const fontFamily = ref('inherit');
const textAlign = ref('left');
const paddingValue = ref(20);
const borderRadiusValue = ref(8);
const widthValue = ref(100);
const heightValue = ref(200);

const hasText = computed(() => {
  const textTypes = ['hero', 'heading', 'paragraph', 'text', 'button', 'features', 'testimonials', 'contact', 'footer'];
  return textTypes.includes(activeBlock.value?.type);
});

const isTextBlock = computed(() => {
  const textTypes = ['hero', 'heading', 'paragraph', 'text', 'features', 'testimonials', 'contact', 'footer'];
  return textTypes.includes(activeBlock.value?.type);
});

const currentBlockIndex = computed(() => 
  blocks.value.findIndex(block => block.id === activeBlock.value?.id)
);

const canMoveUp = computed(() => currentBlockIndex.value > 0);
const canMoveDown = computed(() => currentBlockIndex.value < blocks.value.length - 1 && currentBlockIndex.value !== -1);

// Обновляем значения при смене активного блока
watch(activeBlock, (newBlock) => {
  if (newBlock) {
    localContent.value = newBlock.content || '';
    
    // Обновляем значения стилей из блока
    const styles = newBlock.styles || {};
    
    backgroundColor.value = styles.backgroundColor || '#ffffff';
    textColor.value = styles.color || '#000000';
    fontSizeValue.value = parseInt(styles.fontSize?.replace('px', '') || '16');
    fontFamily.value = styles.fontFamily || 'inherit';
    textAlign.value = styles.textAlign || 'left';
    paddingValue.value = parseInt(styles.padding?.replace('px', '') || '20');
    borderRadiusValue.value = parseInt(styles.borderRadius?.replace('px', '') || '8');
    widthValue.value = parseInt(styles.width?.replace('%', '') || '100');
    heightValue.value = parseInt(styles.height?.replace('px', '') || '200');
    
    console.log('Toolbar: Active block updated', newBlock);
  }
}, { immediate: true, deep: true });

const updateContent = () => {
  if (activeBlock.value && localContent.value !== undefined) {
    console.log('Updating content:', localContent.value);
    updateBlockContent(activeBlock.value.id, localContent.value);
  }
};

// Отдельные функции для каждого стиля
const updateBackgroundColor = () => {
  updateBlockStyles(activeBlock.value.id, { backgroundColor: backgroundColor.value });
};

const updateTextColor = () => {
  updateBlockStyles(activeBlock.value.id, { color: textColor.value });
};

const updateFontSize = () => {
  updateBlockStyles(activeBlock.value.id, { fontSize: fontSizeValue.value + 'px' });
};

const updateFontFamily = () => {
  updateBlockStyles(activeBlock.value.id, { fontFamily: fontFamily.value });
};

const updateTextAlign = () => {
  updateBlockStyles(activeBlock.value.id, { textAlign: textAlign.value });
};

const updatePadding = () => {
  updateBlockStyles(activeBlock.value.id, { padding: paddingValue.value + 'px' });
};

const updateBorderRadius = () => {
  updateBlockStyles(activeBlock.value.id, { borderRadius: borderRadiusValue.value + 'px' });
};

const updateWidth = () => {
  updateBlockStyles(activeBlock.value.id, { width: widthValue.value + '%' });
};

const updateHeight = () => {
  updateBlockStyles(activeBlock.value.id, { height: heightValue.value + 'px' });
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
  width: 100%;
  padding: 1.5rem;
  background: var(--bg-tertiary);
  min-height: auto;
  overflow-y: auto;
}

.toolbar h3 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 2px;
  opacity: 0.8;
  text-transform: uppercase;
}

.toolbar-section {
  margin-bottom: 1.5rem;
}

.toolbar-section label {
  display: block;
  margin-bottom: 0.8rem;
  font-weight: 300;
  color: var(--text-secondary);
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
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

.style-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  font-size: 0.8rem;
}

.style-control span:first-child {
  color: var(--text-secondary);
  min-width: 80px;
  font-size: 0.75rem;
}

.color-input {
  width: 40px;
  height: 30px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  background: var(--bg-secondary);
}

.color-value {
  font-size: 0.7rem;
  color: var(--text-tertiary);
  min-width: 70px;
  text-align: right;
  font-family: monospace;
}

.range-input {
  flex: 1;
  margin: 0 8px;
  background: var(--bg-secondary);
}

.select-input {
  padding: 6px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.8rem;
  width: 140px;
}

.value {
  font-size: 0.7rem;
  color: var(--text-tertiary);
  min-width: 35px;
  text-align: right;
}

.toolbar-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.5rem;
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

.toolbar::-webkit-scrollbar {
  width: 6px;
}

.toolbar::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
}

.toolbar::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 3px;
}

.toolbar::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}
</style>