<template>
  <div class="templates-view">
    <header class="header">
      <nav class="nav">
        <!-- Логотип слева -->
        <div class="logo-section">
          <div class="logo-image" @click="goToHome">
            <img src="@/assets/images/logo.svg" alt="Digitalize" class="logo-svg">
          </div>
        </div>
        
        <!-- Центральное меню -->
        <div class="nav-center">
          <div class="nav-menu">
            <span @click="goToEditor" class="nav-item">Конструктор</span>
            <span class="nav-item active">Шаблоны</span>
            <span @click="goToExport" class="nav-item">Экспорт</span>
          </div>
        </div>
        
        <!-- Кнопка темы справа -->
        <div class="nav-right">
          <button 
            class="theme-toggle" 
            @click="toggleThemeWithRipple"
          >
            <span class="theme-icon">{{ isDark ? '☀️' : '🌙' }}</span>
          </button>
        </div>
      </nav>
    </header>

    <main class="templates-main">
      <div class="templates-header">
        <h1 class="templates-title">БИБЛИОТЕКА ШАБЛОНОВ</h1>
        <p class="templates-subtitle">Готовые решения для быстрого старта</p>
        
        <div class="templates-filters">
          <div class="filter-group">
            <label>Категория:</label>
            <select v-model="selectedCategory" class="filter-select">
              <option value="all">Все шаблоны</option>
              <option value="business">Бизнес</option>
              <option value="portfolio">Портфолио</option>
              <option value="ecommerce">Интернет-магазин</option>
              <option value="landing">Лендинг</option>
              <option value="blog">Блог</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Сортировка:</label>
            <select v-model="selectedSort" class="filter-select">
              <option value="newest">Сначала новые</option>
              <option value="popular">Популярные</option>
              <option value="name">По названию</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Показываем только реальные шаблоны, без заглушек -->
      <div class="templates-grid">
        <div 
          v-for="template in filteredTemplates" 
          :key="template.id"
          class="template-card"
          @click="previewTemplate(template)"
        >
          <div class="template-preview">
            <div class="template-placeholder">
              <Layout :size="48" />
              <div class="template-badge">{{ getCategoryName(template.category) }}</div>
            </div>
            
            <div class="template-overlay">
              <button @click.stop="useTemplate(template)" class="use-template-btn">
                <Check :size="20" />
                Использовать
              </button>
            </div>
          </div>
          
          <div class="template-info">
            <h3 class="template-name">{{ template.name }}</h3>
            <p class="template-description">{{ template.description }}</p>
            
            <div class="template-meta">
              <div class="template-difficulty" :class="template.difficulty">
                {{ getDifficultyName(template.difficulty) }}
              </div>
              <div class="template-stats">
                <Eye :size="14" />
                {{ template.views || 0 }}
              </div>
            </div>
            
            <div class="template-tags">
              <span 
                v-for="tag in template.tags" 
                :key="tag"
                class="template-tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Сообщение если нет шаблонов -->
      <div v-if="filteredTemplates.length === 0" class="empty-state">
        <div class="empty-icon">
          <Layout :size="64" />
        </div>
        <h3>Шаблоны не найдены</h3>
        <p>Попробуйте изменить параметры фильтрации</p>
      </div>

      <!-- Модальное окно предпросмотра -->
      <div v-if="selectedTemplate" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeModal">
            <X :size="24" />
          </button>
          
          <div class="modal-preview">
            <div class="modal-image">
              <div class="modal-placeholder">
                <Layout :size="64" />
                <p>Превью шаблона</p>
              </div>
            </div>
            
            <div class="modal-info">
              <h2>{{ selectedTemplate.name }}</h2>
              <p class="modal-description">{{ selectedTemplate.description }}</p>
              
              <div class="modal-details">
                <div class="detail-item">
                  <strong>Категория:</strong>
                  <span>{{ getCategoryName(selectedTemplate.category) }}</span>
                </div>
                <div class="detail-item">
                  <strong>Блоков:</strong>
                  <span>{{ selectedTemplate.blocksCount || 8 }}</span>
                </div>
                <div class="detail-item">
                  <strong>Сложность:</strong>
                  <span class="difficulty" :class="selectedTemplate.difficulty">
                    {{ getDifficultyName(selectedTemplate.difficulty) }}
                  </span>
                </div>
                <div class="detail-item">
                  <strong>Просмотры:</strong>
                  <span>{{ selectedTemplate.views || 0 }}</span>
                </div>
              </div>
              
              <div class="template-tags modal-tags">
                <span 
                  v-for="tag in selectedTemplate.tags" 
                  :key="tag"
                  class="template-tag"
                >
                  {{ tag }}
                </span>
              </div>
              
              <div class="modal-actions">
                <button @click="useTemplate(selectedTemplate)" class="btn-primary">
                  <Check :size="20" />
                  Использовать шаблон
                </button>
                <button @click="closeModal" class="btn-secondary">
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useThemeStore } from '../stores/theme';
import { storeToRefs } from 'pinia';
import { 
  Layout, 
  Check, 
  Eye, 
  X
} from 'lucide-vue-next';

