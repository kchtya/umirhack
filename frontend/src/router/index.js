import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import EditorView from '../views/EditorView.vue'
import TemplatesView from '../views/TemplatesView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AccountView from '../views/AccountView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: LandingView
  },
  {
    path: '/editor',
    name: 'Editor', 
    component: EditorView
  },
  {
    path: '/templates',
    name: 'Templates',
    component: TemplatesView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register', 
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/account',
    name: 'Account',
    component: AccountView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router