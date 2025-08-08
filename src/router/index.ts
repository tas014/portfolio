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
      path: '/projects',
      name: 'projects',
      component: () => import('../views/Projects-View.vue'),
    },
    {
      path: '/projects/chess',
      name: 'chess project',
      component: () => import('../views/projects/ChessView.vue'),
    },
    {
      path: '/projects/readings',
      name: 'readings project',
      component: () => import('../views/projects/ReadingsView.vue'),
    },
  ],
})

export default router
