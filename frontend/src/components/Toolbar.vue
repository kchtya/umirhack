<template>
  <div class="toolbar" v-if="activeBlock">
    <h3>ИНСТРУМЕНТЫ БЛОКА</h3>
    
    <!-- Информация о блоке -->
    <div class="toolbar-section">
      <label>Информация:</label>
      <div class="block-info">
        <div class="info-item">
          <strong>Тип:</strong> {{ getBlockTypeName(activeBlock.type) }}
        </div>
        <div v-if="activeBlock.isStructural" class="structural-notice">
          ⚠️ Структурный блок
        </div>
      </div>
    </div>

    <!-- Содержимое -->
    <div class="toolbar-section" v-if="hasEditableContent">
      <label>Содержимое:</label>
      <textarea 
        v-if="isTextBlock" 
        v-model="localContent" 
        @input="updateContent"
        @blur="updateContent"
        rows="3"
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
      <div v-else class="no-content">
        Этот блок не содержит редактируемого текста
      </div>
    </div>

    <!-- Стили текста -->
    <div class="toolbar-section" v-if="hasText">
      <label>Стили текста:</label>
      
      <!-- Цвет текста -->
      <div class="style-control">
        <span>Цвет текста:</span>
        <input 
          type="color" 
          v-model="textColor"
          @change="updateTextColor"
          class="color-input"
        >
        <span class="color-value">{{ textColor }}</span>
      </div>
      
      <!-- Размер шрифта -->
      <div class="style-control">
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
      <div class="style-control">
        <span>Шрифт:</span>
        <select v-model="fontFamily" @change="updateFontFamily" class="select-input">
          <option value="inherit">Системный</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="'Courier New', monospace">Courier New</option>
          <option value="'Helvetica Neue', sans-serif">Helvetica</option>
        </select>
      </div>
      
      <!-- Выравнивание -->
      <div class="style-control">
        <span>Выравнивание:</span>
        <select v-model="textAlign" @change="updateTextAlign" class="select-input">
          <option value="left">Слева</option>
          <option value="center">По центру</option>
          <option value="right">Справа</option>
          <option value="justify">По ширине</option>
        </select>
      </div>

      <!-- Жирность -->
      <div class="style-control">
        <span>Жирность:</span>
        <select v-model="fontWeight" @change="updateFontWeight" class="select-input">
          <option value="normal">Обычный</option>
          <option value="bold">Жирный</option>
          <option value="lighter">Тонкий</option>
        </select>
      </div>
    </div>

    <!-- Фон блока -->
    <div class="toolbar-section">
      <label>Фон блока:</label>
      
      <!-- Цвет фона -->
      <div class="style-control">
        <span>Цвет фона:</span>
        <input 
          type="color" 
          v-model="backgroundColor"
          @change="updateBackgroundColor"
          class="color-input"
        >
        <span class="color-value">{{ backgroundColor }}</span>
      </div>

      <!-- Фоновое изображение -->
      <div class="style-control">
        <span>Фоновое изображение:</span>
        <input 
          type="text" 
          v-model="backgroundImage"
          @input="updateBackgroundImage"
          placeholder="URL изображения"
          class="content-input small"
        >
      </div>

      <!-- Прозрачность фона -->
      <div class="style-control">
        <span>Прозрачность:</span>
        <input 
          type="range" 
          min="0" 
          max="100" 
          v-model="backgroundOpacity"
          @input="updateBackgroundOpacity"
          class="range-input"
        >
        <span class="value">{{ backgroundOpacity }}%</span>
      </div>

      <!-- Размер фона -->
      <div class="style-control" v-if="backgroundImage !== 'none' && backgroundImage !== ''">
        <span>Размер фона:</span>
        <select v-model="backgroundSize" @change="updateBackgroundSize" class="select-input">
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="auto">Auto</option>
        </select>
      </div>

      <!-- Позиция фона -->
      <div class="style-control" v-if="backgroundImage !== 'none' && backgroundImage !== ''">
        <span>Позиция фона:</span>
        <select v-model="backgroundPosition" @change="updateBackgroundPosition" class="select-input">
          <option value="center">Center</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>

    <!-- Размеры и отступы -->
    <div class="toolbar-section">
      <label>Размеры и отступы:</label>
      
      <!-- Отступы -->
      <div class="style-control">
        <span>Внутренние отступы:</span>
        <input 
          type="range" 
          min="0" 
          max="100" 
          v-model="paddingValue"
          @input="updatePadding"
          class="range-input"
        >
        <span class="value">{{ paddingValue }}px</span>
      </div>

      <!-- Внешние отступы -->
      <div class="style-control">
        <span>Внешние отступы:</span>
        <input 
          type="range" 
          min="0" 
          max="50" 
          v-model="marginValue"
          @input="updateMargin"
          class="range-input"
        >
        <span class="value">{{ marginValue }}px</span>
      </div>

      <!-- Скругление углов -->
      <div class="style-control">
        <span>Скругление углов:</span>
        <input 
          type="range" 
          min="0" 
          max="50" 
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
      <div class="style-control" v-if="activeBlock.type === 'image' || activeBlock.type === 'hero' || activeBlock.type === 'section'">
        <span>Минимальная высота:</span>
        <input 
          type="range" 
          min="100" 
          max="800" 
          v-model="minHeightValue"
          @input="updateMinHeight"
          class="range-input"
        >
        <span class="value">{{ minHeightValue }}px</span>
      </div>
    </div>

    <!-- Действия с блоком -->
    <div class="toolbar-actions" v-if="!activeBlock.isStructural">
      <button @click="duplicateBlock" class="toolbar-btn">
        📋 Дублировать
      </button>
      <button @click="deleteCurrentBlock" class="toolbar-btn danger">
        🗑️ Удалить блок
      </button>
    </div>

    <!-- Быстрые стили -->
    <div class="toolbar-section" v-if="hasText">
      <label>Быстрые стили:</label>
      <div class="quick-styles">
        <button 
          v-for="style in quickStyles" 
          :key="style.name"
          @click="applyQuickStyle(style)"
          class="quick-style-btn"
          :class="{ active: isQuickStyleActive(style) }"
        >
          {{ style.name }}
        </button>
      </div>
    </div>
  </div>
  <div v-else class="no-selection">
    <h3>ВЫБЕРИТЕ БЛОК</h3>
    <p>Выберите блок на холсте для редактирования</p>
  </div>
