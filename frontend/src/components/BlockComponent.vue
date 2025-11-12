<template>
  <div 
    class="block-wrapper"
    :class="{
      active: isActive,
      'is-structural': block.isStructural,
      'has-children': hasChildren,
      'drag-over': isDragOver,
      'can-accept-drop': canAcceptDrop,
      [`type-${block.type}`]: true
    }"
    :style="blockStyles"
    @click.stop="handleClick"
    @drop="handleDrop"
    @dragover="handleDragOver"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <!-- Содержимое блока -->
    <div class="block-content">
      <!-- Header блок -->
      <div v-if="block.type === 'header'" class="header-content">
        <div class="header-inner">
          <div class="logo">ЛОГОТИП</div>
          <nav class="nav">
            <span>Главная</span>
            <span>О нас</span>
            <span>Контакты</span>
          </nav>
        </div>
        <div v-if="hasChildren" class="header-children">
          <BlockComponent 
            v-for="(child, index) in block.children" 
            :key="child.id"
            :block="child"
            :level="level + 1"
            :parent-id="block.id"
            :index="index"
            @block-click="$emit('block-click', $event)"
          />
        </div>
        <div v-else class="drop-zone-empty" :class="{ 'drag-over': isDragOver && canAcceptDrop }">
          Перетащите блоки сюда
        </div>
      </div>
      
      <!-- Hero блок -->
      <div v-else-if="block.type === 'hero'" class="hero-content">
        <h1>{{ block.content || 'Заголовок героя' }}</h1>
        <p>Описание hero секции</p>
        <div v-if="hasChildren" class="hero-children">
          <BlockComponent 
            v-for="(child, index) in block.children" 
            :key="child.id"
            :block="child"
            :level="level + 1"
            :parent-id="block.id"
            :index="index"
            @block-click="$emit('block-click', $event)"
          />
        </div>
        <div v-else class="drop-zone-empty" :class="{ 'drag-over': isDragOver && canAcceptDrop }">
          Перетащите блоки сюда
        </div>
      </div>
      
      <!-- Heading блок -->
      <div v-else-if="block.type === 'heading'" class="heading-content">
        <h2>{{ block.content || 'Заголовок раздела' }}</h2>
      </div>
      
      <!-- Paragraph блок -->
      <div v-else-if="block.type === 'paragraph'" class="paragraph-content">
        <p>{{ block.content || 'Текст параграфа...' }}</p>
      </div>
      
      <!-- Button блок -->
      <div v-else-if="block.type === 'button'" class="button-content">
        <button class="styled-button">{{ block.content || 'Нажмите меня' }}</button>
      </div>
      
      <!-- Image блок -->
      <div v-else-if="block.type === 'image'" class="image-content">
        <img 
          v-if="isValidImageUrl(block.content)" 
          :src="block.content" 
          alt="Image block" 
          @error="handleImageError"
        >
        <div v-else class="image-placeholder">
          <span>📷 Изображение</span>
        </div>
      </div>
      
      <!-- Text блок -->
      <div v-else-if="block.type === 'text'" class="text-content">
        <p>{{ block.content || 'Простой текст...' }}</p>
      </div>

      <!-- Container блок -->
      <div v-else-if="block.type === 'container'" class="container-content">
        <div class="container-inner">
          <div v-if="!hasChildren" class="empty-container drop-zone-empty" :class="{ 'drag-over': isDragOver && canAcceptDrop }">
            <span>📦 Контейнер</span>
            <small>Перетащите сюда блоки</small>
          </div>
          <BlockComponent 
            v-else
            v-for="(child, index) in block.children" 
            :key="child.id"
            :block="child"
            :level="level + 1"
            :parent-id="block.id"
            :index="index"
            @block-click="$emit('block-click', $event)"
          />
        </div>
      </div>

      <!-- Section блок -->
      <div v-else-if="block.type === 'section'" class="section-content">
        <div class="section-inner">
          <div v-if="!hasChildren" class="empty-section drop-zone-empty" :class="{ 'drag-over': isDragOver && canAcceptDrop }">
            <span>📄 Секция</span>
            <small>Перетащите сюда блоки</small>
          </div>
          <BlockComponent 
            v-else
            v-for="(child, index) in block.children" 
            :key="child.id"
            :block="child"
            :level="level + 1"
            :parent-id="block.id"
            :index="index"
            @block-click="$emit('block-click', $event)"
          />
        </div>
      </div>

      <!-- Body блок -->
      <div v-else-if="block.id === 'body'" class="body-content">
        <div class="body-inner">
          <div v-if="!hasChildren" class="empty-body drop-zone-empty" :class="{ 'drag-over': isDragOver && canAcceptDrop }">
            <span>📝 Основное содержимое</span>
            <small>Перетащите сюда блоки</small>
          </div>
          <BlockComponent 
            v-else
            v-for="(child, index) in block.children" 
            :key="child.id"
            :block="child"
            :level="level + 1"
            :parent-id="block.id"
            :index="index"
            @block-click="$emit('block-click', $event)"
          />
        </div>
      </div>

      <!-- Footer блок -->
      <div v-else-if="block.type === 'footer'" class="footer-content">
        <div class="footer-inner">
          <p>{{ block.content || '© 2024 Мой сайт. Все права защищены.' }}</p>
          <div v-if="hasChildren" class="footer-children">
            <BlockComponent 
              v-for="(child, index) in block.children" 
              :key="child.id"
              :block="child"
              :level="level + 1"
              :parent-id="block.id"
              :index="index"
              @block-click="$emit('block-click', $event)"
            />
          </div>
          <div v-else class="drop-zone-empty" :class="{ 'drag-over': isDragOver && canAcceptDrop }">
            Перетащите блоки сюда
          </div>
        </div>
      </div>

      <!-- Columns блок -->
      <div v-else-if="block.type === 'columns'" class="columns-content">
        <div class="columns-inner">
          <div 
            v-for="(child, index) in block.children" 
            :key="child.id"
            class="column"
          >
            <BlockComponent 
              :block="child"
              :level="level + 1"
              :parent-id="block.id"
              :index="index"
              @block-click="$emit('block-click', $event)"
            />
          </div>
          <div v-if="!hasChildren" class="empty-columns drop-zone-empty" :class="{ 'drag-over': isDragOver && canAcceptDrop }">
            <span>📊 Колонки</span>
            <small>Добавьте колонки</small>
          </div>
        </div>
      </div>

      <!-- Column блок -->
      <div v-else-if="block.type === 'column'" class="column-content">
        <div v-if="!hasChildren" class="empty-column drop-zone-empty" :class="{ 'drag-over': isDragOver && canAcceptDrop }">
          <span>📋 Колонка</span>
          <small>Перетащите блоки сюда</small>
        </div>
        <BlockComponent 
          v-else
          v-for="(child, index) in block.children" 
          :key="child.id"
          :block="child"
          :level="level + 1"
          :parent-id="block.id"
          :index="index"
          @block-click="$emit('block-click', $event)"
        />
      </div>

      <!-- Остальные блоки -->
      <div v-else class="generic-content">
        {{ block.content || block.name }}
      </div>
    </div>

    <!-- Контролы блока (только при активном состоянии) -->
    <div v-if="isActive" class="block-controls">
      <div class="controls-header">
        <span class="block-title">{{ block.name }}</span>
        <div class="controls-actions">
          <button @click.stop="handleDuplicate" class="control-btn" title="Дублировать">
            <!-- ИСПРАВЛЕНА ИКОНКА: Copy -->
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          <button 
            v-if="!block.isStructural"
            @click.stop="handleDelete" 
            class="control-btn delete" 
            title="Удалить"
          >
            <!-- ИСПРАВЛЕНА ИКОНКА: Trash2 -->
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
          <button 
            @click.stop="handleMoveUp" 
            class="control-btn" 
            title="Переместить вверх"
          >
            <!-- ИСПРАВЛЕНА ИКОНКА: ArrowUp -->
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m18 15-6-6-6 6"/>
            </svg>
          </button>
          <button 
            @click.stop="handleMoveDown" 
            class="control-btn" 
            title="Переместить вниз"
          >
            <!-- ИСПРАВЛЕНА ИКОНКА: ArrowDown -->
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Индикатор позиции перетаскивания -->
    <div v-if="isDragOver && canAcceptDrop" class="drop-indicator">
      <div class="drop-line"></div>
    </div>
  </div>
