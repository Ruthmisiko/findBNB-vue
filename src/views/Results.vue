<template>
  <div class="results-page">
    <div class="results-header">
      <div class="container">
        <h1 class="results-title">Available Airbnbs</h1>
        <p v-if="searchArea" class="results-subtitle">
          Showing results for <strong>{{ searchArea }}</strong>
        </p>
        <button class="btn btn-secondary" @click="$router.push('/search')">
          ← New Search
        </button>
      </div>
    </div>

    <div class="container">
      <div v-if="loading" class="loading">
        <p>Loading available properties...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <h3>Oops! Something went wrong</h3>
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="loadAirbnbs">Try Again</button>
      </div>

      <div v-else-if="airbnbs.length === 0" class="empty-state">
        <div class="empty-icon">🏠</div>
        <h3>No Airbnbs Found</h3>
        <p>There are no available properties in this area at the moment.</p>
        <button class="btn btn-primary" @click="$router.push('/search')">
          Search Another Location
        </button>
      </div>

      <div v-else class="results-grid">
        <AirbnbCard
          v-for="airbnb in airbnbs"
          :key="airbnb.id"
          :airbnb="airbnb"
          @click="viewDetails(airbnb.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/api'
import AirbnbCard from '../components/AirbnbCard.vue'

const route = useRoute()
const router = useRouter()
const airbnbs = ref([])
const loading = ref(false)
const error = ref(null)
const areaName = ref('')

const searchArea = computed(() => {
  if (airbnbs.value.length > 0 && airbnbs.value[0].area) {
    return airbnbs.value[0].area.name
  }
  return areaName.value
})

const loadAirbnbs = async () => {
  if (!route.query.area_id) {
    error.value = 'No area selected'
    return
  }

  try {
    loading.value = true
    error.value = null
    
    const res = await api.get('/airbnbs', {
      params: { area_id: route.query.area_id }
    })
    
    const responseData = res.data.data
    // Handle paginated response (data.data) or direct array (data)
    airbnbs.value = responseData?.data || responseData || []
    
    // Get area name if available
    if (airbnbs.value.length > 0 && airbnbs.value[0].area) {
      areaName.value = airbnbs.value[0].area.name
    }
  } catch (err) {
    console.error('Error loading airbnbs:', err)
    error.value = 'Failed to load properties. Please try again.'
    airbnbs.value = []
  } finally {
    loading.value = false
  }
}

const viewDetails = (id) => {
  router.push(`/airbnb/${id}`)
}

onMounted(() => {
  loadAirbnbs()
})
</script>

<style scoped>
.results-page {
  min-height: 100vh;
  padding-bottom: 3rem;
}

.results-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  margin-bottom: 2rem;
}

.results-title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.results-subtitle {
  font-size: 1.1rem;
  opacity: 0.95;
  margin-bottom: 1rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.error-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.error-state h3 {
  color: #e74c3c;
  margin-bottom: 1rem;
}

.error-state p {
  color: #666;
  margin-bottom: 1.5rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>
