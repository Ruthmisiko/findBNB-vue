<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="container">
        <h1>Airbnbs Management</h1>
        <router-link to="/admin/airbnbs/add" class="btn btn-primary">+ Add New Airbnb</router-link>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <div v-if="loading" class="loading">Loading airbnbs...</div>
        <div v-else-if="error" class="error-state">{{ error }}</div>
        <div v-else-if="airbnbs.length === 0" class="empty-state">
          <p>No airbnbs found. <router-link to="/admin/airbnbs/add">Add your first one</router-link></p>
        </div>
        <div v-else class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Area</th>
                <th>Host</th>
                <th>Room Type</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="airbnb in airbnbs" :key="airbnb.id">
                <td>{{ airbnb.id }}</td>
                <td>{{ airbnb.name }}</td>
                <td>{{ airbnb.area?.name || 'N/A' }}</td>
                <td>{{ airbnb.host?.full_name || 'N/A' }}</td>
                <td>{{ airbnb.room_type?.name || 'N/A' }}</td>
                <td>KES {{ formatPrice(airbnb.price) }}</td>
                <td>
                  <button class="btn-sm btn-danger" @click="deleteAirbnb(airbnb.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
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
const { checkAuth } = useAuth()

const airbnbs = ref([])
const loading = ref(false)
const error = ref('')

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-KE').format(price)
}

const loadAirbnbs = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await api.get('/airbnbs')
    const data = res.data.data
    airbnbs.value = data?.data || data || []
  } catch (err) {
    error.value = 'Failed to load airbnbs'
    console.error('Error loading airbnbs:', err)
  } finally {
    loading.value = false
  }
}

const deleteAirbnb = async (id) => {
  if (!confirm('Are you sure you want to delete this Airbnb?')) return
  
  try {
    await api.delete(`/airbnbs/${id}`)
    await loadAirbnbs()
  } catch (err) {
    alert('Failed to delete Airbnb')
    console.error('Error deleting airbnb:', err)
  }
}

onMounted(async () => {
  const isAuth = await checkAuth()
  if (!isAuth) {
    router.push('/admin/login')
  } else {
    await loadAirbnbs()
  }
})
</script>

<style scoped>
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.data-table tr:hover {
  background: #f8f9fa;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.85rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}
</style>
