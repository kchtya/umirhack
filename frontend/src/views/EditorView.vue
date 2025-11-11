<template>
  <div class="editor-view" :class="themeClass">
    <header class="header">
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
        
        <!-- ОБНОВЛЕНО: Правильные кнопки авторизации -->
        <div class="nav-right">
          <div class="auth-buttons">
            <!-- Показываем кнопки входа/регистрации -->
            <div class="guest-buttons">
              <button class="auth-btn login-btn" @click="goToLogin">Войти</button>
              <button class="auth-btn register-btn" @click="goToRegister">Регистрация</button>
            </div>
            
            <!-- Закомментировано - будет показываться когда пользователь авторизован -->
            <!--
            <div class="user-buttons">
              <button class="auth-btn account-btn" @click="goToAccount">Аккаунт</button>
              <button class="auth-btn logout-btn" @click="handleLogout">Выйти</button>
            </div>
            -->
          </div>
          <button class="theme-toggle" @click="toggleThemeWithRipple">
            <span class="theme-icon">{{ isDark ? '☀️' : '🌙' }}</span>
          </button>
        </div>
      </nav>
    </header>
    
    <!-- ОБНОВЛЕНО: Основной контент в main -->
    <main class="main-content">
      <div class="editor-layout">
        <!-- Левая панель: Библиотека блоков -->
        <div class="left-panel">
          <BlockLibrary />
        </div>
        
        <!-- Центральная область: Холст -->
        <div 
          class="center-panel"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @dragenter="handleDragEnter"
          @dragleave="handleDragLeave"
          @click="clearSelection"
          :class="{ 'drag-over': isDragOver }"
        >
          <div class="canvas">
            <div class="canvas-header">
              <h3>РАБОЧАЯ ОБЛАСТЬ</h3>
              <div class="canvas-stats">
                <div class="stat">
                  <span class="stat-number">{{ blocksCount }}</span>
                  <span class="stat-label">БЛОКОВ</span>
                </div>
              </div>
            </div>
            
            <!-- Пустое состояние -->
            <div v-if="blocksCount === 0" class="empty-state">
              <div class="empty-icon">
                <Download :size="48" />
              </div>
              <p>ПЕРЕТАЩИТЕ БЛОКИ ДЛЯ НАЧАЛА РАБОТЫ</p>
            </div>
            
            <!-- Блоки на холсте -->
            <div class="blocks-container">
              <div 
                v-for="(block, index) in blocks" 
                :key="block.id"
                class="block-wrapper"
                :class="{ active: activeBlock?.id === block.id }"
                @click.stop="setActiveBlock(block.id)"
                :style="getBlockStyles(block)"
              >
                <!-- Заголовок блока с иконкой -->
                <div class="block-header">
                  <div class="block-type">
                    <component :is="getBlockIcon(block.type)" :size="16" class="block-type-icon" />
                    <span class="block-type-label">{{ getBlockLabel(block.type) }}</span>
                  </div>
                  <div class="block-actions">
                    <!-- Drag handle -->
                    <div class="drag-handle" title="Перетащить блок" @mousedown="startDrag(block.id, $event)">
                      <GripVertical :size="16" />
                    </div>
                    
                    <!-- Кнопка удаления -->
                    <button 
                      @click.stop="deleteBlock(block.id)"
                      class="delete-btn"
                      title="Удалить блок"
                    >
                      <X :size="16" />
                    </button>
                  </div>
                </div>
                
                <!-- Hero блок -->
                <div v-if="block.type === 'hero'" class="block-element hero">
                  <h1>{{ block.content }}</h1>
                </div>
                
                <!-- Heading блок -->
                <div v-else-if="block.type === 'heading'" class="block-element heading">
                  <h2>{{ block.content }}</h2>
                </div>
                
                <!-- Paragraph блок -->
                <div v-else-if="block.type === 'paragraph'" class="block-element paragraph">
                  <p>{{ block.content }}</p>
                </div>
                
                <!-- Button блок -->
                <div v-else-if="block.type === 'button'" class="block-element button">
                  <button>{{ block.content }}</button>
                </div>
                
                <!-- Image блок -->
                <div v-else-if="block.type === 'image'" class="block-element image">
                  <img 
                    v-if="isValidImageUrl(block.content)" 
                    :src="block.content" 
                    alt="Image block" 
                    @error="handleImageError"
                    :style="{ 
                      width: block.styles?.width || '100%',
                      height: block.styles?.height || 'auto',
                      borderRadius: block.styles?.borderRadius || '8px'
                    }"
                  >
                  <div v-else class="image-placeholder">
                    <Image :size="32" />
                    <p>Введите URL изображения</p>
                    <div class="image-hint">Например: https://images.unsplash.com/photo-1550745165-9bc0b252726f</div>
                  </div>
                </div>
                
                <!-- Text блок -->
                <div v-else-if="block.type === 'text'" class="block-element text">
                  <p>{{ block.content }}</p>
                </div>
                
                <!-- Features блок -->
                <div v-else-if="block.type === 'features'" class="block-element features">
                  <h3>Функции</h3>
                  <p>{{ block.content }}</p>
                </div>
                
                <!-- Testimonials блок -->
                <div v-else-if="block.type === 'testimonials'" class="block-element testimonials">
                  <h3>Отзывы</h3>
                  <p>{{ block.content }}</p>
                </div>
                
                <!-- Contact блок -->
                <div v-else-if="block.type === 'contact'" class="block-element contact">
                  <h3>Контакты</h3>
                  <p>{{ block.content }}</p>
                </div>
                
                <!-- Footer блок -->
                <div v-else-if="block.type === 'footer'" class="block-element footer">
                  <p>{{ block.content }}</p>
                </div>
                
                <!-- Неизвестный блок -->
                <div v-else class="block-element unknown">
                  {{ block.content }}
                </div>

                <!-- Кнопки перемещения -->
                <div v-if="activeBlock?.id === block.id" class="move-buttons">
                  <button @click.stop="moveBlockUp(index)" class="move-btn" :disabled="index === 0" title="Переместить вверх">
                    <ChevronUp :size="14" />
                  </button>
                  <button @click.stop="moveBlockDown(index)" class="move-btn" :disabled="index === blocks.length - 1" title="Переместить вниз">
                    <ChevronDown :size="14" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Правая панель: Редактор и инструменты -->
        <div class="right-panel">
          <div class="right-panel-content">
            <BlockEditor v-if="activeBlock" />
            <Toolbar v-if="activeBlock" />
            <ProjectManager v-if="!activeBlock" />
            <div v-if="!activeBlock && blocksCount > 0" class="no-selection">
              <MousePointerClick :size="32" />
              <p>Выберите блок для редактирования</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- ДОБАВЛЕН ПОДВАЛ -->
    <AppFooter />
  </div>
