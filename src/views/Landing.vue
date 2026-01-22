<template>
  <div class="landing-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Find Your Perfect Stay</h1>
        <p class="hero-subtitle">Discover amazing Airbnbs across Kenya with ease</p>
        <p class="hero-description">
          FindBNB is your trusted platform for finding the perfect accommodation. 
          Search by location, explore detailed listings, and connect directly with hosts. 
          Your next adventure starts here.
        </p>
        <div class="hero-features">
          <div class="feature">
            <div class="feature-icon">📍</div>
            <h3>Easy Location Search</h3>
            <p>Find Airbnbs in any area across Kenya</p>
          </div>
          <div class="feature">
            <div class="feature-icon">🏠</div>
            <h3>Detailed Listings</h3>
            <p>View comprehensive property and host details</p>
          </div>
          <div class="feature">
            <div class="feature-icon">💰</div>
            <h3>Transparent Pricing</h3>
            <p>See clear pricing for all available properties</p>
          </div>
        </div>
        <button class="btn btn-primary hero-cta" @click="goToSearch">
          Start Your Search
          <span class="arrow">→</span>
        </button>
      </div>
    </div>

    <div class="info-section">
      <div class="container">
        <h2 class="section-title">Why Choose FindBNB?</h2>
        <div class="info-grid">
          <div class="info-card">
            <h3>Wide Selection</h3>
            <p>Browse through hundreds of verified Airbnb listings across different counties and areas in Kenya.</p>
          </div>
          <div class="info-card">
            <h3>Direct Host Contact</h3>
            <p>Get direct access to host information including contact details for seamless communication.</p>
          </div>
          <div class="info-card">
            <h3>User-Friendly Interface</h3>
            <p>Our intuitive design makes it easy to search, filter, and find exactly what you're looking for.</p>
          </div>
          <div class="info-card">
            <h3>Comprehensive Details</h3>
            <p>View room types, descriptions, pricing, and all the information you need to make the right choice.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToSearch = () => {
  router.push('/search')
}
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 2rem;
  text-align: center;
}

.hero-content {
  max-width: 1000px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  opacity: 0.95;
}

.hero-description {
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto 3rem;
  opacity: 0.9;
  line-height: 1.8;
}

.hero-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.feature {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.feature p {
  opacity: 0.9;
  font-size: 0.95rem;
}

.hero-cta {
  margin-top: 2rem;
  padding: 16px 40px;
  font-size: 1.2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.arrow {
  transition: transform 0.3s;
}

.hero-cta:hover .arrow {
  transform: translateX(5px);
}

.info-section {
  padding: 5rem 2rem;
  background: white;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.info-card {
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.info-card h3 {
  color: #667eea;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.info-card p {
  color: #666;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-features {
    grid-template-columns: 1fr;
  }
}
</style>
