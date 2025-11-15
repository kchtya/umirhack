<template>
  <div class="editor-view" :class="themeClass">
    <header class="header" v-if="!fullscreenPreview">
      <nav class="nav">
        <div class="logo-section">
          <div class="logo-image" @click="goToHome">
            <img src="@/assets/images/logo.svg" alt="Digitalize" class="logo-svg">
          </div>
        </div>
        
        <div class="nav-center">
          <div class="nav-menu">
            <span class="nav-item current-page">Конструктор</span>
            <span @click="goToTemplates" class="nav-item">Шаблоны</span>
            <span @click="handleExport" class="nav-item">Экспорт</span>
          </div>
        </div>
        
        <div class="nav-right">
          <div class="auth-buttons">
            <div class="guest-buttons">
              <button class="auth-btn login-btn" @click="goToLogin">Войти</button>
              <button class="auth-btn register-btn" @click="goToRegister">Регистрация</button>
            </div>
          </div>
          <button class="theme-toggle" @click="toggleTheme">
            <span class="theme-icon">{{ isDark ? '☀️' : '🌙' }}</span>
          </button>
        </div>
      </nav>
    </header>
    
    <main class="main-content" v-if="!fullscreenPreview">
      <div class="editor-layout">
        <!-- Левая панель: Библиотека блоков -->
        <div class="left-panel">
          <BlockLibrary />
        </div>
        
        <!-- Центральная область: Холст -->
        <div 
          class="center-panel"
          @drop="handleDropFromLibrary"
          @dragover="handleDragOver"
          @dragenter="handleDragEnter"
          @dragleave="handleDragLeave"
          @click="clearSelection"
          :class="{ 'drag-over': isDragOver }"
        >
          <div class="canvas">
            <div class="canvas-header">
              <h3>РЕДАКТОР САЙТА</h3>
              <div class="canvas-stats">
                <div class="stat">
                  <span class="stat-number">{{ blocksCount }}</span>
                  <span class="stat-label">БЛОКОВ</span>
                </div>
                <button @click="toggleFullscreenPreview" class="preview-fullscreen-btn" title="Полноэкранный предпросмотр">
                  <Maximize2 :size="16" />
                  Полный экран
                </button>
                <button @click="clearAllBlocks" class="clear-btn" title="Очистить все блоки">
                  <Trash2 :size="16" />
                </button>
              </div>
            </div>
            
            <!-- Пустое состояние -->
            <div v-if="blocksCount === 0" class="empty-state">
              <div class="empty-icon">
                <Download :size="48" />
              </div>
              <p>ПЕРЕТАЩИТЕ БЛОКИ ДЛЯ НАЧАЛА РАБОТЫ</p>
              <p class="empty-hint">Начните с контейнера или секции</p>
              <button @click="initializeStructuralBlocks" class="btn-primary adaptive-btn">
                Создать базовую структуру
              </button>
            </div>
            
            <!-- Блоки на холсте -->
            <div class="blocks-container">
              <BlockComponent 
                v-for="(block, index) in blocks" 
                :key="block.id"
                :block="block"
                :level="0"
                :index="index"
                @block-click="setActiveBlock"
                @block-delete="deleteBlock"
                @block-duplicate="duplicateBlock"
              />
            </div>
          </div>
        </div>
        
        <!-- Правая панель: Редактор и инструменты -->
        <div class="right-panel">
          <div class="right-panel-content">
            <PageSettings v-if="!activeBlock" @fullscreen-preview="toggleFullscreenPreview" />
            <Toolbar v-else />
          </div>
        </div>
      </div>
    </main>

    <!-- Полноэкранный предпросмотр -->
    <div v-if="fullscreenPreview" class="fullscreen-preview">
      <div class="preview-header">
        <button @click="toggleFullscreenPreview" class="close-preview-btn">
          <X :size="16" />
          Закрыть предпросмотр
        </button>
        <div class="preview-info">
          Предпросмотр сайта - <span class="preview-url">mysite.com</span>
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
              <Image :size="24" />
              Изображение
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

    <AppFooter v-if="!fullscreenPreview" />
  </div>
