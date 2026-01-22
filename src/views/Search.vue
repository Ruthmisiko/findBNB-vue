<template>
  <div class="search-page">
    <div class="search-hero">
      <div class="container">
        <h1 class="search-title">Find Your Perfect Airbnb</h1>
        <p class="search-subtitle">Select a location to discover available properties</p>
        
        <div class="search-form">
          <div class="form-group">
            <label for="county">County</label>
            <select 
              id="county" 
              v-model="countyId" 
              @change="loadAreas"
              class="form-control"
              :disabled="loading"
            >
              <option value="">Select a County</option>
              <option v-for="c in counties" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="area">Area</label>
            <select 
              id="area" 
              v-model="areaId"
              class="form-control"
              :disabled="!countyId || loading || areas.length === 0"
            >
              <option value="">{{ areas.length === 0 && countyId ? 'No areas available' : 'Select an Area' }}</option>
              <option v-for="a in areas" :key="a.id" :value="a.id">
                {{ a.name }}
              </option>
            </select>
          </div>

          <button 
            class="btn btn-primary search-btn" 
            @click="searchAirbnbs"
            :disabled="!areaId || loading"
          >
            <span v-if="loading">Searching...</span>
            <span v-else>Search Airbnbs</span>
          </button>
        </div>
      </div>
    </div>

    <div class="search-info">
      <div class="container">
        <div class="info-content">
          <h2>How It Works</h2>
          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <h3>Choose County</h3>
              <p>Select the county where you want to stay</p>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <h3>Select Area</h3>
              <p>Pick a specific area within the county</p>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <h3>Browse Results</h3>
              <p>View all available Airbnbs in your chosen location</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/api'
import { useRouter } from 'vue-router'

const router = useRouter()

const counties = ref([])
const areas = ref([])
const countyId = ref('')
const areaId = ref('')
const loading = ref(false)

onMounted(async () => {
  try {
    loading.value = true
    const res = await api.get('/counties')
    const responseData = res.data.data
    // Handle paginated response (data.data) or direct array (data)
    counties.value = responseData?.data || responseData || []
  } catch (error) {
    console.error('Error loading counties:', error)
  } finally {
    loading.value = false
  }
})

const loadAreas = async () => {
  if (!countyId.value) {
    areas.value = []
    areaId.value = ''
    return
  }
  
  try {
    loading.value = true
    areaId.value = ''
    const res = await api.get(`/counties/${countyId.value}/areas`)
    areas.value = res.data.data || []
  } catch (error) {
    console.error('Error loading areas:', error)
    areas.value = []
  } finally {
    loading.value = false
  }
}

const searchAirbnbs = () => {
  if (areaId.value) {
    router.push({ path: '/results', query: { area_id: areaId.value } })
  }
}
</script>

<style scoped>
.search-page {
  min-height: 100vh;
}

.search-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
}

.search-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-align: center;
}

.search-subtitle {
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 3rem;
  opacity: 0.95;
}

.search-form {
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.search-form .form-group label {
  color: white;
  font-weight: 600;
}

.search-form .form-control {
  background: white;
  border: none;
  font-size: 1rem;
}

.search-form .form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 14px;
  font-size: 1.1rem;
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-info {
  padding: 4rem 2rem;
  background: white;
}

.info-content h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
  color: #333;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.step {
  text-align: center;
  padding: 2rem;
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1.5rem;
}

.step h3 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.step p {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .search-title {
    font-size: 2rem;
  }
  
  .search-form {
    padding: 2rem;
  }
  
  .steps {
    grid-template-columns: 1fr;
  }
}
</style>
