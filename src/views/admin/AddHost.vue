<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="container">
        <h1>Add New Host</h1>
        <router-link to="/admin/hosts" class="btn btn-secondary">← Back to List</router-link>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <div class="form-card">
          <form @submit.prevent="handleSubmit">
            <div v-if="error" class="error-message">{{ error }}</div>
            <div v-if="success" class="success-message">{{ success }}</div>

            <div class="form-group">
              <label for="full_name">Full Name *</label>
              <input
                id="full_name"
                v-model="form.full_name"
                type="text"
                class="form-control"
                required
                placeholder="John Doe"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="phone_number">Phone Number *</label>
                <input
                  id="phone_number"
                  v-model="form.phone_number"
                  type="tel"
                  class="form-control"
                  required
                  placeholder="0712345678"
                />
              </div>

              <div class="form-group">
                <label for="alt_phone_number">Alternate Phone</label>
                <input
                  id="alt_phone_number"
                  v-model="form.alt_phone_number"
                  type="tel"
                  class="form-control"
                  placeholder="0723456789"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  placeholder="john@example.com"
                />
              </div>

              <div class="form-group">
                <label for="id_number">ID Number</label>
                <input
                  id="id_number"
                  v-model.number="form.id_number"
                  type="number"
                  class="form-control"
                  placeholder="12345678"
                />
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading">Creating...</span>
                <span v-else>Create Host</span>
              </button>
              <router-link to="/admin/hosts" class="btn btn-secondary">Cancel</router-link>
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
  full_name: '',
  phone_number: '',
  alt_phone_number: '',
  email: '',
  id_number: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    await api.post('/host-details', form.value)
    success.value = 'Host created successfully!'
    setTimeout(() => {
      router.push('/admin/hosts')
    }, 1500)
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to create host'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const isAuth = await checkAuth()
  if (!isAuth) {
    router.push('/admin/login')
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