</template>

<script>
import { useEditorStore } from '../stores/editor';
import { useThemeStore } from '../stores/theme';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import BlockLibrary from '../components/BlockLibrary.vue';
import Toolbar from '../components/Toolbar.vue';
import PageSettings from '../components/PageSettings.vue';
import AppFooter from '../components/AppFooter.vue';
import BlockComponent from '../components/BlockComponent.vue';

// Иконки Lucide
import { 
  Download,
  Maximize2,
  Trash2,
  X,
  Image
} from 'lucide-vue-next';

export default {
  name: 'EditorView',
  components: {
    BlockLibrary,
    Toolbar,
    PageSettings,
    AppFooter,
    BlockComponent,
    Download,
    Maximize2,
    Trash2,
    X,
    Image
  },
  setup() {
    const editorStore = useEditorStore();
    const themeStore = useThemeStore();
    const router = useRouter();
    
    const { blocks, activeBlock, blocksCount, pageSettings } = storeToRefs(editorStore);
    const { isDark } = storeToRefs(themeStore);
    const { 
      addBlock, 
      setActiveBlock, 
      deleteBlock, 
      duplicateBlock, 
      initializeStructuralBlocks,
      clearAllBlocks 
    } = editorStore;

    const themeClass = computed(() => isDark.value ? 'theme-dark' : 'theme-light');
    const fullscreenPreview = ref(false);
    const isDragOver = ref(false);

    const previewStyles = computed(() => {
      const styles = {
        backgroundColor: pageSettings.value.backgroundColor || '#ffffff',
        minHeight: '100vh'
      };

      if (pageSettings.value.backgroundImage && pageSettings.value.backgroundImage !== '') {
        styles.backgroundImage = `url(${pageSettings.value.backgroundImage})`;
        styles.backgroundSize = pageSettings.value.backgroundSize || 'cover';
        styles.backgroundPosition = pageSettings.value.backgroundPosition || 'center';
        styles.backgroundRepeat = 'no-repeat';
      }

      return styles;
    });

    const handleDragOver = (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    };

    const handleDragEnter = (event) => {
      event.preventDefault();
      isDragOver.value = true;
    };

    const handleDragLeave = (event) => {
      event.preventDefault();
      if (!event.currentTarget.contains(event.relatedTarget)) {
        isDragOver.value = false;
      }
    };

    const handleDropFromLibrary = (event) => {
      event.preventDefault();
      isDragOver.value = false;
      
      try {
        const blockData = JSON.parse(event.dataTransfer.getData('application/json'));
        console.log('Dropped block from library:', blockData);
        
        if (blockData.type === 'block-library') {
          addBlock(blockData.blockType);
        }
      } catch (error) {
        console.error('Ошибка при добавлении блока:', error);
      }
    };

    const clearSelection = () => {
      setActiveBlock(null);
    };

    const handleExport = () => {
      // Функция для генерации HTML
      const generateHTML = (blocks, pageSettings) => {
        const styles = generateCSS(blocks, pageSettings);
        const htmlStructure = generateHTMLStructure(blocks);
        
        return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageSettings.title || 'Мой сайт'}</title>
    <style>
${styles}
    </style>
</head>
<body>
${htmlStructure}
</body>
</html>`;
      };

      // Функция для генерации CSS
      const generateCSS = (blocks, pageSettings) => {
        let css = `
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  background-color: ${pageSettings.backgroundColor || '#ffffff'};
  ${pageSettings.backgroundImage && pageSettings.backgroundImage !== '' 
    ? `background-image: url('${pageSettings.backgroundImage}');
  background-size: ${pageSettings.backgroundSize || 'cover'};
  background-position: ${pageSettings.backgroundPosition || 'center'};
  background-repeat: no-repeat;` 
    : ''}
}

/* Block styles */
${generateBlockCSS(blocks)}
`;

        return css;
      };

      const generateBlockCSS = (blocks) => {
        let css = '';
        
        blocks.forEach(block => {
          const blockId = `block-${block.id}`;
          const styles = block.styles || {};
          
          // Генерируем CSS для текущего блока
          css += `
.${blockId} {
  ${styles.backgroundColor ? `background-color: ${styles.backgroundColor};` : ''}
  ${styles.backgroundImage && styles.backgroundImage !== 'none' ? `background-image: ${styles.backgroundImage};` : ''}
  ${styles.backgroundSize ? `background-size: ${styles.backgroundSize};` : ''}
  ${styles.backgroundPosition ? `background-position: ${styles.backgroundPosition};` : ''}
  ${styles.color ? `color: ${styles.color};` : ''}
  ${styles.fontSize ? `font-size: ${styles.fontSize};` : ''}
  ${styles.fontFamily && styles.fontFamily !== 'inherit' ? `font-family: ${styles.fontFamily};` : ''}
  ${styles.textAlign ? `text-align: ${styles.textAlign};` : ''}
  ${styles.fontWeight ? `font-weight: ${styles.fontWeight};` : ''}
  ${styles.padding ? `padding: ${styles.padding};` : ''}
  ${styles.margin ? `margin: ${styles.margin};` : ''}
  ${styles.borderRadius ? `border-radius: ${styles.borderRadius};` : ''}
  ${styles.border && styles.border !== 'none' ? `border: ${styles.border};` : ''}
  ${styles.width ? `width: ${styles.width};` : ''}
  ${styles.minHeight ? `min-height: ${styles.minHeight};` : ''}
  ${styles.display ? `display: ${styles.display};` : ''}
  ${styles.opacity ? `opacity: ${styles.opacity};` : ''}
  ${styles.maxWidth ? `max-width: ${styles.maxWidth};` : ''}
  ${styles.lineHeight ? `line-height: ${styles.lineHeight};` : ''}
}`;

          // Специфичные стили для типов блоков
          switch (block.type) {
            case 'header':
              css += `
.${blockId} .header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  min-height: 60px;
}

.${blockId} .logo {
  font-weight: bold;
  font-size: 1.2rem;
}

.${blockId} .nav {
  display: flex;
  gap: 30px;
}

.${blockId} .nav span {
  cursor: pointer;
  transition: color 0.2s;
}

.${blockId} .nav span:hover {
  color: #3b1fa1;
}`;
              break;
              
            case 'hero':
              css += `
.${blockId} {
  text-align: center;
  padding: 80px 20px;
}

.${blockId} h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.${blockId} p {
  font-size: 1.2rem;
  opacity: 0.9;
}`;
              break;
              
            case 'button':
              css += `
.${blockId} .styled-button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-block;
}

