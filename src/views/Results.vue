<template>
    <div>
      <h2>Available Airbnbs</h2>
  
      <AirbnbCard
        v-for="a in airbnbs"
        :key="a.id"
        :airbnb="a"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import api from '../api/api'
  import AirbnbCard from '../components/AirbnbCard.vue'
  
  const route = useRoute()
  const airbnbs = ref([])
  
  onMounted(async () => {
    const res = await api.get('/airbnbs', {
      params: { area_id: route.query.area_id }
    })
    airbnbs.value = res.data.data.data
  })
  </script>
  