<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-content">
        <router-link to="/" class="logo">FindBNB</router-link>
        <ul class="nav-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/search">Search</router-link></li>
          <li>
            <router-link v-if="isAuthenticated" to="/admin/dashboard" class="admin-link">
              Admin
            </router-link>
            <router-link v-else to="/admin/login" class="admin-link">
              Admin
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from './composables/useAuth'

const { isAuthenticated, checkAuth } = useAuth()

onMounted(async () => {
  await checkAuth()
})
</script>

<style>
/* Global styles are in main.css */
</style>
