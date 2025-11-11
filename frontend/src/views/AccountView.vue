<template>
  <div class="account-page" :class="themeClass">
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
            <button class="auth-btn account-btn current-page">Аккаунт</button>
            <button class="auth-btn logout-btn" @click="handleLogout">Выйти</button>
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

    <!-- Основной контент -->
    <main class="main-content">
      <div class="account-content">
        <div class="account-container">
          <div class="account-header">
            <h1>Мой аккаунт</h1>
            <p>Управление вашим профилем и настройками</p>
          </div>

          <div class="account-grid">
            <!-- Левая колонка - информация профиля -->
            <div class="profile-section">
              <div class="profile-card">
                <div class="profile-avatar">
                  <div class="avatar-placeholder">
                    <User :size="48" />
                  </div>
                  <button class="change-avatar-btn">Изменить фото</button>
                </div>
                
                <div class="profile-info">
                  <h2>{{ user.name || 'Пользователь' }}</h2>
                  <p class="user-email">{{ user.email || 'user@example.com' }}</p>
                  <p class="user-join-date">Участник с {{ user.joinDate || 'января 2024' }}</p>
                </div>

                <div class="profile-stats">
                  <div class="stat-item">
                    <span class="stat-number">{{ user.projectsCount || 0 }}</span>
                    <span class="stat-label">Проектов</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ user.templatesUsed || 0 }}</span>
                    <span class="stat-label">Шаблонов</span>
                  </div>
                </div>
              </div>

              <!-- Быстрые действия -->
              <div class="quick-actions">
                <h3>Быстрые действия</h3>
                <div class="action-buttons">
                  <button @click="goToEditor" class="action-btn primary">
                    <Plus :size="20" />
                    Новый проект
                  </button>
                  <button @click="goToTemplates" class="action-btn secondary">
                    <Layout :size="20" />
                    Шаблоны
                  </button>
                </div>
              </div>
            </div>

            <!-- Правая колонка - настройки -->
            <div class="settings-section">
              <!-- Личная информация -->
              <div class="settings-card">
                <h3>Личная информация</h3>
                <form @submit.prevent="updateProfile" class="settings-form">
                  <div class="form-row">
                    <div class="form-group">
                      <label>Имя</label>
                      <input 
                        type="text" 
                        v-model="user.name"
                        placeholder="Введите ваше имя"
                      >
                    </div>
                    <div class="form-group">
                      <label>Email</label>
                      <input 
                        type="email" 
                        v-model="user.email"
                        placeholder="Введите ваш email"
                      >
                    </div>
                  </div>
                  <div class="form-group">
                    <label>О себе</label>
                    <textarea 
                      v-model="user.bio"
                      placeholder="Расскажите о себе..."
                      rows="3"
                    ></textarea>
                  </div>
                  <button type="submit" class="save-btn">Сохранить изменения</button>
                </form>
              </div>

              <!-- Настройки безопасности -->
              <div class="settings-card">
                <h3>Безопасность</h3>
                <div class="security-actions">
                  <button @click="changePassword" class="security-btn">
                    <Lock :size="18" />
                    Сменить пароль
                  </button>
                  <button @click="enable2FA" class="security-btn">
                    <Shield :size="18" />
                    Двухфакторная аутентификация
                  </button>
                </div>
              </div>

              <!-- Настройки уведомлений -->
              <div class="settings-card">
                <h3>Уведомления</h3>
                <div class="notification-settings">
                  <div class="notification-item">
                    <label>Email уведомления</label>
                    <input type="checkbox" v-model="notifications.email" class="toggle">
                  </div>
                  <div class="notification-item">
                    <label>Новые функции</label>
                    <input type="checkbox" v-model="notifications.productUpdates" class="toggle">
                  </div>
                  <div class="notification-item">
                    <label>Специальные предложения</label>
                    <input type="checkbox" v-model="notifications.promotions" class="toggle">
                  </div>
                </div>
              </div>

              <!-- Опасная зона -->
              <div class="settings-card danger-zone">
                <h3>Опасная зона</h3>
                <p>Эти действия необратимы. Пожалуйста, будьте осторожны.</p>
                <div class="danger-actions">
                  <button @click="exportData" class="danger-btn warning">
                    <Download :size="18" />
                    Экспорт данных
                  </button>
                  <button @click="deleteAccount" class="danger-btn danger">
                    <Trash2 :size="18" />
                    Удалить аккаунт
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Подвал -->
    <AppFooter />
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { storeToRefs } from 'pinia'
import AppFooter from '../components/AppFooter.vue'
import { 
  User, 
  Plus, 
  Layout, 
  Lock, 
  Shield, 
  Download, 
  Trash2 
} from 'lucide-vue-next'

