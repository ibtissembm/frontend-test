import { createRouter, createWebHistory } from 'vue-router'
import CharacterList from '@/components/CharacterList.vue'
import CharacterDetail from '@/components/CharacterDetail.vue'
import NotFound from '@/components/NotFound.vue'

const routes = [
  { path: '/', redirect: '/characters' },
  { path: '/characters', component: CharacterList },
  { path: '/characters/:id', component: CharacterDetail },
  { path: '/:pathMatch(.*)*', component: NotFound } //
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
