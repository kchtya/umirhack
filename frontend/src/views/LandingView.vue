<template>
  <div class="landing-view" :class="themeClass">
    <!-- Hero секция с фоновым изображением -->
    <section class="hero-section-with-bg">
      <!-- Навигационное меню -->
      <header class="header">
        <nav class="nav">
          <div class="logo-section">
            <div class="logo-image">
              <img src="@/assets/images/logo.svg" alt="Digitalize" class="logo-svg">
            </div>
          </div>
          
          <div class="nav-center">
            <div class="nav-menu">
              <span @click="goToEditor" class="nav-item">Конструктор</span>
              <span @click="goToTemplates" class="nav-item">Шаблоны</span>
              <span class="nav-item current-page">Главная</span>
            </div>
          </div>
          
          <div class="nav-right">
            <div class="auth-buttons">
              <div class="guest-buttons">
                <button class="auth-btn login-btn" @click="goToLogin">Войти</button>
                <button class="auth-btn register-btn" @click="goToRegister">Регистрация</button>
              </div>
            </div>
            <button 
              class="theme-toggle" 
              @click="toggleThemeWithRipple"
            >
              <span class="theme-icon">{{ isDark ? '☀️' : '🌙' }}</span>
            </button>
          </div>
        </nav>
      </header>

      <!-- Hero контент -->
      <div class="hero-content-wrapper">
        <div class="hero-content">
          <h1 class="hero-title pixel-text">
            Создавайте потрясающие
            <span class="gradient-text">лендинги</span>
            без кода
          </h1>
          <p class="hero-subtitle">
            TETRY - современный конструктор лендингов с интуитивным интерфейсом. 
            Собирайте продающие страницы за минуты с помощью drag-and-drop редактора.
          </p>
          <div class="hero-actions">
            <button @click="goToEditor" class="btn-primary">
              <Rocket :size="20" />
              Начать создавать
            </button>
            <button @click="goToTemplates" class="btn-secondary">
              <Layout :size="20" />
              Смотреть шаблоны
            </button>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">500+</span>
              <span class="stat-label">Проектов создано</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">50+</span>
              <span class="stat-label">Готовых блоков</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">99%</span>
              <span class="stat-label">Довольных клиентов</span>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-preview">
            <div class="preview-window">
              <div class="preview-header">
                <div class="window-controls">
                  <div class="control red"></div>
                  <div class="control yellow"></div>
                  <div class="control green"></div>
                </div>
              </div>
              <div class="preview-content">
                <div class="preview-block hero-preview-block"></div>
                <div class="preview-block features-preview-block"></div>
                <div class="preview-block cta-preview-block"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Основной контент в main -->
    <main class="main-content">
      <!-- Features секция -->
      <section class="features-section">
        <div class="container">
          <h2 class="section-title pixel-text">Почему выбирают TETRY</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <MousePointerClick :size="32" />
              </div>
              <h3>Drag-and-Drop</h3>
              <p>Интуитивный редактор без необходимости писать код</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <Layout :size="32" />
              </div>
              <h3>Готовые шаблоны</h3>
              <p>Библиотека профессиональных шаблонов для быстрого старта</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <Palette :size="32" />
              </div>
              <h3>Гибкая настройка</h3>
              <p>Полный контроль над цветами, шрифтами и расположением элементов</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <Smartphone :size="32" />
              </div>
              <h3>Адаптивный дизайн</h3>
              <p>Автоматическая адаптация под все устройства и экраны</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <Zap :size="32" />
              </div>
              <h3>Высокая скорость</h3>
              <p>Оптимизированные страницы с мгновенной загрузкой</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <Download :size="32" />
              </div>
              <h3>Экспорт кода</h3>
              <p>Скачивайте готовый HTML/CSS код для самостоятельного хостинга</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA секция -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-content">
            <h2>Готовы создать свой идеальный лендинг?</h2>
            <p>Присоединяйтесь к тысячам пользователей, которые уже создают потрясающие сайты с TETRY</p>
            <div class="cta-button-container">
              <button @click="goToRegister" class="btn-primary large">
                Начать бесплатно
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Подвал -->
    <AppFooter />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { storeToRefs } from 'pinia'
import AppFooter from '../components/AppFooter.vue'
import { 
  Rocket, 
  Layout, 
  MousePointerClick, 
  Palette, 
  Smartphone, 
  Zap, 
  Download 
} from 'lucide-vue-next'