</template>

<script>
import { useEditorStore } from '../stores/editor';
import { useThemeStore } from '../stores/theme';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import BlockLibrary from '../components/BlockLibrary.vue';
import BlockEditor from '../components/BlockEditor.vue';
import Toolbar from '../components/Toolbar.vue';
import ProjectManager from '../components/ProjectManager.vue';
import AppFooter from '../components/AppFooter.vue';

// Иконки Lucide
import { 
  Download,
  GripVertical,
  X,
  ChevronUp,
  ChevronDown,
  Image,
  MousePointerClick,
  Heading,
  Pilcrow,
  MousePointerClick as ButtonIcon,
  Type,
  Star,
  Wrench,
  MessageCircle,
  Mail,
  Minus
} from 'lucide-vue-next';

export default {
  name: 'EditorView',
  components: {
    BlockLibrary,
    BlockEditor,
    Toolbar,
    ProjectManager,
    AppFooter,
    Download,
    GripVertical,
    X,
    ChevronUp,
    ChevronDown,
    Image,
    MousePointerClick
  },
  setup() {
    const editorStore = useEditorStore();
    const themeStore = useThemeStore();
    const router = useRouter();
    
    const { blocks, activeBlock, blocksCount } = storeToRefs(editorStore);
    const { isDark } = storeToRefs(themeStore);
    const { addBlock, setActiveBlock, deleteBlock, getDefaultContent, moveBlock } = editorStore;

    const themeClass = computed(() => isDark.value ? 'theme-dark' : 'theme-light');

    const isDragOver = ref(false);

    const handleDragOver = (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    };

    const goToTemplates = () => {
      router.push('/templates')
    }

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

    const handleDrop = (event) => {
      event.preventDefault();
      isDragOver.value = false;
      
      try {
        const blockData = JSON.parse(event.dataTransfer.getData('application/json'));
        console.log('Dropped block:', blockData);
        addBlock(blockData.type);
      } catch (error) {
        console.error('Ошибка при добавлении блока:', error);
      }
    };

    const clearSelection = () => {
      setActiveBlock(null);
    };

    const getBlockStyles = (block) => {
      const styles = { ...block.styles };
      if (!styles.fontFamily || styles.fontFamily === 'inherit') {
        styles.fontFamily = 'JetBrains Mono, IBM Plex Mono, monospace';
      }
      return styles;
    };

    const isValidImageUrl = (url) => {
      if (!url || url === getDefaultContent('image')) return false;
      return url.startsWith('http') || url.startsWith('data:image');
    };

    const getBlockIcon = (type) => {
      const icons = {
        hero: Star,
        heading: Heading,
        paragraph: Pilcrow,
        button: ButtonIcon,
        image: Image,
        text: Type,
        features: Wrench,
        testimonials: MessageCircle,
        contact: Mail,
        footer: Minus
      };
      return icons[type] || Type;
    };

    const getBlockLabel = (type) => {
      const labels = {
        hero: 'Hero Секция',
        heading: 'Заголовок',
        paragraph: 'Параграф',
        button: 'Кнопка',
        image: 'Изображение',
        text: 'Текст',
        features: 'Функции',
        testimonials: 'Отзывы',
        contact: 'Контакты',
        footer: 'Футер'
      };
      return labels[type] || 'Блок';
    };

    const handleExport = () => {
      const projectData = {
        name: 'Мой проект',
        blocks: blocks.value,
        exportedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(projectData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `landing-project.json`;
      link.click();
    };

    const handleImageError = (event) => {
      console.log('Image load error');
      event.target.style.display = 'none';
    };

    const moveBlockUp = (index) => {
      if (index > 0) {
        moveBlock(index, index - 1);
      }
    };

    const moveBlockDown = (index) => {
      if (index < blocks.value.length - 1) {
        moveBlock(index, index + 1);
      }
    };

    const startDrag = (blockId, event) => {
      setActiveBlock(blockId);
      event.stopPropagation();
    };

    const toggleThemeWithRipple = (event) => {
      themeStore.toggleTheme();
    };

    const goToHome = () => {
      router.push('/');
    };

    const goToLogin = () => {
      router.push('/login');
    };

    const goToRegister = () => {
      router.push('/register');
    };

    // ОБНОВЛЕНО: Добавлены методы для аккаунта
    const goToAccount = () => {
      router.push('/account');
    };

    const handleLogout = () => {
      console.log('Logout');
      // Здесь будет логика выхода когда появится бэкенд
      router.push('/');
    };

    return {
      blocks,
      activeBlock,
      blocksCount,
      isDark,
      themeClass,
      isDragOver,
      handleDrop,
      handleDragOver,
      handleDragEnter,
      handleDragLeave,
      clearSelection,
      getBlockStyles,
      isValidImageUrl,
      getBlockIcon,
      getBlockLabel,
      handleExport,
      handleImageError,
      getDefaultContent,
      setActiveBlock,
      deleteBlock,
      moveBlockUp,
      moveBlockDown,
      startDrag,
      toggleThemeWithRipple,
      goToHome,
      goToTemplates,
      goToLogin,
      goToRegister,
      goToAccount,
      handleLogout
    };
  }
}
</script>

<style scoped>
/* ОБНОВЛЕНО: Flexbox layout для прижатия подвала к низу */
.editor-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  transition: all 0.3s ease;
}

/* ОБНОВЛЕНО: Основной контент занимает все доступное пространство */
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

/* ОБНОВЛЕНО: Стиль для текущей страницы */
.nav-item.current-page {
  color: var(--text-primary);
  background: var(--accent-color);
}

/* ОБНОВЛЕНО: Правая часть с авторизацией */
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
  background: #3b1fa1;
  color: white;
  border-color: #3b1fa1;
}

