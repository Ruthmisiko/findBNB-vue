<template>
  <div class="detail-page">
    <div v-if="loading" class="loading">
      <p>Loading property details...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <h3>Property Not Found</h3>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="$router.push('/search')">
        Back to Search
      </button>
    </div>

    <div v-else-if="airbnb" class="detail-content">
      <button class="back-btn" @click="$router.back()">
        ← Back to Results
      </button>

      <div class="detail-header">
        <h1 class="detail-title">{{ airbnb.name }}</h1>
        <div class="detail-location">
          <span class="location-icon">📍</span>
          <span>{{ airbnb.area?.name }}, {{ airbnb.area?.county?.name || 'Kenya' }}</span>
        </div>
        <div class="detail-price">
          <span class="price-amount">KES {{ formatPrice(airbnb.price) }}</span>
          <span class="price-label">per night</span>
        </div>
      </div>

      <div class="detail-body">
        <div class="detail-main">
          <div class="detail-section">
            <h2>Description</h2>
            <p class="description">{{ airbnb.description || 'No description available.' }}</p>
          </div>

          <div class="detail-section">
            <h2>Property Details</h2>
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Room Type</span>
                <span class="detail-value">{{ airbnb.room_type?.name || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Area</span>
                <span class="detail-value">{{ airbnb.area?.name || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">County</span>
                <span class="detail-value">{{ airbnb.area?.county?.name || 'N/A' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-sidebar">
          <div class="host-card">
            <h2>Host Information</h2>
            <div v-if="airbnb.host" class="host-details">
              <div class="host-item">
                <span class="host-label">Name</span>
                <span class="host-value">{{ airbnb.host.full_name }}</span>
              </div>
              <div class="host-item">
                <span class="host-label">Phone</span>
                <a :href="`tel:${airbnb.host.phone_number}`" class="host-value host-link">
                  {{ airbnb.host.phone_number }}
                </a>
              </div>
              <div v-if="airbnb.host.alt_phone_number" class="host-item">
                <span class="host-label">Alt. Phone</span>
                <a :href="`tel:${airbnb.host.alt_phone_number}`" class="host-value host-link">
                  {{ airbnb.host.alt_phone_number }}
                </a>
              </div>
              <div v-if="airbnb.host.email" class="host-item">
                <span class="host-label">Email</span>
                <a :href="`mailto:${airbnb.host.email}`" class="host-value host-link">
                  {{ airbnb.host.email }}
                </a>
              </div>
              <div v-if="airbnb.host.id_number" class="host-item">
                <span class="host-label">ID Number</span>
                <span class="host-value">{{ airbnb.host.id_number }}</span>
              </div>
            </div>
            <div v-else class="no-host">
              <p>Host information not available</p>
            </div>
          </div>

          <div class="booking-card">
            <div class="booking-price">
              <span class="booking-amount">KES {{ formatPrice(airbnb.price) }}</span>
              <span class="booking-label">per night</span>
            </div>
            <button class="btn btn-primary booking-btn" @click="contactHost">
              Contact Host
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/api'

const route = useRoute()
const router = useRouter()
const airbnb = ref(null)
const loading = ref(false)
const error = ref(null)

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-KE').format(price)
}

const contactHost = () => {
  if (airbnb.value?.host?.phone_number) {
    window.location.href = `tel:${airbnb.value.host.phone_number}`
  } else if (airbnb.value?.host?.email) {
    window.location.href = `mailto:${airbnb.value.host.email}`
  }
}

const loadAirbnb = async () => {
  try {
    loading.value = true
    error.value = null
    
    const res = await api.get(`/airbnbs/${route.params.id}`)
    console.log('API Response:', res.data)
    airbnb.value = res.data.data
    console.log('Airbnb data:', airbnb.value)
  } catch (err) {
    console.error('Error loading airbnb:', err)
    error.value = 'Failed to load property details. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAirbnb()
})
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  padding: 2rem;
}

.detail-content {
  max-width: 1200px;
  margin: 0 auto;
}

.back-btn {
  background: none;
  border: none;
  color: #667eea;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 2rem;
  font-weight: 600;
  transition: color 0.3s;
}

.back-btn:hover {
  color: #764ba2;
}

.detail-header {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.detail-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.detail-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.location-icon {
  font-size: 1.2rem;
}

.detail-price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.price-amount {
  font-size: 2rem;
  font-weight: 800;
  color: #667eea;
}

.price-label {
  color: #999;
  font-size: 1rem;
}

.detail-body {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
}

.detail-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.detail-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.description {
  color: #666;
  line-height: 1.8;
  font-size: 1.05rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-label {
  color: #999;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.detail-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.host-card,
.booking-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.host-card h2 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.host-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.host-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.host-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.host-label {
  color: #999;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.host-value {
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.host-link {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s;
}

.host-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.no-host {
  color: #999;
  text-align: center;
  padding: 2rem;
}

.booking-card {
  position: sticky;
  top: 100px;
}

.booking-price {
  text-align: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.booking-amount {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.booking-label {
  color: #999;
  font-size: 0.9rem;
}

.booking-btn {
  width: 100%;
  padding: 14px;
  font-size: 1.1rem;
}

@media (max-width: 968px) {
  .detail-body {
    grid-template-columns: 1fr;
  }
  
  .booking-card {
    position: static;
  }
  
  .detail-title {
    font-size: 2rem;
  }
}
</style>