</template>

<script setup>
import { useEditorStore } from '../stores/editor';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  },
  parentId: {
    type: String,
    default: null
  },
  index: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['block-click', 'block-delete', 'block-duplicate']);

const editorStore = useEditorStore();
const { activeBlock } = storeToRefs(editorStore);
const { moveBlock, duplicateBlock: duplicateStoreBlock, deleteBlock, moveBlockTo, setActiveBlock, canHaveChildren } = editorStore;

const isActive = computed(() => activeBlock.value?.id === props.block.id);
const hasChildren = computed(() => props.block.children && props.block.children.length > 0);
const isDragOver = ref(false);
const dragCounter = ref(0);

const canAcceptDrop = computed(() => {
  return canHaveChildren(props.block.type);
});

const blockStyles = computed(() => {
  const styles = { ...props.block.styles };
  
  // Для фонового изображения
  if (styles.backgroundImage && styles.backgroundImage !== 'none') {
    styles.backgroundSize = styles.backgroundSize || 'cover';
    styles.backgroundPosition = styles.backgroundPosition || 'center';
    styles.backgroundRepeat = 'no-repeat';
  }
  
  return styles;
});

const isValidImageUrl = (url) => {
  if (!url || url === 'none') return false;
  return url.startsWith('http') || url.startsWith('data:image');
};

