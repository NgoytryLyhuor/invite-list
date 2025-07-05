import { createRouter, createWebHistory } from 'vue-router'
import RothView from '../views/RothView.vue'
import HuorView from '@/views/HuorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'roth',
      component: RothView,
    },
    {
      path: '/huor',
      name: 'huor',
      component: HuorView,
    }
  ],
})

export default router
