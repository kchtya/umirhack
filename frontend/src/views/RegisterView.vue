<template>
  <div class="auth-page" :class="themeClass">
    <!-- ИСПРАВЛЕНО: Фоновые изображения с cover -->
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

    <!-- Навигационное меню -->
    <header class="header">
      <nav class="nav">
        <div class="logo-section">
          <div class="logo-image" @click="goToHome">
            <img src="@/assets/images/logo.svg" alt="Digitalize" class="logo-svg">
          </div>
        </div>
        
        <div class="nav-center">
          <div class="nav-menu">
            <span @click="goToEditor" class="nav-item">Конструктор</span>
            <span @click="goToTemplates" class="nav-item">Шаблоны</span>
            <span @click="goToHome" class="nav-item">Главная</span>
          </div>
        </div>
        
        <div class="nav-right">
          <div class="auth-buttons">
            <!-- ИСПРАВЛЕНО: Кнопка с адаптивным цветом -->
            <button class="auth-btn login-btn adaptive-btn" @click="goToLogin">Войти</button>
            <button class="auth-btn register-btn current-page">Регистрация</button>
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

    <main class="main-content">
      <div class="auth-content">
        <div class="auth-container">
          <div class="auth-card-wrapper">
            <div class="auth-card">
              <h2>Регистрация</h2>
              <form @submit.prevent="handleRegister" class="auth-form">
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" v-model="email" required>
                </div>
                <div class="form-group">
                  <label>Пароль</label>
                  <input type="password" v-model="password" required>
                </div>
                <div class="form-group">
                  <label>Подтвердите пароль</label>
                  <input type="password" v-model="confirmPassword" required>
                </div>
                <!-- ИСПРАВЛЕНО: Кнопка с адаптивным цветом -->
                <button type="submit" class="auth-submit-btn adaptive-btn">Зарегистрироваться</button>
              </form>
              <p class="auth-link">
                Уже есть аккаунт? <span @click="goToLogin">Войти</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script>
import { computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { storeToRefs } from 'pinia'
import AppFooter from '../components/AppFooter.vue'

export default {
  name: 'RegisterView',
  components: {
    AppFooter
  },
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

    const goToHome = () => {
      router.push('/')
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

    const handleRegister = () => {
      console.log('Register attempt')
      router.push('/editor')
    }

    return {
      isDark,
      themeClass,
      goToHome,
      goToEditor,
      goToTemplates,
      goToLogin,
      toggleThemeWithRipple,
      handleRegister
    }
  },
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: ''
    }
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  color: var(--text-primary);
  position: relative;
  overflow: hidden; /* ИСПРАВЛЕНО: Добавил чтобы убрать скролл фона */
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
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

/* ИСПРАВЛЕНО: Адаптивная кнопка */
.adaptive-btn {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.adaptive-btn:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  transform: translateY(-1px);
}

.register-btn {
  background: transparent;
  color: var(--text-primary);
}

.register-btn:hover {
  background: var(--hover-color);
  transform: translateY(-1px);
}

/* Стиль для кнопки текущей страницы */
.auth-btn.current-page {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
  cursor: default;
  transform: none;
}

.auth-btn.current-page:hover {
  background: var(--accent-color);
  transform: none;
}

/* ИСПРАВЛЕНО: Фоновые изображения с cover и без рамок */
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
  object-fit: cover; /* ИСПРАВЛЕНО: cover вместо contain */
  object-position: center;
}

/* Остальные стили остаются без изменений */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  position: relative;
  z-index: 10;
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
  background: var(--accent-color);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-item:hover::after {
  width: 60%;
}

.nav-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
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

.auth-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 4rem 2rem;
  position: relative;
  z-index: 1;
}

.auth-container {
  width: 100%;
  max-width: 400px;
}

.auth-card-wrapper {
  padding: 3rem 0;
}

.auth-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 3rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.auth-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.auth-card h2 {
  text-align: center;
  margin-bottom: 2.5rem;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1.8rem;
  font-weight: 600;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.form-group label {
  color: var(--text-primary);
  font-weight: 500;
  font-family: inherit;
  font-size: 1rem;
}

.form-group input {
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: inherit;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(59, 31, 161, 0.1);
}

.auth-submit-btn {
  color: white;
  border: none;
  padding: 16px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  margin-top: 1.5rem;
}

.auth-link {
  text-align: center;
  margin-top: 2rem;
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 1rem;
}

.auth-link span {
  color: var(--accent-color);
  cursor: pointer;
  text-decoration: underline;
  font-weight: 500;
  transition: color 0.3s ease;
}

.auth-link span:hover {
  color: var(--accent-hover);
}

.theme-dark {
  --logo-invert: 1;
}

.theme-light {
  --logo-invert: 0;
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
  
  .auth-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  
  .background-image {
    opacity: 0.1;
  }
  
  .auth-content {
    padding: 2rem 1rem;
  }
  
  .auth-card-wrapper {
    padding: 2rem 0;
  }
  
  .auth-card {
    padding: 2rem;
    border-radius: 16px;
  }
  
  .auth-card h2 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .auth-form {
    gap: 1.5rem;
  }
  
  .form-group input {
    padding: 12px;
  }
  
  .auth-submit-btn {
    padding: 14px;
    font-size: 1rem;
  }
}
</style>