const router = useRouter();
const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);

// Состояние
const selectedCategory = ref('all');
const selectedSort = ref('newest');
const selectedTemplate = ref(null);

// Моковые данные шаблонов
const templates = ref([
  {
    id: 1,
    name: 'Стартап Лендинг',
    description: 'Современный лендинг для IT-стартапов с акцентом на конверсию',
    category: 'business',
    difficulty: 'easy',
    tags: ['стартап', 'IT', 'лендинг'],
    views: 1245,
    blocksCount: 12
  },
  {
    id: 2,
    name: 'Портфолио Дизайнера',
    description: 'Элегантное портфолио для креативных профессионалов',
    category: 'portfolio',
    difficulty: 'medium',
    tags: ['портфолио', 'дизайн', 'креатив'],
    views: 876,
    blocksCount: 15
  },
  {
    id: 3,
    name: 'Интернет-магазин',
    description: 'Полнофункциональный шаблон для электронной коммерции',
    category: 'ecommerce',
    difficulty: 'hard',
    tags: ['магазин', 'ecommerce', 'товары'],
    views: 2103,
    blocksCount: 25
  },
  {
    id: 4,
    name: 'Корпоративный сайт',
    description: 'Профессиональный сайт для бизнеса любого масштаба',
    category: 'business',
    difficulty: 'medium',
    tags: ['корпоративный', 'бизнес', 'компания'],
    views: 1567,
    blocksCount: 20
  },
  {
    id: 5,
    name: 'Блог платформа',
    description: 'Идеальный шаблон для ведения блога или новостного портала',
    category: 'blog',
    difficulty: 'easy',
    tags: ['блог', 'новости', 'статьи'],
    views: 932,
    blocksCount: 18
  },
  {
    id: 6,
    name: 'Лендинг продукта',
    description: 'Продающая страница для цифрового продукта или услуги',
    category: 'landing',
    difficulty: 'easy',
    tags: ['продукт', 'продажи', 'конверсия'],
    views: 1876,
    blocksCount: 14
  }
]);

// Компьютеды
const filteredTemplates = computed(() => {
  let filtered = [...templates.value];
  
  // Фильтрация по категории
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(template => template.category === selectedCategory.value);
  }
  
  // Сортировка
  switch (selectedSort.value) {
    case 'popular':
      filtered.sort((a, b) => b.views - a.views);
      break;
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
    default:
      filtered.sort((a, b) => b.id - a.id);
  }
  
  return filtered;
});

// Методы
const getCategoryName = (category) => {
  const categories = {
    business: 'Бизнес',
    portfolio: 'Портфолио',
    ecommerce: 'Интернет-магазин',
    landing: 'Лендинг',
    blog: 'Блог'
  };
  return categories[category] || category;
};