.${blockId} .styled-button:hover {
  transform: translateY(-1px);
}`;
              break;
              
            case 'columns':
              css += `
.${blockId} .columns-inner {
  display: flex;
  gap: 20px;
}

@media (max-width: 768px) {
  .${blockId} .columns-inner {
    flex-direction: column;
  }
}`;
              break;
              
            case 'column':
              css += `
.${blockId} {
  flex: 1;
}`;
              break;
              
            case 'image':
              css += `
.${blockId} img {
  max-width: 100%;
  height: auto;
  display: block;
}`;
              break;
          }

          // Рекурсивно генерируем CSS для дочерних блоков
          if (block.children && block.children.length > 0) {
            css += generateBlockCSS(block.children);
          }
        });
        
        return css;
      };

      const generateHTMLStructure = (blocks) => {
        let html = '';
        
        blocks.forEach(block => {
          html += generateBlockHTML(block);
        });
        
        return html;
      };

      const generateBlockHTML = (block) => {
        const blockId = `block-${block.id}`;
        let html = '';
        
        switch (block.type) {
          case 'header':
            html = `
<div class="${blockId}">
  <div class="header-inner">
    <div class="logo">ЛОГОТИП</div>
    <nav class="nav">
      <span>Главная</span>
      <span>О нас</span>
      <span>Контакты</span>
    </nav>
  </div>
  ${block.children && block.children.length > 0 ? generateChildrenHTML(block.children) : '<div class="empty-drop-zone"></div>'}
</div>`;
            break;
            
          case 'hero':
            html = `
