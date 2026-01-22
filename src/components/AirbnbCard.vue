<template>
  <div class="airbnb-card" @click="$emit('click')">
    <div class="card-image">
      <div class="image-placeholder">
        <span class="placeholder-icon">🏠</span>
      </div>
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ airbnb.name }}</h3>
      <p class="card-location">
        <span class="location-icon">📍</span>
        {{ airbnb.area?.name || 'Location not specified' }}
      </p>
      <p class="card-description" v-if="airbnb.description">
        {{ truncateDescription(airbnb.description) }}
      </p>
      <div class="card-details">
        <div class="card-detail-item">
          <span class="detail-icon">🛏️</span>
          <span>{{ airbnb.room_type?.name || 'N/A' }}</span>
        </div>
        <div class="card-detail-item">
          <span class="detail-icon">👤</span>
          <span>{{ airbnb.host?.full_name || 'Host N/A' }}</span>
        </div>
      </div>
      <div class="card-footer">
        <div class="card-price">
          <span class="price-amount">KES {{ formatPrice(airbnb.price) }}</span>
          <span class="price-label">per night</span>
        </div>
        <button class="card-btn">View Details →</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  airbnb: Object
})

defineEmits(['click'])

const truncateDescription = (text) => {
  if (!text) return ''
  return text.length > 120 ? text.substring(0, 120) + '...' : text
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-KE').format(price)
}
</script>

<style scoped>
.airbnb-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.airbnb-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.card-image {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
}

.placeholder-icon {
  font-size: 4rem;
  opacity: 0.8;
}

.card-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.card-location {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.location-icon {
  font-size: 1rem;
}

.card-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
}

.card-details {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding: 1rem 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.card-detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.detail-icon {
  font-size: 1.1rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.card-price {
  display: flex;
  flex-direction: column;
}

.price-amount {
  font-size: 1.5rem;
  font-weight: 800;
  color: #667eea;
  line-height: 1.2;
}

.price-label {
  font-size: 0.8rem;
  color: #999;
}

.card-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s;
  font-size: 0.95rem;
}

.card-btn:hover {
  transform: translateX(3px);
}
</style>
