<template>
  <footer class="footer" :class="themeClass">
    <div class="footer-content">
      <div class="footer-section">
        <div class="footer-logo">
          <img src="@/assets/images/logo.svg" alt="Digitalize" class="footer-logo-svg">
          <span class="footer-brand">TETRY</span>
        </div>
        <p class="footer-description">
          Визуальный конструктор для создания современных лендингов
        </p>
        <div class="footer-social">
          <a href="#" class="social-link" title="Telegram">
            <span>📱</span>
          </a>
          <a href="#" class="social-link" title="VK">
            <span>👥</span>
          </a>
          <a href="#" class="social-link" title="GitHub">
            <span>💻</span>
          </a>
        </div>
      </div>

      <div class="footer-section">
        <h3 class="footer-heading">Навигация</h3>
        <ul class="footer-links">
          <li><a @click="goToHome" class="footer-link">Главная</a></li>
          <li><a @click="goToEditor" class="footer-link">Конструктор</a></li>
          <li><a @click="goToTemplates" class="footer-link">Шаблоны</a></li>
          <li><a @click="goToLogin" class="footer-link">Войти</a></li>
          <li><a @click="goToRegister" class="footer-link">Регистрация</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h3 class="footer-heading">Ресурсы</h3>
        <ul class="footer-links">
          <li><a href="#" class="footer-link">Документация</a></li>
          <li><a href="#" class="footer-link">Блог</a></li>
          <li><a href="#" class="footer-link">Поддержка</a></li>
          <li><a href="#" class="footer-link">Статус</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h3 class="footer-heading">Контакты</h3>
        <ul class="footer-links">
          <li class="footer-contact">
            <span>📧</span>
            <span>support@digitalize.ru</span>
          </li>
          <li class="footer-contact">
            <span>📞</span>
            <span>+7 (999) 123-45-67</span>
          </li>
          <li class="footer-contact">
            <span>📍</span>
            <span>Москва, Россия</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <p class="footer-copyright">
          © 2025 TETRY. Все права защищены.
        </p>
        <div class="footer-legal">
          <a href="#" class="footer-legal-link">Политика конфиденциальности</a>
          <a href="#" class="footer-legal-link">Условия использования</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { storeToRefs } from 'pinia'

export default {
  name: 'AppFooter',
  setup() {
    const router = useRouter()
    const themeStore = useThemeStore()
    const { isDark } = storeToRefs(themeStore)

    const themeClass = computed(() => isDark.value ? 'theme-dark' : 'theme-light')

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

    const goToRegister = () => {
      router.push('/register')
    }

    return {
      themeClass,
      goToHome,
      goToEditor,
      goToTemplates,
      goToLogin,
      goToRegister
    }
  }
}
</script>

<style scoped>
.footer {
  background: transparent !important; /* Прозрачный фон */
  border-top: 1px solid var(--border-color);
  margin-top: auto;
  position: relative;
  z-index: 10;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.footer-logo-svg {
  width: 40px;
  height: 40px;
  filter: invert(var(--logo-invert, 0));
}

.footer-brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  font-family: 'Press Start 2P', monospace;
}

.footer-description {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.9rem;
  max-width: 300px;
}

.footer-social {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.social-link {
  color: var(--text-tertiary);
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 8px;
  background: var(--bg-tertiary);
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.social-link:hover {
  color: var(--text-primary);
  background: var(--hover-color);
  transform: translateY(-2px);
}

.footer-heading {
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  font-size: 0.9rem;
}

.footer-link:hover {
  color: var(--text-primary);
  transform: translateX(5px);
}

.footer-contact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding: 1.5rem 0;
  background: transparent !important; /* Прозрачный фон */
}

.footer-bottom-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-copyright {
  color: var(--text-tertiary);
  font-size: 0.8rem;
  margin: 0;
}

.footer-legal {
  display: flex;
  gap: 2rem;
}

.footer-legal-link {
  color: var(--text-tertiary);
  text-decoration: none;
  font-size: 0.8rem;
  transition: color 0.3s ease;
}

.footer-legal-link:hover {
  color: var(--text-secondary);
}

.theme-dark {
  --logo-invert: 1;
}

.theme-light {
  --logo-invert: 0;
}

/* Адаптивность */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem 1rem;
  }

  .footer-bottom-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .footer-legal {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .footer-content {
    padding: 1.5rem 1rem;
  }

  .footer-brand {
    font-size: 1.2rem;
  }
}
</style>