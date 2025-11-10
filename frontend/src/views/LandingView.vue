<template>
  <div class="landing" :class="themeClass">
    <!-- Фоновые изображения из public папки -->
    <div class="background-container">
      <img 
        v-if="isDark" 
        src="/Frame3.svg" 
        alt="Dark theme background" 
        class="background-image"
      >
      <img 
        v-else 
        src="/Frame4.svg" 
        alt="Light theme background" 
        class="background-image"
      >
    </div>

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
            <span @click="goToTemplates" class="nav-item">Шаблоны</span>
            <span @click="scrollToSection('export')" class="nav-item">Экспорт</span>
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
    
    <!-- Hero секция с оберткой для z-index -->
    <div class="content-wrapper">
      <div class="hero">
        <h1 class="hero-title">СОЗДАВАЙТЕ УМНЫЕ ЛЕНДИНГИ</h1>
        <p class="hero-subtitle">Визуальный конструктор для быстрых результатов</p>
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="hero-stat-number">100+</span>
            <span class="hero-stat-label">КЛИЕНТОВ</span>
          </div>
          <div class="hero-stat">
            <span class="hero-stat-number">300%</span>
            <span class="hero-stat-label">РОСТ КОНВЕРСИИ</span>
          </div>
        </div>
        <button class="cta-button" @click="goToEditor">
          Начать создание
        </button>
      </div>
      
      <main class="main-content">
        <section class="features">
          <h2>Почему выбирают Digitalize?</h2>
          <div class="features-grid">
            <div class="feature">
              <h3>🚀 Быстро</h3>
              <p>Создавайте лендинги за минуты без навыков программирования</p>
            </div>
            <div class="feature">
              <h3>🎨 Профессионально</h3>
              <p>Современный дизайн и адаптивная верстка</p>
            </div>
            <div class="feature">
              <h3>💾 Сохраняйте</h3>
              <p>Все проекты сохраняются автоматически</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import { inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { storeToRefs } from 'pinia'

export default {
  name: 'LandingView',
  setup() {
    const router = useRouter()
    const themeStore = useThemeStore()
    const { isDark } = storeToRefs(themeStore)
    const startRipple = inject('startRipple')

    const themeClass = computed(() => isDark.value ? 'theme-dark' : 'theme-light')

    const toggleThemeWithRipple = (event) => {
      if (startRipple) {
        startRipple(event)
      } else {
        themeStore.toggleTheme()
      }
    }

    const goToTemplates = () => {
      router.push('/templates')
    }

    const goToHome = () => {
      router.push('/')
    }

    const goToEditor = () => {
      router.push('/editor')
    }

    const scrollToSection = (sectionId) => {
      console.log('Scroll to:', sectionId)
    }

    return {
      isDark,
      themeClass,
      goToHome,
      goToEditor,
      goToTemplates,
      toggleThemeWithRipple,
      scrollToSection
    }
  }
}
</script>

<style scoped>
.landing {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  position: relative;
  overflow: auto; /* разрешаем скролл */
}

.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* вместо cover - сохраняет оригинальные пропорции */
  object-position: top center; /* прикрепляем к верху */
}

/* Обертка для контента с z-index */
.content-wrapper {
  position: relative;
  z-index: 1;
}

/* Новая навигация */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  position: relative;
  z-index: 10;
}

/* Логотип слева - БЕЗ ВИДИМОГО БЛОКА */
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

/* Центральное меню */
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
  font-family: inherit;
}

.nav-item:hover {
  color: var(--text-primary);
  background: var(--hover-color);
  transform: translateY(-1px);
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: #3b1fa1;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-item:hover::after {
  width: 60%;
}

/* Правая часть с кнопкой темы */
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

/* Hero секция */
.hero {
  text-align: center;
  padding: 6rem 2rem;
  position: relative;
  z-index: 5;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  color: var(--text-primary);
  background: linear-gradient(135deg, #4dabf7 0%, #3b1fa1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Press Start 2P', 'Courier New', monospace;
  text-shadow: 3px 3px 0px rgba(59, 31, 161, 0.3);
  line-height: 1.3;
}

.hero-subtitle {
  font-size: 1.3rem;
  font-weight: 300;
  opacity: 0.8;
  letter-spacing: 1px;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  font-family: inherit;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin: 3rem 0;
}

.hero-stat {
  text-align: center;
}

.hero-stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: 2px;
  color: #3b1fa1;
  margin-bottom: 0.5rem;
  font-family: inherit;
}

.hero-stat-label {
  font-size: 0.9rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-tertiary);
  font-weight: 400;
  font-family: inherit;
}

.cta-button {
  background: #3b1fa1;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: inherit;
  position: relative;
  z-index: 2;
}

.cta-button:hover {
  background: #4dabf7;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 31, 161, 0.3);
}

/* Features секция */
.features {
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 5;
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 4rem;
  color: var(--text-primary);
  font-family: inherit;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.feature {
  text-align: center;
  padding: 2rem;
  border-radius: 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  backdrop-filter: blur(10px);
}

.feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-color: var(--accent-color);
}

.feature h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
  font-family: inherit;
}

.feature p {
  color: var(--text-secondary);
  line-height: 1.6;
  font-family: inherit;
}

/* CSS переменные для инвертирования лого в темной теме */
.theme-dark {
  --logo-invert: 1;
}

.theme-light {
  --logo-invert: 0;
}

/* Адаптивность */
@media (max-width: 768px) {
  .nav {
    padding: 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .background-image {
    opacity: 0.1;
  }
}
</style>