const handleClick = () => {
  emit('block-click', props.block.id);
};

const handleDelete = () => {
  emit('block-delete', props.block.id);
};

const handleDuplicate = () => {
  emit('block-duplicate', props.block.id);
};

const handleMoveUp = () => {
  moveBlock(props.block.id, 'up');
};

const handleMoveDown = () => {
  moveBlock(props.block.id, 'down');
};

const handleImageError = (event) => {
  event.target.style.display = 'none';
};

// Улучшенная логика перетаскивания
const handleDragStart = (event) => {
  event.dataTransfer.setData('application/json', JSON.stringify({
    type: 'block-move',
    blockId: props.block.id,
    parentId: props.parentId,
    index: props.index
  }));
  event.dataTransfer.effectAllowed = 'move';
  
  // Добавляем визуальный эффект перетаскивания
  setTimeout(() => {
    event.target.classList.add('dragging');
  }, 0);
};

const handleDragEnd = (event) => {
  event.target.classList.remove('dragging');
  isDragOver.value = false;
  dragCounter.value = 0;
};

const handleDragOver = (event) => {
  if (canAcceptDrop.value) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
    // Показываем индикатор, куда будет вставлен блок
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeY = event.clientY - rect.top;
    const isNearTop = relativeY < rect.height * 0.3;
    const isNearBottom = relativeY > rect.height * 0.7;
    
    event.currentTarget.classList.toggle('drop-top', isNearTop);
    event.currentTarget.classList.toggle('drop-bottom', isNearBottom);
    event.currentTarget.classList.toggle('drop-middle', !isNearTop && !isNearBottom);
  }
};

const handleDragEnter = (event) => {
  if (canAcceptDrop.value) {
    event.preventDefault();
    dragCounter.value++;
    isDragOver.value = true;
  }
};

const handleDragLeave = (event) => {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    dragCounter.value--;
    if (dragCounter.value <= 0) {
      isDragOver.value = false;
      dragCounter.value = 0;
      // Убираем индикаторы позиции
      event.currentTarget.classList.remove('drop-top', 'drop-bottom', 'drop-middle');
    }
  }
};

const handleDrop = (event) => {
  event.preventDefault();
  event.stopPropagation();
  
  // Убираем индикаторы позиции
  event.currentTarget.classList.remove('drop-top', 'drop-bottom', 'drop-middle');
  
  isDragOver.value = false;
  dragCounter.value = 0;
  
  try {
    const dragData = JSON.parse(event.dataTransfer.getData('application/json'));
    
    if (dragData.type === 'block-move') {
      // Определяем позицию вставки на основе положения курсора
      const rect = event.currentTarget.getBoundingClientRect();
      const relativeY = event.clientY - rect.top;
      let insertPosition = 0;
      
      if (props.block.children) {
        if (relativeY < rect.height * 0.3) {
          // Вставка в начало
          insertPosition = 0;
        } else if (relativeY > rect.height * 0.7) {
          // Вставка в конец
          insertPosition = props.block.children.length;
        } else {
          // Вставка в середину (между существующими блоками)
          insertPosition = Math.floor(props.block.children.length / 2);
        }
      }
      
      // Перемещаем блок
      const success = moveBlockTo(
        dragData.blockId,
        props.block.id,
        insertPosition
      );
      
      if (success) {
        setActiveBlock(dragData.blockId);
      }
    } else if (dragData.type === 'block-library') {
      // Добавляем новый блок из библиотеки
      editorStore.addBlock(dragData.blockType, props.block.id);
    }
  } catch (error) {
    console.error('Ошибка при обработке перетаскивания:', error);
  }
};
</script>

<style scoped>
.block-wrapper {
  position: relative;
  margin: 2px 0;
  border: 2px solid transparent;
  border-radius: 4px;
  transition: all 0.2s ease;
  cursor: pointer;
  background: var(--bg-secondary);
  min-height: 60px;
}

.block-wrapper:hover {
  border-color: var(--border-color);
}

.block-wrapper.active {
  border-color: #4dabf7;
  box-shadow: 0 0 0 1px rgba(74, 144, 226, 0.3);
}