.register-btn:hover {
  background: #4dabf7;
  border-color: #4dabf7;
  transform: translateY(-1px);
}

/* ОБНОВЛЕНО: Стили для кнопок аккаунта (пока не используются) */
.account-btn {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.logout-btn {
  background: transparent;
  color: var(--text-primary);
}

.logout-btn:hover {
  background: var(--hover-color);
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
  border-color: #3b1fa1;
}

.theme-icon {
  font-size: 1.3rem;
  z-index: 2;
  position: relative;
}

/* ОБНОВЛЕНО: CSS переменные для инвертирования лого */
.theme-dark {
  --logo-invert: 1;
}

.theme-light {
  --logo-invert: 0;
}

/* ОБНОВЛЕНО: Основной layout редактора */
.editor-layout {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* Левая панель */
.left-panel {
  width: 280px;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Центральная панель */
.center-panel {
  flex: 1;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.center-panel.drag-over {
  background: rgba(59, 31, 161, 0.1);
  border: 2px dashed #3b1fa1;
}

.canvas {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-primary);
  z-index: 10;
  flex-shrink: 0;
}

.canvas-header h3 {
  font-weight: 400;
  letter-spacing: 2px;
  opacity: 0.8;
  color: var(--text-primary);
}

.canvas-stats {
  display: flex;
  gap: 3rem;
  align-items: center;
}

.stat {
  text-align: right;
}

.stat-number {
  display: block;
  font-size: 1.8rem;
  font-weight: 300;
  letter-spacing: 1px;
  color: #3b1fa1;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.6;
  letter-spacing: 1px;
  color: var(--text-tertiary);
}

/* Контейнер блоков с прокруткой */
.blocks-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

/* Правая панель */
.right-panel {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-left: 1px solid var(--border-color);
}

.right-panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.no-selection {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
  font-size: 0.9rem;
  letter-spacing: 1px;
  padding: 2rem;
  text-align: center;
}

/* Блоки на холсте */
.block-wrapper {
  position: relative;
  margin: 15px auto;
  padding: 20px;
  background: var(--bg-tertiary);
  border: 2px solid transparent;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
  min-height: 60px;
  max-width: 800px;
  width: calc(100% - 4rem);
}

.block-wrapper:hover {
  border-color: var(--border-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.block-wrapper.active {
  border-color: #4dabf7;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

/* Drag handle */
.drag-handle {
  position: absolute;
  top: 5px;
  left: 5px;
  cursor: grab;
  color: var(--text-tertiary);
  font-size: 16px;
  padding: 5px;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 2;
}

.block-wrapper:hover .drag-handle {
  opacity: 1;
}

.drag-handle:active {
  cursor: grabbing;
}

/* Move buttons */
.move-buttons {
  position: absolute;
  top: 5px;
  right: 35px;
  display: flex;
  gap: 2px;
  z-index: 2;
}

.move-btn {
  width: 24px;
  height: 24px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 3px;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.move-btn:hover:not(:disabled) {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.move-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.block-element {
  margin: 0;
  font-family: inherit;
}

/* Hero блок */
.block-element.hero {
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  border-radius: 12px;
  font-weight: bold;
}

.block-element.hero h1 {
  margin: 0;
  font-weight: 700;
}

/* Heading блок */
.block-element.heading h2 {
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
}

/* Paragraph блок */
.block-element.paragraph p {
  margin: 0;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Button блок */
.block-element.button button {
  padding: 12px 24px;
  background: #3b1fa1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.block-element.button button:hover {
  background: #4dabf7;
  transform: translateY(-1px);
}

/* Image блок */
.block-element.image {
  text-align: center;
  position: relative;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.block-element.image img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.image-placeholder {
  padding: 3rem;
  background: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  color: var(--text-tertiary);
  text-align: center;
  width: 100%;
}

/* Text блок */
.block-element.text {
  padding: 15px;
  background: var(--bg-secondary);
  border-radius: 6px;
  color: var(--text-primary);
  line-height: 1.6;
}

/* Features блок */
.block-element.features {
  padding: 2rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 12px;
  text-align: center;
}

.block-element.features h3 {
  margin: 0 0 1rem 0;
}

/* Testimonials блок */
.block-element.testimonials {
  padding: 2rem;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border-radius: 12px;
  text-align: center;
}

.block-element.testimonials h3 {
  margin: 0 0 1rem 0;
}

/* Contact блок */
.block-element.contact {
  padding: 2rem;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  border-radius: 12px;
  text-align: center;
}

.block-element.contact h3 {
  margin: 0 0 1rem 0;
}

/* Footer блок */
.block-element.footer {
  padding: 2rem;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 8px;
  text-align: center;
  border-top: 3px solid #3b1fa1;
}

/* Неизвестный блок */
.block-element.unknown {
  padding: 20px;
  background: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  color: var(--text-tertiary);
  text-align: center;
  font-style: italic;
}

.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 5;
}

.delete-btn:hover {
  background: #c82333;
  transform: scale(1.1);
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
  gap: 1rem;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.5;
  margin-bottom: 1rem;
}

/* Кастомные скроллбары */
.blocks-container::-webkit-scrollbar,
.right-panel-content::-webkit-scrollbar {
  width: 8px;
}

.blocks-container::-webkit-scrollbar-track,
.right-panel-content::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
}

.blocks-container::-webkit-scrollbar-thumb,
.right-panel-content::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 4px;
}

.blocks-container::-webkit-scrollbar-thumb:hover,
.right-panel-content::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

/* Заголовок блока */
.block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.block-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.block-type-icon {
  opacity: 0.7;
}

.block-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Drag handle */
.drag-handle {
  cursor: grab;
  color: var(--text-tertiary);
  padding: 4px;
  border-radius: 3px;
  transition: all 0.2s;
  opacity: 0;
}

.block-wrapper:hover .drag-handle {
  opacity: 1;
}

.drag-handle:hover {
  background: var(--hover-color);
  color: var(--text-primary);
}

.drag-handle:active {
  cursor: grabbing;
}

/* Move buttons */
.move-buttons {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 2;
}

.move-btn {
  width: 24px;
  height: 24px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 3px;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.move-btn:hover:not(:disabled) {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.move-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Image placeholder */
.image-placeholder {
  padding: 3rem;
  background: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  color: var(--text-tertiary);
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.image-placeholder p {
  margin: 0;
  font-weight: 500;
}

.image-hint {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 0.5rem;
}

/* Empty state */
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
  gap: 1rem;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  opacity: 0.5;
  margin-bottom: 1rem;
}

/* No selection state */
.no-selection {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
  font-size: 0.9rem;
  letter-spacing: 1px;
  padding: 2rem;
  text-align: center;
  gap: 1rem;
}

/* Delete button */
.delete-btn {
  width: 24px;
  height: 24px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  opacity: 0;
}

.block-wrapper:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: #c82333;
  transform: scale(1.1);
}

/* Адаптивность */
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
}
</style>