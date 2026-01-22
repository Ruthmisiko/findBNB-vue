<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="container">
        <h1>Room Types Management</h1>
        <router-link to="/admin/room-types/add" class="btn btn-primary">+ Add New Room Type</router-link>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <div v-if="loading" class="loading">Loading room types...</div>
        <div v-else-if="error" class="error-state">{{ error }}</div>
        <div v-else-if="roomTypes.length === 0" class="empty-state">
          <p>No room types found. <router-link to="/admin/room-types/add">Add your first one</router-link></p>
        </div>
        <div v-else class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="roomType in roomTypes" :key="roomType.id">
                <td>{{ roomType.id }}</td>
                <td>{{ roomType.name }}</td>
                <td>{{ roomType.description || '-' }}</td>
                <td>
                  <button class="btn-sm btn-danger" @click="deleteRoomType(roomType.id)">Delete</button>
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

const roomTypes = ref([])
const loading = ref(false)
const error = ref('')

const loadRoomTypes = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await api.get('/room-types')
    roomTypes.value = res.data.data || []
  } catch (err) {
    error.value = 'Failed to load room types'
    console.error('Error loading room types:', err)
  } finally {
    loading.value = false
  }
}

const deleteRoomType = async (id) => {
  if (!confirm('Are you sure you want to delete this room type?')) return
  
  try {
    await api.delete(`/room-types/${id}`)
    await loadRoomTypes()
  } catch (err) {
    alert('Failed to delete room type')
    console.error('Error deleting room type:', err)
  }
}

onMounted(async () => {
  const isAuth = await checkAuth()
  if (!isAuth) {
    router.push('/admin/login')
  } else {
    await loadRoomTypes()
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