</template>

<script setup>
import { useEditorStore } from '../stores/editor';
import { storeToRefs } from 'pinia';
import { ref, watch, computed } from 'vue';

const editorStore = useEditorStore();
const { activeBlock, blocks } = storeToRefs(editorStore);
const { updateBlockContent, updateBlockStyles, duplicateBlock: duplicateStoreBlock, deleteBlock } = editorStore;

const localContent = ref('');

// Переменные стилей
const backgroundColor = ref('#ffffff');
const backgroundImage = ref('none');
const backgroundOpacity = ref(100);
const backgroundSize = ref('cover');
const backgroundPosition = ref('center');
const textColor = ref('#000000');
const fontSizeValue = ref(16);
const fontFamily = ref('inherit');
const textAlign = ref('left');
const fontWeight = ref('normal');
const paddingValue = ref(20);
const marginValue = ref(0);
const borderRadiusValue = ref(0);
const widthValue = ref(100);
const minHeightValue = ref(200);

const hasText = computed(() => {
  const textTypes = ['hero', 'heading', 'paragraph', 'text', 'button', 'features', 'testimonials', 'contact', 'footer'];
  return textTypes.includes(activeBlock.value?.type);
});

const hasEditableContent = computed(() => {
  const editableTypes = ['hero', 'heading', 'paragraph', 'text', 'button', 'features', 'testimonials', 'contact', 'footer', 'image'];
  return editableTypes.includes(activeBlock.value?.type);
});

const isTextBlock = computed(() => {
  const textTypes = ['hero', 'heading', 'paragraph', 'text', 'features', 'testimonials', 'contact', 'footer'];
  return textTypes.includes(activeBlock.value?.type);
});

const quickStyles = [
  { name: 'Заголовок', styles: { fontSize: '32px', fontWeight: 'bold', color: '#333333' } },
  { name: 'Подзаголовок', styles: { fontSize: '24px', fontWeight: 'bold', color: '#666666' } },
  { name: 'Основной текст', styles: { fontSize: '16px', color: '#333333', lineHeight: '1.6' } },
  { name: 'Выделенный', styles: { backgroundColor: '#fff3cd', padding: '10px', borderRadius: '4px' } }
];

const getBlockTypeName = (type) => {
  const typeNames = {
    'hero': 'Hero Секция',
    'heading': 'Заголовок',
    'paragraph': 'Параграф', 
    'button': 'Кнопка',
    'image': 'Изображение',
    'text': 'Текст',
    'features': 'Функции',
    'testimonials': 'Отзывы',
    'contact': 'Контакты',
    'footer': 'Подвал',
    'container': 'Тело',
    'section': 'Секция',
    'header': 'Шапка',
    'columns': 'Колонки'
  };
  return typeNames[type] || type.toUpperCase();
};

