<template>
    <div class="landing">
      <h1>Find Your Perfect Airbnb</h1>
      <p>Search affordable stays across Kenya</p>
  
      <button @click="$router.push('/search')">
        Click to Find AIRBNB
      </button>
    </div>
  </template>
  
  <style scoped>
  .landing {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(#1e90ff, #00bcd4);
    color: white;
  }
  button {
    margin-top: 20px;
    padding: 15px 30px;
    font-size: 18px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  </style>
  