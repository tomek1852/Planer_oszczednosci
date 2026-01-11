<template>
  <div id="app">
    <!-- NAWIGACJA -->
    <nav style="background-color: #333; padding: 10px; margin-bottom: 20px;">
      <!-- Linki dla niezalogowanych -->
      <template v-if="!isLoggedIn">
        <router-link to="/login" style="color: white; margin-right: 20px; text-decoration: none;">Login</router-link>
        <router-link to="/register" style="color: white; margin-right: 20px; text-decoration: none;">Register</router-link>
      </template>

      <!-- Linki dla zalogowanych -->
      <template v-else>
        <router-link to="/income" style="color: white; margin-right: 20px; text-decoration: none;">Panel finansowy</router-link>
        <router-link to="/categories" style="color: white; margin-right: 20px; text-decoration: none;">Kategorie</router-link>
        <router-link to="/budget" style="color: white; margin-right: 20px; text-decoration: none;">Budżet</router-link>
        <button 
          @click="logout" 
          style="background-color: #d32f2f; color: white; border: none; padding: 5px 10px; cursor: pointer; margin-left: 20px; border-radius: 4px;"
        >
          Wyloguj
        </button>
      </template>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)

// Funkcja do sprawdzenia statusu logowania
const checkLoginStatus = () => {
  isLoggedIn.value = !!localStorage.getItem('planer_userId')
}

// Sprawdź przy montażu
onMounted(() => {
  checkLoginStatus()
  
  // Nasłuchuj event zalogowania
  window.addEventListener('userLoggedIn', checkLoginStatus)
  
  // Obserwuj zmiany w localStorage (z innych kart)
  window.addEventListener('storage', checkLoginStatus)
})

// Obserwuj router – gdy zmieni się trasa, sprawdź czy zalogowany
watch(() => router.currentRoute.value.path, () => {
  checkLoginStatus()
})

const logout = () => {
  localStorage.removeItem('planer_userId')
  checkLoginStatus()
  router.push('/login')
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
}
</style>
