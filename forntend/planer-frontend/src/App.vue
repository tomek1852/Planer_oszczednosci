<script setup>
import { ref, computed } from 'vue'
import IncomeListView from './views/IncomeListView.vue'
import AuthView from './views/AuthView.vue'

const token = ref(localStorage.getItem('planer_token') || '')

const handleLoggedIn = () => {
  token.value = localStorage.getItem('planer_token') || ''
}

const handleLogout = () => {
  localStorage.removeItem('planer_token')
  localStorage.removeItem('planer_userId')
  token.value = ''
}

const isLoggedIn = computed(() => !!token.value)
</script>

<template>
  <div>
    <header
      style="padding: 10px; background: #2c3e50; color: white; display:flex; justify-content:space-between; align-items:center;"
    >
      <span>PLANER OSZCZĘDNOŚCI</span>
      <button
        v-if="isLoggedIn"
        @click="handleLogout"
        style="padding: 4px 10px; cursor:pointer;"
      >
        Wyloguj
      </button>
    </header>

    <main>
      <AuthView v-if="!isLoggedIn" @logged-in="handleLoggedIn" />
      <IncomeListView v-else />
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