<div class="${blockId}">
  <h1>${block.content || 'Заголовок героя'}</h1>
  <p>Описание hero секции</p>
  ${block.children && block.children.length > 0 ? generateChildrenHTML(block.children) : '<div class="empty-drop-zone"></div>'}
</div>`;
            break;
            
          case 'heading':
            html = `
<div class="${blockId}">
  <h2>${block.content || 'Заголовок раздела'}</h2>
</div>`;
            break;
            
          case 'paragraph':
            html = `
<div class="${blockId}">
  <p>${block.content || 'Текст параграфа...'}</p>
</div>`;
            break;
            
          case 'button':
            html = `
<div class="${blockId}">
  <button class="styled-button">${block.content || 'Нажмите меня'}</button>
</div>`;
            break;
            
          case 'image':
            const imageContent = block.content && block.content.startsWith('http') 
              ? `<img src="${block.content}" alt="Изображение" onerror="this.style.display='none'">`
              : '<div class="image-placeholder">📷 Изображение</div>';
            html = `
<div class="${blockId}">
  ${imageContent}
</div>`;
            break;
            
          case 'text':
            html = `
<div class="${blockId}">
  <p>${block.content || 'Простой текст...'}</p>
</div>`;
            break;
            
          case 'container':
            html = `
<div class="${blockId}">
  <div class="container-inner">
    ${block.children && block.children.length > 0 ? generateChildrenHTML(block.children) : '<div class="empty-drop-zone">📦 Контейнер</div>'}
  </div>
</div>`;
            break;
            
          case 'section':
            html = `
<div class="${blockId}">
  <div class="section-inner">
    ${block.children && block.children.length > 0 ? generateChildrenHTML(block.children) : '<div class="empty-drop-zone">📄 Секция</div>'}
  </div>
</div>`;
            break;
            
          case 'columns':
            html = `
<div class="${blockId}">
  <div class="columns-inner">
    ${block.children && block.children.length > 0 ? generateChildrenHTML(block.children) : '<div class="empty-drop-zone">📊 Колонки</div>'}
  </div>
</div>`;
            break;
            
          case 'column':
            html = `
<div class="${blockId}">
  ${block.children && block.children.length > 0 ? generateChildrenHTML(block.children) : '<div class="empty-drop-zone">📋 Колонка</div>'}
</div>`;
            break;
            
          case 'footer':
            html = `
<div class="${blockId}">
  <div class="footer-inner">
    <p>${block.content || '© 2024 Мой сайт. Все права защищены.'}</p>
    ${block.children && block.children.length > 0 ? generateChildrenHTML(block.children) : ''}
  </div>
</div>`;
            break;
            
          default:
            html = `
<div class="${blockId}">
  ${block.content || block.name}
</div>`;
        }
        
        return html;
      };

      const generateChildrenHTML = (children) => {
        let html = '';
        children.forEach(child => {
          html += generateBlockHTML(child);
        });
        return html;
      };

      // Генерируем HTML
      const htmlContent = generateHTML(blocks.value, pageSettings.value);
      
      // Создаем и скачиваем файл
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `website-${Date.now()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('HTML экспортирован успешно!');
    };

    const toggleTheme = () => {
      themeStore.toggleTheme();
    };

    const toggleFullscreenPreview = () => {
      fullscreenPreview.value = !fullscreenPreview.value;
    };

    const goToHome = () => {
      router.push('/');
    };

    const goToTemplates = () => {
      router.push('/templates');
    };

    const goToLogin = () => {
      router.push('/login');
    };

    const goToRegister = () => {
      router.push('/register');
    };

    const goToAccount = () => {
      router.push('/account');
    };

    const handleLogout = () => {
      console.log('Logout');
      router.push('/');
    };

    const isValidImageUrl = (url) => {
      if (!url) return false;
      return url.startsWith('http') || url.startsWith('data:image');
    };

    const handleImageError = (event) => {
      event.target.style.display = 'none';
    };

    // Инициализация структурных блоков при загрузке
    onMounted(() => {
      initializeStructuralBlocks();
    });

    return {
      blocks,
      activeBlock,
      blocksCount,
      isDark,
      themeClass,
      fullscreenPreview,
      isDragOver,
      previewStyles,
      handleDropFromLibrary,
      handleDragOver,
      handleDragEnter,
      handleDragLeave,
      clearSelection,
      handleExport,
      setActiveBlock,
      deleteBlock,
      duplicateBlock,
      initializeStructuralBlocks,
      clearAllBlocks,
      toggleTheme,
      toggleFullscreenPreview,
      goToHome,
      goToTemplates,
      goToLogin,
      goToRegister,
      goToAccount,
      handleLogout,
      isValidImageUrl,
      handleImageError
    };
  }
}
</script>

