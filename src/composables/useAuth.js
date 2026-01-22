import { ref, computed } from 'vue'
import api from '../api/api'

const user = ref(null)
const token = ref(localStorage.getItem('admin_token') || null)

// Set token in axios if it exists
if (token.value) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
}

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)

  const login = async (email, password) => {
    try {
      const res = await api.post('/admin/login', { email, password })
      token.value = res.data.data.token
      user.value = res.data.data.user
      localStorage.setItem('admin_token', token.value)
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const logout = async () => {
    try {
      await api.post('/admin/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('admin_token')
      delete api.defaults.headers.common['Authorization']
    }
  }

  const checkAuth = async () => {
    if (!token.value) return false
    
    try {
      const res = await api.get('/admin/me')
      user.value = res.data.data.user
      return true
    } catch (error) {
      logout()
      return false
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
}
