<template>
    <div class="search">
      <h2>Select Location</h2>
  
      <select v-model="countyId" @change="loadAreas">
        <option value="">Select County</option>
        <option v-for="c in counties" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>
  
      <select v-model="areaId">
        <option value="">Select Area</option>
        <option v-for="a in areas" :key="a.id" :value="a.id">
          {{ a.name }}
        </option>
      </select>
  
      <button @click="searchAirbnbs">Search</button>
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
  
  onMounted(async () => {
    const res = await api.get('/counties')
    counties.value = res.data.data
  })
  
  const loadAreas = async () => {
    const res = await api.get(`/counties/${countyId.value}/areas`)
    areas.value = res.data.data
  }
  
  const searchAirbnbs = () => {
    router.push({ path: '/results', query: { area_id: areaId.value } })
  }
  </script>
  
  <style scoped>
  .search {
    padding: 40px;
  }
  select, button {
    display: block;
    margin: 15px 0;
    padding: 10px;
  }
  </style>
  