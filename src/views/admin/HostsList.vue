<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="container">
        <h1>Hosts Management</h1>
        <router-link to="/admin/hosts/add" class="btn btn-primary">+ Add New Host</router-link>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <div v-if="loading" class="loading">Loading hosts...</div>
        <div v-else-if="error" class="error-state">{{ error }}</div>
        <div v-else-if="hosts.length === 0" class="empty-state">
          <p>No hosts found. <router-link to="/admin/hosts/add">Add your first one</router-link></p>
        </div>
        <div v-else class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Phone</th>
                <th>Alt Phone</th>
                <th>Email</th>
                <th>ID Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="host in hosts" :key="host.id">
                <td>{{ host.id }}</td>
                <td>{{ host.full_name }}</td>
                <td>{{ host.phone_number }}</td>
                <td>{{ host.alt_phone_number || '-' }}</td>
                <td>{{ host.email || '-' }}</td>
                <td>{{ host.id_number || '-' }}</td>
                <td>
                  <button class="btn-sm btn-danger" @click="deleteHost(host.id)">Delete</button>
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

const hosts = ref([])
const loading = ref(false)
const error = ref('')

const loadHosts = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await api.get('/host-details')
    hosts.value = res.data.data || []
  } catch (err) {
    error.value = 'Failed to load hosts'
    console.error('Error loading hosts:', err)
  } finally {
    loading.value = false
  }
}

const deleteHost = async (id) => {
  if (!confirm('Are you sure you want to delete this host?')) return
  
  try {
    await api.delete(`/host-details/${id}`)
    await loadHosts()
  } catch (err) {
    alert('Failed to delete host')
    console.error('Error deleting host:', err)
  }
}

onMounted(async () => {
  const isAuth = await checkAuth()
  if (!isAuth) {
    router.push('/admin/login')
  } else {
    await loadHosts()
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