const getDifficultyName = (difficulty) => {
  const difficulties = {
    easy: 'Начальный',
    medium: 'Средний',
    hard: 'Продвинутый'
  };
  return difficulties[difficulty] || difficulty;
};

const previewTemplate = (template) => {
  selectedTemplate.value = template;
};

const closeModal = () => {
  selectedTemplate.value = null;
};

const useTemplate = (template) => {
  console.log('Использование шаблона:', template);
  // Здесь можно добавить логику загрузки шаблона
  closeModal();
  router.push('/editor');
};

const toggleThemeWithRipple = (event) => {
  themeStore.toggleTheme();
};

const goToHome = () => {
  router.push('/');
};

const goToEditor = () => {
  router.push('/editor');
};

const goToExport = () => {
  console.log('Переход к экспорту');
};

onMounted(() => {
  console.log('Компонент TemplatesView загружен');
});
</script>

<style scoped>
.templates-view {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* Навигация */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  position: relative;
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

.nav-item:hover,
.nav-item.active {
  color: var(--text-primary);
  background: var(--hover-color);
  transform: translateY(-1px);
}

.nav-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
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

/* Основной контент */
.templates-main {
  padding: 2rem 3rem;
}

.templates-header {
  text-align: center;
  margin-bottom: 3rem;
}

.templates-title {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 3px;
  margin-bottom: 1rem;
  text-transform: uppercase;
  background: linear-gradient(135deg, #4dabf7 0%, #3b1fa1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.templates-subtitle {
  font-size: 1.1rem;
  opacity: 0.8;
  margin-bottom: 2rem;
  color: var(--text-secondary);
}

.templates-filters {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-family: inherit;
}

/* Сетка шаблонов */
.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.template-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.template-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-color: var(--accent-color);
}

.template-preview {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: var(--bg-tertiary);
}

.template-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-tertiary);
  position: relative;
}

.template-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--accent-color);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.template-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.template-card:hover .template-overlay {
  opacity: 1;
}

.use-template-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.use-template-btn:hover {
  background: #4dabf7;
  transform: scale(1.05);
}

.template-info {
  padding: 1.5rem;
}

.template-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.template-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
  font-size: 0.9rem;
}

.template-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.8rem;
}

.template-difficulty {
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.7rem;
}

.template-difficulty.easy {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
}

.template-difficulty.medium {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.template-difficulty.hard {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
}

.template-stats {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--text-tertiary);
}

.template-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.template-tag {
  padding: 0.2rem 0.5rem;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-radius: 12px;
  font-size: 0.7rem;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-tertiary);
}

.empty-icon {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.empty-state p {
  opacity: 0.7;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: var(--bg-secondary);
  border-radius: 12px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--bg-tertiary);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
  z-index: 10;
}

.modal-close:hover {
  background: var(--hover-color);
}

.modal-preview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
}

.modal-image {
  background: var(--bg-tertiary);
  border-radius: 8px;
  overflow: hidden;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--text-tertiary);
  text-align: center;
}

.modal-info h2 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.modal-description {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.modal-details {
  margin-bottom: 2rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.detail-item:last-child {
  border-bottom: none;
}

.difficulty.easy {
  color: #28a745;
}

.difficulty.medium {
  color: #ffc107;
}

.difficulty.hard {
  color: #dc3545;
}

.modal-tags {
  margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  flex: 1;
  justify-content: center;
}

.btn-primary:hover {
  background: #4dabf7;
  transform: translateY(-2px);
}

.btn-secondary {
  padding: 1rem 2rem;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: var(--hover-color);
}

.theme-dark {
  --logo-invert: 1;
}

.theme-light {
  --logo-invert: 0;
}

/* Адаптивность */
@media (max-width: 768px) {
  .templates-main {
    padding: 1rem;
  }
  
  .templates-grid {
    grid-template-columns: 1fr;
  }
  
  .templates-filters {
    flex-direction: column;
    gap: 1rem;
  }
  
  .modal-preview {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>