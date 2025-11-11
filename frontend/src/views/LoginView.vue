<template>
  <div class="auth-page" :class="themeClass">
    <!-- Фоновые изображения -->
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
        
        <!-- ОБНОВЛЕНО: Всегда показываем обе кнопки -->
        <div class="nav-right">
          <div class="auth-buttons">
            <button class="auth-btn login-btn current-page">Войти</button>
            <button class="auth-btn register-btn" @click="goToRegister">Регистрация</button>
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

    <!-- ОБНОВЛЕНО: Основной контент в main -->
    <main class="main-content">
      <div class="auth-content">
        <div class="auth-container">
          <!-- ОБНОВЛЕНО: Добавлены отступы сверху и снизу для "дыхания" -->
          <div class="auth-card-wrapper">
            <div class="auth-card">
              <h2>Вход в аккаунт</h2>
              <form @submit.prevent="handleLogin" class="auth-form">
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" v-model="email" required>
                </div>
                <div class="form-group">
                  <label>Пароль</label>
                  <input type="password" v-model="password" required>
                </div>
                <button type="submit" class="auth-submit-btn">Войти</button>
              </form>
              <p class="auth-link">
                Нет аккаунта? <span @click="goToRegister">Зарегистрироваться</span>
              </p>
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
import { computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { storeToRefs } from 'pinia'
import AppFooter from '../components/AppFooter.vue' // ДОБАВЛЕН ИМПОРТ

export default {
  name: 'LoginView',
  components: {
    AppFooter // ДОБАВЛЕН КОМПОНЕНТ
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

    const goToRegister = () => {
      router.push('/register')
    }

    const handleLogin = () => {
      console.log('Login attempt')
      router.push('/editor')
    }

    return {
      isDark,
      themeClass,
      goToHome,
      goToEditor,
      goToTemplates,
      goToRegister,
      toggleThemeWithRipple,
      handleLogin
    }
  },
  data() {
    return {
      email: '',
      password: ''
    }
  }
}
</script>

<style scoped>
/* ОБНОВЛЕНО: Flexbox layout для прижатия подвала к низу */
.auth-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  color: var(--text-primary);
  position: relative;
}

/* ОБНОВЛЕНО: Основной контент занимает все доступное пространство */
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

/* Фоновые изображения */
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
  object-fit: contain;
  object-position: top center;
}

/* Навигация */
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
  filter: invert(var(--logo-invert, 0)); /* Эта строка инвертирует лого */
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
  background: #3b1fa1;
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

/* ОБНОВЛЕНО: Контент авторизации с увеличенными отступами */
.auth-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 4rem 2rem; /* Увеличили отступы сверху и снизу */
  position: relative;
  z-index: 1;
}

.auth-container {
  width: 100%;
  max-width: 400px;
}

/* ОБНОВЛЕНО: Добавлен wrapper для дополнительного "дыхания" */
.auth-card-wrapper {
  padding: 3rem 0; /* Дополнительные отступы сверху и снизу */
}

.auth-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px; /* Увеличили радиус скругления */
  padding: 3rem; /* Увеличили внутренние отступы */
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); /* Добавили тень для глубины */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.auth-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.auth-card h2 {
  text-align: center;
  margin-bottom: 2.5rem; /* Увеличили отступ снизу */
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1.8rem; /* Увеличили размер шрифта */
  font-weight: 600;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 2rem; /* Увеличили расстояние между полями */
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem; /* Увеличили расстояние между label и input */
}

.form-group label {
  color: var(--text-primary);
  font-weight: 500;
  font-family: inherit;
  font-size: 1rem;
}

.form-group input {
  padding: 15px; /* Увеличили padding для большего комфорта */
  border: 1px solid var(--border-color);
  border-radius: 10px; /* Увеличили радиус скругления */
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: inherit;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #3b1fa1;
  box-shadow: 0 0 0 3px rgba(59, 31, 161, 0.1); /* Добавили свечение при фокусе */
}

.auth-submit-btn {
  background: #3b1fa1;
  color: white;
  border: none;
  padding: 16px; /* Увеличили padding */
  border-radius: 10px; /* Увеличили радиус скругления */
  font-size: 1.1rem; /* Увеличили размер шрифта */
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  margin-top: 1.5rem; /* Увеличили отступ сверху */
}

.auth-submit-btn:hover {
  background: #4dabf7;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(59, 31, 161, 0.3);
}

.auth-link {
  text-align: center;
  margin-top: 2rem; /* Увеличили отступ сверху */
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 1rem;
}

.auth-link span {
  color: #3b1fa1;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 500;
  transition: color 0.3s ease;
}

.auth-link span:hover {
  color: #4dabf7;
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
    padding: 2rem 1rem; /* Адаптивные отступы для мобильных */
  }
  
  .auth-card-wrapper {
    padding: 2rem 0; /* Меньшие отступы на мобильных */
  }
  
  .auth-card {
    padding: 2rem; /* Меньшие внутренние отступы на мобильных */
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