export default {
  name: 'LandingView',
  components: {
    AppFooter,
    Rocket,
    Layout,
    MousePointerClick,
    Palette,
    Smartphone,
    Zap,
    Download
  },
  setup() {
    const router = useRouter()
    const themeStore = useThemeStore()
    const { isDark } = storeToRefs(themeStore)

    const themeClass = computed(() => isDark.value ? 'theme-dark' : 'theme-light')

    const toggleThemeWithRipple = (event) => {
      themeStore.toggleTheme()
    }

    const goToEditor = () => {
      router.push('/editor')
    }

    const goToTemplates = () => {
      router.push('/templates')
    }

    const goToLogin = () => {
      router.push('/login')
    }

    const goToRegister = () => {
      router.push('/register')
    }

    const goToAccount = () => {
      router.push('/account')
    }

    const handleLogout = () => {
      console.log('Logout')
      router.push('/')
    }

    return {
      isDark,
      themeClass,
      goToEditor,
      goToTemplates,
      goToLogin,
      goToRegister,
      goToAccount,
      handleLogout,
      toggleThemeWithRipple
    }
  }
}
</script>

<style scoped>
/* Импорт пиксельного шрифта */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

/* Flexbox layout для прижатия подвала к низу */
.landing-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* Основной контент занимает все доступное пространство */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Hero секция с фоновым изображением БЕЗ ИСКАЖЕНИЙ */
.hero-section-with-bg {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: url('/Frame4.svg') center/cover no-repeat;
}

/* Темная тема для hero секции БЕЗ ИСКАЖЕНИЙ */
.theme-dark .hero-section-with-bg {
  background: url('/Frame3.svg') center/cover no-repeat;
}

/* Контейнер для hero контента */
.hero-content-wrapper {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 4rem 3rem;
  gap: 4rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Навигация */
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
}

.logo-image:hover {
  transform: scale(1.1);
}

.logo-svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: invert(var(--logo-invert, 0));
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
}

.nav-item:hover,
.nav-item.current-page {
  color: var(--text-primary);
  background: var(--hover-color);
  transform: translateY(-1px);
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
  background: #3b1fa1;
  color: white;
  border-color: #3b1fa1;
}

.register-btn:hover {
  background: #4dabf7;
  border-color: #4dabf7;
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
  border-color: #3b1fa1;
}

.theme-icon {
  font-size: 1.3rem;
  z-index: 2;
  position: relative;
}

/* Hero контент */
.hero-content {
  max-width: 600px;
}

/* Пиксельный шрифт для заголовка */
.hero-title {
  font-family: 'Press Start 2P', cursive;
  font-size: 2.8rem;
  font-weight: 400;
  line-height: 1.3;
  margin-bottom: 1.5rem;
  letter-spacing: 1px;
}

.pixel-text {
  font-family: 'Press Start 2P', cursive;
  font-weight: 400;
  letter-spacing: 1px;
}

.gradient-text {
  background: linear-gradient(135deg, #4dabf7 0%, #3b1fa1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #3b1fa1;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #4dabf7;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 31, 161, 0.3);
}

.btn-primary.large {
  padding: 1.2rem 2.5rem;
  font-size: 1.1rem;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--hover-color);
  transform: translateY(-2px);
}