.block-wrapper.is-structural {
  border-left: 3px solid #3b1fa1;
}

/* Стили для перетаскивания */
.block-wrapper.dragging {
  opacity: 0.5;
  transform: scale(0.95);
}

.block-wrapper.drag-over {
  border-color: #4dabf7;
  background: rgba(77, 171, 247, 0.05);
}

.block-wrapper.can-accept-drop.drag-over {
  border-style: dashed;
  border-color: #4dabf7;
}

/* Индикаторы позиции при перетаскивании */
.block-wrapper.drop-top::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #4dabf7;
  z-index: 10;
}

.block-wrapper.drop-bottom::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #4dabf7;
  z-index: 10;
}

.block-wrapper.drop-middle {
  border: 2px dashed #4dabf7;
  background: rgba(77, 171, 247, 0.1);
}

.drop-zone-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text-tertiary);
  text-align: center;
  border: 2px dashed var(--border-color);
  border-radius: 6px;
  min-height: 80px;
  transition: all 0.2s ease;
  margin: 10px;
}

.drop-zone-empty.drag-over {
  border-color: #4dabf7;
  background: rgba(77, 171, 247, 0.1);
  color: #4dabf7;
}

.drop-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 5;
}

.drop-line {
  position: absolute;
  top: 50%;
  left: 10px;
  right: 10px;
  height: 2px;
  background: #4dabf7;
  transform: translateY(-50%);
}

.block-content {
  min-height: 60px;
  padding: 15px;
}

/* Header */
.header-content {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  min-height: 60px;
}

.logo {
  font-weight: bold;
  font-size: 1.2rem;
  color: var(--text-primary);
}

.nav {
  display: flex;
  gap: 30px;
}

.nav span {
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s;
}

.nav span:hover {
  color: #3b1fa1;
}

.header-children {
  padding: 20px;
}

/* Hero */
.hero-content {
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-children {
  margin-top: 2rem;
}

/* Body */
.body-content {
  background: transparent;
}

.body-inner {
  min-height: 400px;
}

.empty-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--text-tertiary);
  text-align: center;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  min-height: 200px;
}

/* Footer */
.footer-content {
  background: #2c3e50;
  color: white;
}

.footer-inner {
  padding: 40px 20px;
  text-align: center;
}

/* Контейнеры */
.container-content,
.section-content {
  background: transparent;
}

.empty-container,
.empty-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  color: var(--text-tertiary);
  text-align: center;
  border: 2px dashed var(--border-color);
  border-radius: 6px;
  min-height: 150px;
}

/* Колонки */
.columns-content {
  background: transparent;
}

.columns-inner {
  display: flex;
  gap: 20px;
  min-height: 200px;
}

.column {
  flex: 1;
  background: transparent;
  min-height: 150px;
}

.empty-columns {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 3rem 2rem;
  color: var(--text-tertiary);
  text-align: center;
  border: 2px dashed var(--border-color);
  border-radius: 6px;
}

.empty-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text-tertiary);
  border: 2px dashed var(--border-color);
  border-radius: 6px;
  min-height: 100px;
}

/* Элементы */
.heading-content h2 {
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
}

.paragraph-content p {
  margin: 0;
  line-height: 1.6;
  color: var(--text-secondary);
}

.button-content {
  text-align: center;
}

.styled-button {
  padding: 12px 24px;
  background: #3b1fa1;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.styled-button:hover {
  background: #4dabf7;
  transform: translateY(-1px);
}

.image-content {
  text-align: center;
}

.image-content img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 4px;
}

.image-placeholder {
  padding: 3rem;
  background: var(--bg-tertiary);
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  color: var(--text-tertiary);
  text-align: center;
}

.text-content p {
  margin: 0;
  line-height: 1.6;
  color: var(--text-primary);
}

.generic-content {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Контролы */
.block-controls {
  position: absolute;
  top: -35px;
  left: 0;
  right: 0;
  background: #4dabf7;
  color: white;
  padding: 8px 12px;
  border-radius: 6px 6px 0 0;
  font-size: 0.8rem;
  z-index: 10;
}

.controls-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.block-title {
  font-weight: 500;
}

.controls-actions {
  display: flex;
  gap: 4px;
}

.control-btn {
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  transition: all 0.2s;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.control-btn.delete:hover {
  background: #dc3545;
}

.control-btn svg {
  width: 14px;
  height: 14px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .header-inner {
    flex-direction: column;
    gap: 15px;
    padding: 20px;
  }

  .nav {
    gap: 15px;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .columns-inner {
    flex-direction: column;
  }

  .block-content {
    padding: 10px;
  }
}
</style>