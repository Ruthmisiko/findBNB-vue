<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="container">
        <h1>Add New County</h1>
        <router-link to="/admin/counties" class="btn btn-secondary">← Back to List</router-link>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <div class="form-card">
          <form @submit.prevent="handleSubmit">
            <div v-if="error" class="error-message">{{ error }}</div>
            <div v-if="success" class="success-message">{{ success }}</div>

            <div class="form-group">
              <label for="name">County Name *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="form-control"
                required
                placeholder="e.g., Nairobi, Mombasa"
              />
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                id="description"
                v-model="form.description"
                class="form-control"
                rows="4"
                placeholder="Describe the county..."
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading">Creating...</span>
                <span v-else>Create County</span>
              </button>
              <router-link to="/admin/counties" class="btn btn-secondary">Cancel</router-link>
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
  description: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    await api.post('/counties', form.value)
    success.value = 'County created successfully!'
    setTimeout(() => {
      router.push('/admin/counties')
    }, 1500)
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to create county'
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
  .page-header .container {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