.hero-stats {
  display: flex;
  gap: 3rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* Правый блок (превью) адаптирован для светлой темы */
.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-preview {
  position: relative;
}

.preview-window {
  width: 400px;
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
}

.preview-header {
  background: var(--bg-tertiary);
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.window-controls {
  display: flex;
  gap: 0.5rem;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.control.red {
  background: #ff5f57;
}

.control.yellow {
  background: #ffbd2e;
}

.control.green {
  background: #28ca42;
}

.preview-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-block {
  border-radius: 8px;
}

.hero-preview-block {
  height: 120px;
  background: linear-gradient(135deg, #4dabf7 0%, #3b1fa1 100%);
}

.features-preview-block {
  height: 80px;
  background: var(--bg-tertiary);
}

.cta-preview-block {
  height: 60px;
  background: var(--accent-color);
}

/* Features секция полностью адаптирована для светлой темы */
.features-section {
  padding: 6rem 3rem;
  background: var(--bg-secondary);
}

/* ОБНОВЛЕНО: В темной теме блок становится черным */
.theme-dark .features-section {
  background: #000000 !important;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 4rem;
  background: linear-gradient(135deg, #4dabf7 0%, #3b1fa1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ОБНОВЛЕНО: Пиксельный шрифт для заголовка секции */
.section-title.pixel-text {
  font-family: 'Press Start 2P', cursive;
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--bg-primary);
  padding: 2.5rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: var(--accent-color);
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: var(--bg-tertiary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: var(--accent-color);
  transition: all 0.3s ease;
}

/* Иконки в светлой теме становятся цвета #3A1FA1 */
.theme-light .feature-icon {
  color: #3A1FA1 !important;
}

.theme-light .feature-icon svg {
  stroke: #3A1FA1 !important;
}

.feature-card:hover .feature-icon {
  background: var(--accent-color);
  color: white;
  transform: scale(1.1);
}

/* Hover эффект для иконок в светлой теме */
.theme-light .feature-card:hover .feature-icon {
  background: #3A1FA1 !important;
  color: white !important;
}

.theme-light .feature-card:hover .feature-icon svg {
  stroke: white !important;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* CTA секция */
.cta-section {
  padding: 6rem 3rem;
  background: linear-gradient(135deg, #3b1fa1 0%, #4dabf7 100%);
  color: white;
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-content p {
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

/* ОБНОВЛЕНО: Контейнер для кнопки с центрированием */
.cta-button-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

/* CSS переменные для правильной работы светлой темы */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #e9ecef;
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --text-tertiary: #adb5bd;
  --border-color: #dee2e6;
  --hover-color: rgba(0, 0, 0, 0.05);
  --accent-color: #3b1fa1;
}

.theme-dark {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --bg-tertiary: #3d3d3d;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --text-tertiary: #808080;
  --border-color: #404040;
  --hover-color: rgba(255, 255, 255, 0.1);
  --accent-color: #4dabf7;
  --logo-invert: 1;
}

.theme-light {
  --logo-invert: 0;
}

/* Адаптивность */
@media (max-width: 768px) {
  .hero-content-wrapper {
    grid-template-columns: 1fr;
    padding: 2rem 1rem;
    text-align: center;
    gap: 2rem;
  }
  
  .hero-title {
    font-size: 1.8rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-stats {
    justify-content: center;
    gap: 2rem;
  }
  
  .features-section,
  .cta-section {
    padding: 3rem 1rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
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
  
  .preview-window {
    width: 300px;
  }
  
  .feature-card {
    padding: 2rem;
  }
  
  .feature-icon {
    width: 70px;
    height: 70px;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-title.pixel-text {
    font-size: 1.5rem;
  }
  
  .cta-content h2 {
    font-size: 2rem;
  }
}

/* Стили для подвала в светлой теме */
.landing-view.theme-light .app-footer {
  background: transparent !important;
  color: #333333 !important;
  border-top: 1px solid #e8dfc4 !important;
}

.landing-view.theme-light .app-footer .footer-section h3,
.landing-view.theme-light .app-footer .footer-section h4 {
  color: #3b1fa1 !important;
}

.landing-view.theme-light .app-footer .footer-section a {
  color: #666666 !important;
}

.landing-view.theme-light .app-footer .footer-section a:hover {
  color: #3b1fa1 !important;
}

.landing-view.theme-light .app-footer .footer-bottom {
  border-top-color: #e8dfc4 !important;
  color: #666666 !important;
}

.theme-light .main-content {
  background: #F5EFD5 !important;
}

.theme-light .features-section {
  background: #F5EFD5 !important;
}

.theme-light .cta-section {
  background: #F5EFD5 !important;
  color: #333333 !important;
}

/* Подвал прозрачный - будет виден кремовый фон через него */
.landing-view.theme-light .app-footer {
  background: transparent !important;
}

/* Адаптивность для пиксельного текста */
@media (max-width: 480px) {
  .hero-title {
    font-size: 1.4rem;
    line-height: 1.4;
  }
  
  .section-title.pixel-text {
    font-size: 1.2rem;
  }
  
  .cta-content h2 {
    font-size: 1.5rem;
  }
  
  .cta-content p {
    font-size: 1rem;
  }
}

/* ОБНОВЛЕНО: Дополнительные стили для темной темы */
.theme-dark .features-section .feature-card {
  background: #1a1a1a;
  border-color: #333333;
}

.theme-dark .features-section .feature-card:hover {
  border-color: #4dabf7;
  box-shadow: 0 20px 40px rgba(77, 171, 247, 0.1);
}
</style>