<style scoped>
.editor-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  position: relative;
  flex-shrink: 0;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.logo-section {
  flex: 1;
  display: flex;
  align-items: center;
}

.logo-image {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 0;
  background: none;
  border: none;
  border-radius: 0;
}

.logo-image:hover {
  transform: scale(1.1);
}

.logo-svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: invert(var(--logo-invert, 0));
  transition: all 0.3s ease;
}

.logo-image:hover .logo-svg {
  filter: invert(var(--logo-invert, 0)) brightness(1.2);
}

.nav-center {
  flex: 2;
  display: flex;
  justify-content: center;
}

.nav-menu {
  display: flex;
  gap: 0;
  background: var(--bg-tertiary);
  border-radius: 50px;
  padding: 8px;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
}

.nav-item {
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 30px;
  color: var(--text-secondary);
  font-weight: 400;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.nav-item:hover {
  color: var(--text-primary);
  background: var(--hover-color);
  transform: translateY(-1px);
}

.nav-item.current-page {
  color: var(--text-primary);
  background: var(--accent-color);
}

.nav-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
}

.auth-buttons {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.auth-btn {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  font-family: inherit;
  letter-spacing: 0.5px;
}

.login-btn {
  background: transparent;
  color: var(--text-primary);
}

.login-btn:hover {
  background: var(--hover-color);
  transform: translateY(-1px);
}

.register-btn {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.register-btn:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  transform: translateY(-1px);
}

.theme-toggle {
  position: relative;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.theme-toggle:hover {
  background: var(--hover-color);
  transform: scale(1.05);
  border-color: var(--accent-color);
}

.theme-icon {
  font-size: 1.3rem;
  z-index: 2;
  position: relative;
}

.theme-dark {
  --logo-invert: 1;
}

.theme-light {
  --logo-invert: 0;
}

.editor-layout {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.left-panel {
  width: 280px;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.center-panel {
  flex: 1;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
}

.center-panel.drag-over::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(59, 31, 161, 0.05);
  border: 2px dashed var(--accent-color);
  pointer-events: none;
  z-index: 5;
}

.canvas {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-primary);
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
  z-index: 10;
  flex-shrink: 0;
}

.canvas-header h3 {
  font-weight: 400;
  letter-spacing: 2px;
  opacity: 0.8;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.canvas-stats {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.stat {
  text-align: right;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: 1px;
  color: var(--accent-color);
}

.stat-label {
  font-size: 0.7rem;
  opacity: 0.6;
  letter-spacing: 1px;
  color: var(--text-tertiary);
  text-transform: uppercase;
}

.preview-fullscreen-btn {
  padding: 8px 16px;
  background: var(--success-color, #28a745);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-fullscreen-btn:hover {
  background: var(--success-hover, #34ce57);
  transform: translateY(-1px);
}

.clear-btn {
  padding: 8px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  background: var(--danger-color, #dc3545);
  color: white;
  border-color: var(--danger-color, #dc3545);
}

.blocks-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: var(--bg-primary);
}

.right-panel {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-left: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.right-panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  letter-spacing: 1px;
  font-size: 0.9rem;
  color: var(--text-tertiary);
  gap: 1.5rem;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  opacity: 0.5;
  margin-bottom: 1rem;
  color: var(--text-tertiary);
}

.empty-hint {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 0.5rem;
  color: var(--text-tertiary);
}

.adaptive-btn {
  padding: 12px 24px;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.adaptive-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

/* Полноэкранный предпросмотр */
.fullscreen-preview {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.preview-header {
  background: #f5f5f5;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}

.close-preview-btn {
  padding: 10px 20px;
  background: var(--danger-color, #dc3545);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.close-preview-btn:hover {
  background: var(--danger-hover, #c82333);
  transform: translateY(-1px);
}

.preview-info {
  color: #666;
  font-size: 0.9rem;
}

.preview-url {
  font-weight: 500;
  color: var(--accent-color);
}

.preview-content {
  flex: 1;
  overflow-y: auto;
  background: white;
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
  font-size: 1.2rem;
}

.preview-nav {
  display: flex;
  gap: 20px;
}

.preview-nav span {
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.2s;
}

.preview-nav span:hover {
  color: var(--accent-color);
}

.preview-hero {
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.preview-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.preview-hero p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.preview-heading {
  padding: 40px 20px;
}

.preview-heading h2 {
  margin: 0;
  font-size: 2.2rem;
  color: #333;
  font-weight: 600;
}

.preview-paragraph {
  padding: 20px;
}

.preview-paragraph p {
  margin: 0;
  line-height: 1.6;
  color: #666;
  font-size: 1.1rem;
}

.preview-button {
  padding: 30px 20px;
  text-align: center;
}

.preview-btn-element {
  padding: 15px 30px;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.preview-btn-element:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.preview-image {
  padding: 20px;
  text-align: center;
}

.preview-image img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.preview-image-placeholder {
  padding: 60px 40px;
  background: #f5f5f5;
  border: 2px dashed #ddd;
  border-radius: 8px;
  color: #999;
  text-align: center;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.preview-text {
  padding: 20px;
}

.preview-text p {
  margin: 0;
  color: #333;
  line-height: 1.6;
}

.preview-container-block {
  padding: 30px 20px;
}

.preview-container-inner {
  border: 1px dashed #ddd;
  border-radius: 8px;
  min-height: 150px;
  padding: 30px;
}

.preview-empty {
  color: #999;
  text-align: center;
  padding: 40px;
  font-size: 1.1rem;
}

.preview-children {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.preview-child {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #eee;
  color: #666;
}

.preview-body {
  padding: 40px 20px;
}

.preview-body-inner {
  min-height: 300px;
}

.preview-empty-body {
  color: #999;
  text-align: center;
  padding: 80px 20px;
  border: 2px dashed #eee;
  border-radius: 8px;
  font-size: 1.1rem;
}

.preview-body-children {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-body-child {
  padding: 20px;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.preview-footer {
  background: #2c3e50;
  color: white;
  padding: 40px 20px;
}

.preview-footer-inner {
  text-align: center;
}

.preview-footer p {
  margin: 0;
  color: #ccc;
  font-size: 1.1rem;
}

.preview-generic {
  padding: 20px;
  background: #f9f9f9;
  color: #666;
  border-radius: 6px;
  margin: 10px 20px;
}

.preview-empty-state {
  text-align: center;
  padding: 120px 20px;
  color: #999;
}

.preview-empty-state h3 {
  margin-bottom: 15px;
  color: #666;
  font-size: 1.5rem;
}

.preview-empty-state p {
  font-size: 1.1rem;
}

.blocks-container::-webkit-scrollbar {
  width: 8px;
}

.blocks-container::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
}

.blocks-container::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 4px;
}

.blocks-container::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

@media (max-width: 768px) {
  .nav {
    padding: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .nav-center {
    order: 3;
    flex: 100%;
    margin-top: 1rem;
  }
  
  .nav-right {
    flex: 1;
    justify-content: flex-end;
  }
  
  .auth-buttons {
    gap: 0.5rem;
  }
  
  .auth-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .editor-layout {
    flex-direction: column;
  }

  .left-panel {
    width: 100%;
    height: 200px;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .right-panel {
    width: 100%;
    height: 300px;
    border-left: none;
    border-top: 1px solid var(--border-color);
  }

  .canvas-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .canvas-stats {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .preview-header-inner {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .preview-hero h1 {
    font-size: 2rem;
  }

  .preview-heading h2 {
    font-size: 1.8rem;
  }
}
</style>