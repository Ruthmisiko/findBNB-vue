import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import Search from '../views/Search.vue'
import Results from '../views/Results.vue'
import AirbnbDetail from '../views/AirbnbDetail.vue'
import AdminLogin from '../views/admin/AdminLogin.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AirbnbsList from '../views/admin/AirbnbsList.vue'
import AddAirbnb from '../views/admin/AddAirbnb.vue'
import HostsList from '../views/admin/HostsList.vue'
import AddHost from '../views/admin/AddHost.vue'
import RoomTypesList from '../views/admin/RoomTypesList.vue'
import AddRoomType from '../views/admin/AddRoomType.vue'
import CountiesList from '../views/admin/CountiesList.vue'
import AddCounty from '../views/admin/AddCounty.vue'
import { useAuth } from '../composables/useAuth'

const routes = [
  { path: '/', component: Landing },
  { path: '/search', component: Search },
  { path: '/results', component: Results },
  { path: '/airbnb/:id', component: AirbnbDetail, name: 'airbnb-detail' },
  { path: '/admin/login', component: AdminLogin },
  { 
    path: '/admin/dashboard', 
    component: AdminDashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: '/admin/airbnbs', 
    component: AirbnbsList,
    meta: { requiresAuth: true }
  },
  { 
    path: '/admin/airbnbs/add', 
    component: AddAirbnb,
    meta: { requiresAuth: true }
  },
  { 
    path: '/admin/hosts', 
    component: HostsList,
    meta: { requiresAuth: true }
  },
  { 
    path: '/admin/hosts/add', 
    component: AddHost,
    meta: { requiresAuth: true }
  },
  { 
    path: '/admin/room-types', 
    component: RoomTypesList,
    meta: { requiresAuth: true }
  },
  { 
    path: '/admin/room-types/add', 
    component: AddRoomType,
    meta: { requiresAuth: true }
  },
  { 
    path: '/admin/counties', 
    component: CountiesList,
    meta: { requiresAuth: true }
  },
  { 
    path: '/admin/counties/add', 
    component: AddCounty,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const { checkAuth } = useAuth()
    const isAuth = await checkAuth()
    if (!isAuth) {
      next('/admin/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
