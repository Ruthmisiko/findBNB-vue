<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <div class="container">
        <div class="header-content">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {{ user?.name || 'Admin' }}</p>
          </div>
          <button class="btn btn-secondary" @click="handleLogout">
            Logout
          </button>
        </div>
      </div>
    </div>

    <div class="dashboard-nav">
      <div class="container">
        <nav class="admin-nav">
          <router-link to="/admin/dashboard" class="nav-item" active-class="active">
            Dashboard
          </router-link>
          <router-link to="/admin/airbnbs" class="nav-item" active-class="active">
            Airbnbs
          </router-link>
          <router-link to="/admin/hosts" class="nav-item" active-class="active">
            Hosts
          </router-link>
          <router-link to="/admin/room-types" class="nav-item" active-class="active">
            Room Types
          </router-link>
          <router-link to="/admin/counties" class="nav-item" active-class="active">
            Counties
          </router-link>
        </nav>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🏠</div>
            <div class="stat-info">
              <h3>{{ stats.airbnbs }}</h3>
              <p>Total Airbnbs</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👤</div>
            <div class="stat-info">
              <h3>{{ stats.hosts }}</h3>
              <p>Total Hosts</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🛏️</div>
            <div class="stat-info">
              <h3>{{ stats.roomTypes }}</h3>
              <p>Room Types</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📍</div>
            <div class="stat-info">
              <h3>{{ stats.counties }}</h3>
              <p>Counties</p>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <router-link to="/admin/airbnbs/add" class="action-card">
              <div class="action-icon">➕</div>
              <h3>Add New Airbnb</h3>
              <p>Create a new property listing</p>
            </router-link>
            <router-link to="/admin/hosts/add" class="action-card">
              <div class="action-icon">👤</div>
              <h3>Add New Host</h3>
              <p>Register a new host</p>
            </router-link>
            <router-link to="/admin/room-types/add" class="action-card">
              <div class="action-icon">🛏️</div>
              <h3>Add Room Type</h3>
              <p>Create a new room type</p>
            </router-link>
            <router-link to="/admin/counties/add" class="action-card">
              <div class="action-icon">📍</div>
              <h3>Add County</h3>
              <p>Add a new county</p>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import api from '../../api/api'

const router = useRouter()
const { user, logout, checkAuth } = useAuth()

const stats = ref({
  airbnbs: 0,
  hosts: 0,
  roomTypes: 0,
  counties: 0
})

const loadStats = async () => {
  try {
    const [airbnbsRes, hostsRes, roomTypesRes, countiesRes] = await Promise.all([
      api.get('/airbnbs'),
      api.get('/host-details'),
      api.get('/room-types'),
      api.get('/counties')
    ])

    stats.value.airbnbs = airbnbsRes.data.data?.total || airbnbsRes.data.data?.data?.length || 0
    stats.value.hosts = hostsRes.data.data?.length || 0
    stats.value.roomTypes = roomTypesRes.data.data?.length || 0
    stats.value.counties = countiesRes.data.data?.data?.length || countiesRes.data.data?.length || 0
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const handleLogout = async () => {
  await logout()
  router.push('/admin/login')
}

onMounted(async () => {
  const isAuth = await checkAuth()
  if (!isAuth) {
    router.push('/admin/login')
  } else {
    loadStats()
  }
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f8f9fa;
}

.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

.header-content p {
  opacity: 0.9;
}

.dashboard-nav {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 0;
}

.admin-nav {
  display: flex;
  gap: 0;
  overflow-x: auto;
}

.nav-item {
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
  white-space: nowrap;
}

.nav-item:hover {
  color: #667eea;
  background: #f8f9fa;
}

.nav-item.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.dashboard-content {
  padding: 2rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.stat-icon {
  font-size: 3rem;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
}

.stat-info h3 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.25rem;
}

.stat-info p {
  color: #666;
  font-size: 0.9rem;
}

.quick-actions h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.action-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.action-card h3 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.action-card p {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .stats-grid,
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
