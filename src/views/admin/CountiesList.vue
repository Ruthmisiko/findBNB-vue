<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="container">
        <h1>Counties & Areas Management</h1>
        <router-link to="/admin/counties/add" class="btn btn-primary">+ Add New County</router-link>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <div v-if="loading" class="loading">Loading counties...</div>
        <div v-else-if="error" class="error-state">{{ error }}</div>
        <div v-else-if="counties.length === 0" class="empty-state">
          <p>No counties found. <router-link to="/admin/counties/add">Add your first one</router-link></p>
        </div>
        <div v-else>
          <div v-for="county in counties" :key="county.id" class="county-card">
            <div class="county-header">
              <div>
                <h3>{{ county.name }}</h3>
                <p v-if="county.description">{{ county.description }}</p>
                <p class="areas-count">{{ county.areas?.length || 0 }} Areas</p>
              </div>
              <div class="county-actions">
                <button class="btn-sm btn-primary" @click="showAddArea(county.id)">+ Add Area</button>
                <button class="btn-sm btn-danger" @click="deleteCounty(county.id)">Delete</button>
              </div>
            </div>
            
            <div v-if="county.areas && county.areas.length > 0" class="areas-list">
              <table class="areas-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Area Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="area in county.areas" :key="area.id">
                    <td>{{ area.id }}</td>
                    <td>{{ area.name }}</td>
                    <td>
                      <button class="btn-sm btn-danger" @click="deleteArea(area.id, county.id)">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Area Modal -->
    <div v-if="showAreaModal" class="modal-overlay" @click="closeAreaModal">
      <div class="modal-content" @click.stop>
        <h3>Add New Area to {{ getCountyName(selectedCountyId) }}</h3>
        <form @submit.prevent="handleAddArea">
          <div class="form-group">
            <label>Area Name *</label>
            <input v-model="newAreaName" type="text" class="form-control" required />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="loading">Add Area</button>
            <button type="button" class="btn btn-secondary" @click="closeAreaModal">Cancel</button>
          </div>
        </form>
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

const counties = ref([])
const loading = ref(false)
const error = ref('')
const showAreaModal = ref(false)
const selectedCountyId = ref(null)
const newAreaName = ref('')

const getCountyName = (id) => {
  const county = counties.value.find(c => c.id === id)
  return county?.name || ''
}

const loadCounties = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await api.get('/counties')
    const data = res.data.data
    const countiesData = data?.data || data || []
    
    // Load areas for each county
    for (const county of countiesData) {
      try {
        const areasRes = await api.get(`/counties/${county.id}/areas`)
        county.areas = areasRes.data.data || []
      } catch (err) {
        county.areas = []
      }
    }
    
    counties.value = countiesData
  } catch (err) {
    error.value = 'Failed to load counties'
    console.error('Error loading counties:', err)
  } finally {
    loading.value = false
  }
}

const showAddArea = (countyId) => {
  selectedCountyId.value = countyId
  newAreaName.value = ''
  showAreaModal.value = true
}

const closeAreaModal = () => {
  showAreaModal.value = false
  selectedCountyId.value = null
  newAreaName.value = ''
}

const handleAddArea = async () => {
  try {
    await api.post('/areas', {
      name: newAreaName.value,
      county_id: selectedCountyId.value
    })
    closeAreaModal()
    await loadCounties()
  } catch (err) {
    alert('Failed to add area')
    console.error('Error adding area:', err)
  }
}

const deleteCounty = async (id) => {
  if (!confirm('Are you sure you want to delete this county and all its areas?')) return
  
  try {
    await api.delete(`/counties/${id}`)
    await loadCounties()
  } catch (err) {
    alert('Failed to delete county')
    console.error('Error deleting county:', err)
  }
}

const deleteArea = async (areaId, countyId) => {
  if (!confirm('Are you sure you want to delete this area?')) return
  
  try {
    await api.delete(`/areas/${areaId}`)
    await loadCounties()
  } catch (err) {
    alert('Failed to delete area')
    console.error('Error deleting area:', err)
  }
}

onMounted(async () => {
  const isAuth = await checkAuth()
  if (!isAuth) {
    router.push('/admin/login')
  } else {
    await loadCounties()
  }
})
</script>

<style scoped>
.county-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
}

.county-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.county-header h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.county-header p {
  color: #666;
  margin-bottom: 0.5rem;
}

.areas-count {
  color: #667eea;
  font-weight: 600;
}

.county-actions {
  display: flex;
  gap: 0.5rem;
}

.areas-list {
  margin-top: 1rem;
}

.areas-table {
  width: 100%;
  border-collapse: collapse;
}

.areas-table th,
.areas-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.areas-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
}

.modal-content h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

@media (max-width: 768px) {
  .county-header {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
