<template>
    <div class="card">
      <h3>{{ airbnb.name }}</h3>
      <p>{{ airbnb.description }}</p>
  
      <p><strong>Host:</strong> {{ airbnb.host.full_name }}</p>
      <p><strong>Phone:</strong> {{ airbnb.host.phone_number }}</p>
      <p><strong>Price:</strong> KES {{ airbnb.price }}</p>
    </div>
  </template>
  
  <script setup>
  defineProps({
    airbnb: Object
  })
  </script>
  
  <style scoped>
  .card {
    border: 1px solid #ddd;
    padding: 20px;
    margin: 15px;
    border-radius: 8px;
  }
  </style>
  