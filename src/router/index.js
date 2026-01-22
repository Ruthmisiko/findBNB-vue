import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import Search from '../views/Search.vue'
import Results from '../views/Results.vue'

const routes = [
  { path: '/', component: Landing },
  { path: '/search', component: Search },
  { path: '/results', component: Results }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
