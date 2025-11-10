import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import EditorView from '../views/EditorView.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router