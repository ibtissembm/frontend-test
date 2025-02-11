<template>
    <div class="not-found">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <router-link to="/characters" class="btn-back">Back to the list of characters</router-link>
    </div>
  </template>
  
  <script setup lang="ts">
  // Aucun script n'est nécessaire ici car on affiche uniquement un message statique
  </script>
  
  <style scoped lang="scss">
  .not-found {
    text-align: center;
    margin-top: 50px;
    
  
    h1 {
      font-size: 22px;
      color: $error-color;
      margin-bottom: 20px;
    }
  
    p {
      font-size: 20px;
      margin-bottom: 50px;
    }
    }
  </style>
  