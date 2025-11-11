<template>
  <div 
    class="block-wrapper"
    :class="{
      active: isActive,
      'is-structural': block.isStructural,
      'has-children': hasChildren,
      [`type-${block.type}`]: true
    }"
    :style="blockStyles"
    @click.stop="handleClick"
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
            v-for="child in block.children" 
            :key="child.id"
            :block="child"
            :level="level + 1"
            @block-click="$emit('block-click', $event)"
          />
        </div>
      </div>
      
      <!-- Hero блок -->
      <div v-else-if="block.type === 'hero'" class="hero-content">
        <h1>{{ block.content || 'Заголовок героя' }}</h1>
        <p>Описание hero секции</p>
        <div v-if="hasChildren" class="hero-children">
          <BlockComponent 
            v-for="child in block.children" 
            :key="child.id"
            :block="child"
            :level="level + 1"
            @block-click="$emit('block-click', $event)"
          />
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
          <div v-if="!hasChildren" class="empty-container">
            <span>📦 Контейнер</span>
            <small>Перетащите сюда блоки</small>
          </div>
          <BlockComponent 
            v-else
            v-for="child in block.children" 
            :key="child.id"
            :block="child"
            :level="level + 1"
            @block-click="$emit('block-click', $event)"
          />
        </div>
      </div>

      <!-- Section блок -->
      <div v-else-if="block.type === 'section'" class="section-content">
        <div class="section-inner">
          <div v-if="!hasChildren" class="empty-section">
            <span>📄 Секция</span>
            <small>Перетащите сюда блоки</small>
          </div>
          <BlockComponent 
            v-else
            v-for="child in block.children" 
            :key="child.id"
            :block="child"
            :level="level + 1"
            @block-click="$emit('block-click', $event)"
          />
        </div>
      </div>

      <!-- Body блок -->
      <div v-else-if="block.id === 'body'" class="body-content">
        <div class="body-inner">
          <div v-if="!hasChildren" class="empty-body">
            <span>📝 Основное содержимое</span>
            <small>Перетащите сюда блоки</small>
          </div>
          <BlockComponent 
            v-else
            v-for="child in block.children" 
            :key="child.id"
            :block="child"
            :level="level + 1"
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
              v-for="child in block.children" 
              :key="child.id"
              :block="child"
              :level="level + 1"
              @block-click="$emit('block-click', $event)"
            />
          </div>
        </div>
      </div>

      <!-- Columns блок -->
      <div v-else-if="block.type === 'columns'" class="columns-content">
        <div class="columns-inner">
          <div v-for="child in block.children" 
            :key="child.id"
            class="column"
          >
            <BlockComponent 
              :block="child"
              :level="level + 1"
              @block-click="$emit('block-click', $event)"
            />
          </div>
          <div v-if="!hasChildren" class="empty-columns">
            <span>📊 Колонки</span>
            <small>Добавьте колонки</small>
          </div>
        </div>
      </div>

      <!-- Column блок -->
      <div v-else-if="block.type === 'column'" class="column-content">
        <div v-if="!hasChildren" class="empty-column">
          <span>📋 Колонка</span>
        </div>
        <BlockComponent 
          v-else
          v-for="child in block.children" 
          :key="child.id"
          :block="child"
          :level="level + 1"
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
            📋
          </button>
          <button 
            v-if="!block.isStructural"
            @click.stop="handleDelete" 
            class="control-btn delete" 
            title="Удалить"
          >
            🗑️
          </button>
          <button 
            @click.stop="handleMoveUp" 
            class="control-btn" 
            title="Переместить вверх"
          >
            ↑
          </button>
          <button 
            @click.stop="handleMoveDown" 
            class="control-btn" 
            title="Переместить вниз"
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useEditorStore } from '../stores/editor';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['block-click', 'block-delete', 'block-duplicate']);

const editorStore = useEditorStore();
const { activeBlock } = storeToRefs(editorStore);
const { moveBlock, duplicateBlock: duplicateStoreBlock, deleteBlock } = editorStore;

const isActive = computed(() => activeBlock.value?.id === props.block.id);
const hasChildren = computed(() => props.block.children && props.block.children.length > 0);

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

.block-content {
  min-height: 60px;
  padding: 15px;
}

/* Header */
.header-content {
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
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
  color: #333;
}

.nav {
  display: flex;
  gap: 30px;
}

.nav span {
  color: #666;
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
}

.paragraph-content p {
  margin: 0;
  line-height: 1.6;
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