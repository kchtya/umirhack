import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import EditorView from '../views/EditorView.vue'
import TemplatesView from '../views/TemplatesView.vue' // Добавляем импорт

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
    path: '/templates', // Добавляем новый маршрут
    name: 'Templates',
    component: TemplatesView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router