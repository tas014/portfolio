import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/projects/chess-app',
      name: 'Chess Project',
      component: () => import('../views/projects/ChessView.vue'),
    },
    {
      path: '/projects/energy-app',
      name: 'Energy Project',
      component: () => import('../views/projects/ReadingsView.vue'),
    },
  ],
})

export default router