export default {
  name: 'AccountView',
  components: {
    AppFooter,
    User,
    Plus,
    Layout,
    Lock,
    Shield,
    Download,
    Trash2
  },
  setup() {
    const router = useRouter()
    const themeStore = useThemeStore()
    const { isDark } = storeToRefs(themeStore)

    // Заглушки данных пользователя - потом заменим на реальные с бэкенда
    const user = ref({
      name: '',
      email: '',
      bio: '',
      joinDate: 'января 2024',
      projectsCount: 0,
      templatesUsed: 0
    })

    const notifications = ref({
      email: true,
      productUpdates: true,
      promotions: false
    })

    const themeClass = computed(() => isDark.value ? 'theme-dark' : 'theme-light')

    const toggleThemeWithRipple = (event) => {
      themeStore.toggleTheme()
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

    const handleLogout = () => {
      console.log('Logout')
      // Здесь будет логика выхода
      router.push('/')
    }

    const updateProfile = () => {
      console.log('Updating profile:', user.value)
      // Здесь будет API вызов для обновления профиля
    }

    const changePassword = () => {
      console.log('Change password')
      // Здесь будет логика смены пароля
    }

    const enable2FA = () => {
      console.log('Enable 2FA')
      // Здесь будет логика включения 2FA
    }

    const exportData = () => {
      console.log('Export data')
      // Здесь будет логика экспорта данных
    }

    const deleteAccount = () => {
      console.log('Delete account')
      // Здесь будет логика удаления аккаунта
    }

    return {
      isDark,
      themeClass,
      user,
      notifications,
      goToHome,
      goToEditor,
      goToTemplates,
      handleLogout,
      toggleThemeWithRipple,
      updateProfile,
      changePassword,
      enable2FA,
      exportData,
      deleteAccount
    }
  }
}
</script>

<style scoped>
.account-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
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
}

.nav-item:hover {
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
}

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
}

.theme-toggle:hover {
  background: var(--hover-color);
  transform: scale(1.05);
}

/* Основной контент */
.account-content {
  flex: 1;
  padding: 2rem 3rem;
}

.account-container {
  max-width: 1200px;
  margin: 0 auto;
}

.account-header {
  text-align: center;
  margin-bottom: 3rem;
}

.account-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #4dabf7 0%, #3b1fa1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.account-header p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.account-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

/* Профиль */
.profile-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
}

.profile-avatar {
  margin-bottom: 1.5rem;
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  background: var(--bg-tertiary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: var(--text-tertiary);
}

.change-avatar-btn {
  background: transparent;
  color: var(--accent-color);
  border: 1px solid var(--accent-color);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.change-avatar-btn:hover {
  background: var(--accent-color);
  color: white;
}

.profile-info h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.user-email {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.user-join-date {
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

.profile-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--accent-color);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-tertiary);
}

/* Быстрые действия */
.quick-actions {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
}

.quick-actions h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  font-family: inherit;
}

.action-btn.primary {
  background: var(--accent-color);
  color: white;
}

.action-btn.primary:hover {
  background: #4dabf7;
  transform: translateY(-2px);
}

.action-btn.secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.action-btn.secondary:hover {
  background: var(--hover-color);
  transform: translateY(-2px);
}

/* Настройки */
.settings-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
}

.settings-card h3 {
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--text-primary);
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(59, 31, 161, 0.1);
}

.save-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.save-btn:hover {
  background: #4dabf7;
  transform: translateY(-2px);
}

/* Безопасность */
.security-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.security-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.3s ease;
  font-family: inherit;
}

.security-btn:hover {
  background: var(--hover-color);
  transform: translateX(5px);
}

/* Уведомления */
.notification-settings {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
}

.notification-item:last-child {
  border-bottom: none;
}

.toggle {
  width: 50px;
  height: 24px;
  background: var(--bg-tertiary);
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  appearance: none;
  transition: all 0.3s ease;
}

.toggle:checked {
  background: var(--accent-color);
}

.toggle::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: all 0.3s ease;
}

.toggle:checked::before {
  transform: translateX(26px);
}

/* Опасная зона */
.danger-zone {
  border-color: #dc3545;
}

.danger-zone h3 {
  color: #dc3545;
}

.danger-zone p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.danger-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.danger-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  font-family: inherit;
}

.danger-btn.warning {
  background: #ffc107;
  color: #212529;
}

.danger-btn.warning:hover {
  background: #e0a800;
  transform: translateY(-2px);
}

.danger-btn.danger {
  background: #dc3545;
  color: white;
}

.danger-btn.danger:hover {
  background: #c82333;
  transform: translateY(-2px);
}

.theme-dark {
  --logo-invert: 1;
}

.theme-light {
  --logo-invert: 0;
}

/* Адаптивность */
@media (max-width: 768px) {
  .account-content {
    padding: 1rem;
  }
  
  .account-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
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
}
</style>