// Обновляем значения при смене активного блока
watch(activeBlock, (newBlock) => {
  if (newBlock) {
    localContent.value = newBlock.content || '';
    
    const styles = newBlock.styles || {};
    
    backgroundColor.value = styles.backgroundColor || '#ffffff';
    backgroundImage.value = styles.backgroundImage || 'none';
    backgroundSize.value = styles.backgroundSize || 'cover';
    backgroundPosition.value = styles.backgroundPosition || 'center';
    textColor.value = styles.color || '#000000';
    fontSizeValue.value = parseInt(styles.fontSize?.replace('px', '') || '16');
    fontFamily.value = styles.fontFamily || 'inherit';
    textAlign.value = styles.textAlign || 'left';
    fontWeight.value = styles.fontWeight || 'normal';
    paddingValue.value = parseInt(styles.padding?.replace('px', '') || '20');
    marginValue.value = parseInt(styles.margin?.replace('px', '') || '0');
    borderRadiusValue.value = parseInt(styles.borderRadius?.replace('px', '') || '0');
    widthValue.value = parseInt(styles.width?.replace('%', '') || '100');
    minHeightValue.value = parseInt(styles.minHeight?.replace('px', '') || '200');
    
    // Обработка opacity
    if (styles.opacity) {
      backgroundOpacity.value = Math.round(parseFloat(styles.opacity) * 100);
    } else {
      backgroundOpacity.value = 100;
    }
  }
}, { immediate: true, deep: true });

const updateContent = () => {
  if (activeBlock.value && localContent.value !== undefined) {
    updateBlockContent(activeBlock.value.id, localContent.value);
  }
};

// Функции обновления стилей
const updateBackgroundColor = () => {
  updateBlockStyles(activeBlock.value.id, { backgroundColor: backgroundColor.value });
};

const updateBackgroundImage = () => {
  const bgImage = backgroundImage.value && backgroundImage.value !== 'none' ? `url(${backgroundImage.value})` : 'none';
  updateBlockStyles(activeBlock.value.id, { 
    backgroundImage: bgImage
  });
};

const updateBackgroundOpacity = () => {
  const opacity = backgroundOpacity.value / 100;
  updateBlockStyles(activeBlock.value.id, { opacity: opacity.toString() });
};

const updateBackgroundSize = () => {
  updateBlockStyles(activeBlock.value.id, { backgroundSize: backgroundSize.value });
};

const updateBackgroundPosition = () => {
  updateBlockStyles(activeBlock.value.id, { backgroundPosition: backgroundPosition.value });
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

const updateFontWeight = () => {
  updateBlockStyles(activeBlock.value.id, { fontWeight: fontWeight.value });
};

const updatePadding = () => {
  updateBlockStyles(activeBlock.value.id, { padding: paddingValue.value + 'px' });
};

const updateMargin = () => {
  updateBlockStyles(activeBlock.value.id, { margin: marginValue.value + 'px' });
};

const updateBorderRadius = () => {
  updateBlockStyles(activeBlock.value.id, { borderRadius: borderRadiusValue.value + 'px' });
};

const updateWidth = () => {
  updateBlockStyles(activeBlock.value.id, { width: widthValue.value + '%' });
};

const updateMinHeight = () => {
  updateBlockStyles(activeBlock.value.id, { minHeight: minHeightValue.value + 'px' });
};

const duplicateBlock = () => {
  if (activeBlock.value) {
    duplicateStoreBlock(activeBlock.value.id);
  }
};

const deleteCurrentBlock = () => {
  if (activeBlock.value) {
    deleteBlock(activeBlock.value.id);
  }
};

const applyQuickStyle = (style) => {
  updateBlockStyles(activeBlock.value.id, style.styles);
};

const isQuickStyleActive = (style) => {
  const currentStyles = activeBlock.value?.styles || {};
  return Object.keys(style.styles).every(key => 
    currentStyles[key] === style.styles[key]
  );
};
</script>

<style scoped>
.toolbar {
  width: 100%;
  padding: 1.5rem;
  background: var(--bg-tertiary);
  min-height: auto;
  overflow-y: auto;
  max-height: 100vh;
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
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.toolbar-section:last-child {
  border-bottom: none;
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

.block-info {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
}

.info-item {
  margin-bottom: 0.5rem;
}

.structural-notice {
  background: #fff3cd;
  color: #856404;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  text-align: center;
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

.content-input.small {
  font-size: 0.8rem;
  padding: 0.5rem;
}

.content-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(59, 31, 161, 0.2);
}

.no-content {
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 4px;
  color: var(--text-tertiary);
  text-align: center;
  font-size: 0.8rem;
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
  min-width: 120px;
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
  min-width: 45px;
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
  transform: translateY(-1px);
}

.toolbar-btn.danger:hover:not(:disabled) {
  background: #dc3545;
  border-color: #dc3545;
}

.quick-styles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.quick-style-btn {
  padding: 0.6rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.7rem;
}

.quick-style-btn:hover,
.quick-style-btn.active {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.no-selection {
  padding: 2rem;
  text-align: center;
  color: var(--text-tertiary);
}

.no-selection h3 {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 2px;
}

.no-selection p {
  font-size: 0.8rem;
  margin: 0;
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