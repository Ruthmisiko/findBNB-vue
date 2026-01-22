<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="container">
        <h1>Add New Airbnb</h1>
        <router-link to="/admin/airbnbs" class="btn btn-secondary">← Back to List</router-link>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <div class="form-card">
          <form @submit.prevent="handleSubmit">
            <div v-if="error" class="error-message">{{ error }}</div>
            <div v-if="success" class="success-message">{{ success }}</div>

            <div class="form-group">
              <label for="name">Property Name *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="form-control"
                required
                placeholder="e.g., Cozy Apartment in Nairobi"
              />
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                id="description"
                v-model="form.description"
                class="form-control"
                rows="4"
                placeholder="Describe the property..."
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="county_id">County *</label>
                <select
                  id="county_id"
                  v-model="form.county_id"
                  class="form-control"
                  required
                  @change="loadAreas"
                >
                  <option value="">Select County</option>
                  <option v-for="county in counties" :key="county.id" :value="county.id">
                    {{ county.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="area_id">Area *</label>
                <select
                  id="area_id"
                  v-model="form.area_id"
                  class="form-control"
                  required
                  :disabled="!form.county_id || areas.length === 0"
                >
                  <option value="">{{ areas.length === 0 && form.county_id ? 'No areas available' : 'Select Area' }}</option>
                  <option v-for="area in areas" :key="area.id" :value="area.id">
                    {{ area.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="host_id">Host *</label>
                <select
                  id="host_id"
                  v-model="form.host_id"
                  class="form-control"
                  required
                >
                  <option value="">Select Host</option>
                  <option v-for="host in hosts" :key="host.id" :value="host.id">
                    {{ host.full_name }} - {{ host.phone_number }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="room_type_id">Room Type *</label>
                <select
                  id="room_type_id"
                  v-model="form.room_type_id"
                  class="form-control"
                  required
                >
                  <option value="">Select Room Type</option>
                  <option v-for="roomType in roomTypes" :key="roomType.id" :value="roomType.id">
                    {{ roomType.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="price">Price per Night (KES) *</label>
              <input
                id="price"
                v-model.number="form.price"
                type="number"
                class="form-control"
                required
                min="0"
                step="0.01"
                placeholder="5000"
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading">Creating...</span>
                <span v-else>Create Airbnb</span>
              </button>
              <router-link to="/admin/airbnbs" class="btn btn-secondary">Cancel</router-link>
            </div>
          </form>
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

const form = ref({
  name: '',
  description: '',
  area_id: '',
  county_id: '',
  host_id: '',
  room_type_id: '',
  price: ''
})

const counties = ref([])
const areas = ref([])
const hosts = ref([])
const roomTypes = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')

const loadCounties = async () => {
  try {
    const res = await api.get('/counties')
    const data = res.data.data
    counties.value = data?.data || data || []
  } catch (err) {
    console.error('Error loading counties:', err)
  }
}

const loadAreas = async () => {
  if (!form.value.county_id) {
    areas.value = []
    form.value.area_id = ''
    return
  }
  try {
    const res = await api.get(`/counties/${form.value.county_id}/areas`)
    areas.value = res.data.data || []
  } catch (err) {
    console.error('Error loading areas:', err)
    areas.value = []
  }
}

const loadHosts = async () => {
  try {
    const res = await api.get('/host-details')
    hosts.value = res.data.data || []
  } catch (err) {
    console.error('Error loading hosts:', err)
  }
}

const loadRoomTypes = async () => {
  try {
    const res = await api.get('/room-types')
    roomTypes.value = res.data.data || []
  } catch (err) {
    console.error('Error loading room types:', err)
  }
}

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    // Only send area_id, not county_id
    const { county_id, ...submitData } = form.value
    await api.post('/airbnbs', submitData)
    success.value = 'Airbnb created successfully!'
    setTimeout(() => {
      router.push('/admin/airbnbs')
    }, 1500)
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to create Airbnb'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const isAuth = await checkAuth()
  if (!isAuth) {
    router.push('/admin/login')
  } else {
    await Promise.all([loadCounties(), loadHosts(), loadRoomTypes()])
  }
})
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.page-header {
  background: white;
  padding: 2rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.page-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-content {
  padding: 2rem 0;
}

.form-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  max-width: 800px;
  margin: 0 auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid #fcc;
}

.success-message {
  background: #efe;
  color: #3c3;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid #cfc;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .page-header .container {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
