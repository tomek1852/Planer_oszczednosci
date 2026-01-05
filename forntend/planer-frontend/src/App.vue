<script setup>
import LoginView from './views/LoginView.vue'
</script>

<template>
  <div>
    <!---Główny nagłówek aplikacji -->
    <header style="padding: 10px; background: #2c3e50; color: white;">
      PLANER_OSZCZEDNOSCI
    </header>

    <!--Widoki-->
    <main>
      <LoginView/> 
    </main>
  </div>
</template>

<style>
body{
  margin:0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
main {
  padding: 20px;
}
</style>
