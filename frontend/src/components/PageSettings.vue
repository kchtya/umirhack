<template>
  <div class="page-settings">
    <h3>НАСТРОЙКИ СТРАНИЦЫ</h3>
    
    <div class="settings-section">
      <label>Заголовок страницы:</label>
      <input 
        v-model="pageTitle"
        @input="updatePageTitle"
        placeholder="Название сайта"
        class="settings-input"
      >
    </div>

    <div class="settings-section">
      <label>Фон страницы:</label>
      
      <div class="style-control">
        <span>Цвет фона:</span>
        <input 
          type="color" 
          v-model="pageBackgroundColor"
          @change="updatePageBackground"
          class="color-input"
        >
        <span class="color-value">{{ pageBackgroundColor }}</span>
      </div>

      <div class="style-control">
        <span>Фоновое изображение:</span>
        <input 
          type="text" 
          v-model="pageBackgroundImage"
          @input="updatePageBackground"
          placeholder="https://example.com/image.jpg"
          class="settings-input"
        >
      </div>

      <div class="style-control" v-if="pageBackgroundImage">
        <span>Размер фона:</span>
        <select v-model="pageBackgroundSize" @change="updatePageBackground" class="settings-select">
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="auto">Auto</option>
        </select>
      </div>

      <div class="style-control" v-if="pageBackgroundImage">
        <span>Позиция фона:</span>
        <select v-model="pageBackgroundPosition" @change="updatePageBackground" class="settings-select">
          <option value="center">Center</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>

    <div class="settings-section">
      <label>Предпросмотр:</label>
      <div class="preview-section">
        <button @click="togglePreview" class="preview-btn">
          {{ showPreview ? 'Скрыть предпросмотр' : 'Показать предпросмотр' }}
        </button>
        
        <div v-if="showPreview" class="preview-container">
          <div class="preview-window">
            <div class="preview-header">
              <div class="preview-url">mysite.com</div>
              <div class="preview-controls">
                <span>●</span>
                <span>●</span>
                <span>●</span>
              </div>
            </div>
            <div class="preview-content" :style="previewStyles">
              <!-- Рендерим блоки как в реальном сайте -->
              <div v-for="block in blocks" :key="block.id" class="preview-block" :style="block.styles">
                <!-- Header -->
                <div v-if="block.type === 'header'" class="preview-header-block">
                  <div class="preview-header-inner">
                    <div class="preview-logo">ЛОГОТИП</div>
                    <nav class="preview-nav">
                      <span>Главная</span>
                      <span>О нас</span>
                      <span>Контакты</span>
                    </nav>
                  </div>
                </div>

                <!-- Hero -->
                <div v-else-if="block.type === 'hero'" class="preview-hero">
                  <h1>{{ block.content || 'Заголовок героя' }}</h1>
                  <p>Описание hero секции</p>
                </div>

                <!-- Heading -->
                <div v-else-if="block.type === 'heading'" class="preview-heading">
                  <h2>{{ block.content || 'Заголовок раздела' }}</h2>
                </div>

                <!-- Paragraph -->
                <div v-else-if="block.type === 'paragraph'" class="preview-paragraph">
                  <p>{{ block.content || 'Текст параграфа...' }}</p>
                </div>

                <!-- Button -->
                <div v-else-if="block.type === 'button'" class="preview-button">
                  <button class="preview-btn-element">{{ block.content || 'Нажмите меня' }}</button>
                </div>

                <!-- Image -->
                <div v-else-if="block.type === 'image'" class="preview-image">
                  <img 
                    v-if="isValidImageUrl(block.content)" 
                    :src="block.content" 
                    alt="Preview"
                    @error="handleImageError"
                  >
                  <div v-else class="preview-image-placeholder">
                    📷 Изображение
                  </div>
                </div>

                <!-- Text -->
                <div v-else-if="block.type === 'text'" class="preview-text">
                  <p>{{ block.content || 'Простой текст...' }}</p>
                </div>

                <!-- Container/Section -->
                <div v-else-if="block.type === 'container' || block.type === 'section'" class="preview-container-block">
                  <div class="preview-container-inner">
                    <div v-if="!block.children || block.children.length === 0" class="preview-empty">
                      Содержимое
                    </div>
                    <div v-else class="preview-children">
                      <div v-for="child in block.children" :key="child.id" class="preview-child" :style="child.styles">
                        {{ child.content || child.name }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Body -->
                <div v-else-if="block.id === 'body'" class="preview-body">
                  <div class="preview-body-inner">
                    <div v-if="!block.children || block.children.length === 0" class="preview-empty-body">
                      Основное содержимое страницы
                    </div>
                    <div v-else class="preview-body-children">
                      <div v-for="child in block.children" :key="child.id" class="preview-body-child" :style="child.styles">
                        {{ child.content || child.name }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <div v-else-if="block.type === 'footer'" class="preview-footer">
                  <div class="preview-footer-inner">
                    <p>{{ block.content || '© 2024 Мой сайт. Все права защищены.' }}</p>
                  </div>
                </div>

                <!-- Generic -->
                <div v-else class="preview-generic">
                  {{ block.content || block.name }}
                </div>
              </div>

              <!-- Если нет блоков -->
              <div v-if="blocks.length === 0" class="preview-empty-state">
                <h3>Пустая страница</h3>
                <p>Добавьте блоки в конструкторе</p>
              </div>
            </div>
          </div>
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
const { pageSettings, blocks } = storeToRefs(editorStore);
const { updatePageSettings } = editorStore;

const pageTitle = ref('Мой сайт');
const pageBackgroundColor = ref('#ffffff');
const pageBackgroundImage = ref('');
const pageBackgroundSize = ref('cover');
const pageBackgroundPosition = ref('center');
const showPreview = ref(false);

const previewStyles = computed(() => {
  const styles = {
    backgroundColor: pageBackgroundColor.value,
    minHeight: '400px'
  };

  if (pageBackgroundImage.value) {
    styles.backgroundImage = `url(${pageBackgroundImage.value})`;
    styles.backgroundSize = pageBackgroundSize.value;
    styles.backgroundPosition = pageBackgroundPosition.value;
    styles.backgroundRepeat = 'no-repeat';
  }

  return styles;
});

// Инициализация значений
watch(pageSettings, (newSettings) => {
  pageTitle.value = newSettings.title || 'Мой сайт';
  pageBackgroundColor.value = newSettings.backgroundColor || '#ffffff';
  pageBackgroundImage.value = newSettings.backgroundImage || '';
  pageBackgroundSize.value = newSettings.backgroundSize || 'cover';
  pageBackgroundPosition.value = newSettings.backgroundPosition || 'center';
}, { immediate: true });

const updatePageTitle = () => {
  updatePageSettings({ title: pageTitle.value });
};

const updatePageBackground = () => {
  updatePageSettings({
    backgroundColor: pageBackgroundColor.value,
    backgroundImage: pageBackgroundImage.value,
    backgroundSize: pageBackgroundSize.value,
    backgroundPosition: pageBackgroundPosition.value
  });
};

const togglePreview = () => {
  showPreview.value = !showPreview.value;
};

const isValidImageUrl = (url) => {
  if (!url) return false;
  return url.startsWith('http') || url.startsWith('data:image');
};

const handleImageError = (event) => {
  event.target.style.display = 'none';
};
</script>

<style scoped>
.page-settings {
  padding: 1.5rem;
  background: var(--bg-tertiary);
  min-height: 100%;
  overflow-y: auto;
}

.page-settings h3 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 2px;
  opacity: 0.8;
  text-transform: uppercase;
}

.settings-section {
  margin-bottom: 2rem;
}

.settings-section label {
  display: block;
  margin-bottom: 0.8rem;
  font-weight: 300;
  color: var(--text-secondary);
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.settings-input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.9rem;
  font-family: inherit;
}

.settings-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.settings-select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.9rem;
  font-family: inherit;
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

.preview-btn {
  width: 100%;
  padding: 1rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.preview-btn:hover {
  background: #4dabf7;
  transform: translateY(-1px);
}

.preview-container {
  margin-top: 1rem;
}

.preview-window {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-header {
  background: #f5f5f5;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}

.preview-url {
  font-size: 0.7rem;
  color: #666;
}

.preview-controls {
  display: flex;
  gap: 4px;
}

.preview-controls span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
}

.preview-content {
  min-height: 400px;
  padding: 0;
}

/* Preview block styles */
.preview-block {
  border-bottom: 1px solid #f0f0f0;
}

.preview-header-block {
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.preview-header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
}

.preview-logo {
  font-weight: bold;
  color: #333;
}

.preview-nav {
  display: flex;
  gap: 20px;
}

.preview-nav span {
  color: #666;
  font-size: 0.9rem;
}

.preview-hero {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.preview-hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.preview-heading {
  padding: 30px 20px;
}

.preview-heading h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
}

.preview-paragraph {
  padding: 20px;
}

.preview-paragraph p {
  margin: 0;
  line-height: 1.6;
  color: #666;
}

.preview-button {
  padding: 20px;
  text-align: center;
}

.preview-btn-element {
  padding: 12px 24px;
  background: #3b1fa1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.preview-image {
  padding: 20px;
  text-align: center;
}

.preview-image img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
}

.preview-image-placeholder {
  padding: 40px;
  background: #f5f5f5;
  border: 2px dashed #ddd;
  border-radius: 4px;
  color: #999;
  text-align: center;
}

.preview-text {
  padding: 15px 20px;
}

.preview-text p {
  margin: 0;
  color: #333;
}

.preview-container-block {
  padding: 20px;
}

.preview-container-inner {
  border: 1px dashed #ddd;
  border-radius: 4px;
  min-height: 100px;
  padding: 20px;
}

.preview-empty {
  color: #999;
  text-align: center;
  padding: 30px;
}

.preview-children {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview-child {
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #eee;
}

.preview-body {
  padding: 30px 20px;
}

.preview-body-inner {
  min-height: 200px;
}

.preview-empty-body {
  color: #999;
  text-align: center;
  padding: 60px 20px;
  border: 2px dashed #eee;
  border-radius: 4px;
}

.preview-body-children {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.preview-body-child {
  padding: 15px;
  background: white;
  border: 1px solid #eee;
  border-radius: 4px;
}

.preview-footer {
  background: #2c3e50;
  color: white;
  padding: 30px 20px;
}

.preview-footer-inner {
  text-align: center;
}

.preview-footer p {
  margin: 0;
  color: #ccc;
}

.preview-generic {
  padding: 15px 20px;
  background: #f9f9f9;
  color: #666;
}

.preview-empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
}

.preview-empty-state h3 {
  margin-bottom: 10px;
  color: #666;
}

.page-settings::-webkit-scrollbar {
  width: 6px;
}

.page-settings::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
}

.page-settings::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 3px;
}

.page-settings::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}
</style>