<script setup>
import { ref, computed } from 'vue'
import IncomeListView from './views/IncomeListView.vue'
import AuthView from './views/AuthView.vue'
import CategoriesView from './views/CategoriesView.vue'

const token = ref(localStorage.getItem('planer_token') || '')

// aktywna zakładka po zalogowaniu: 'panel' lub 'categories'
const activeTab = ref('panel')

const handleLoggedIn = () => {
  token.value = localStorage.getItem('planer_token') || ''
  activeTab.value = 'panel'
}

const handleLogout = () => {
  localStorage.removeItem('planer_token')
  localStorage.removeItem('planer_userId')
  token.value = ''
  activeTab.value = 'panel'
}

const isLoggedIn = computed(() => !!token.value)

const switchTab = tab => {
  activeTab.value = tab
}
</script>

<template>
  <div>
    <header
      style="padding: 10px; background: #2c3e50; color: white; display:flex; justify-content:space-between; align-items:center;"
    >
      <span>PLANER_OSZCZĘDNOŚCI</span>

      <div v-if="isLoggedIn" style="display:flex; gap: 10px; align-items:center;">
        <!-- przyciski zakładek -->
        <button
          @click="switchTab('panel')"
          :style="{
            padding: '4px 10px',
            cursor: 'pointer',
            background: activeTab === 'panel' ? '#34495e' : '#ffffff',
            color: activeTab === 'panel' ? '#ffffff' : '#2c3e50',
            border: '1px solid #34495e'
          }"
        >
          Panel (dochody / wydatki)
        </button>

        <button
          @click="switchTab('categories')"
          :style="{
            padding: '4px 10px',
            cursor: 'pointer',
            background: activeTab === 'categories' ? '#34495e' : '#ffffff',
            color: activeTab === 'categories' ? '#ffffff' : '#2c3e50',
            border: '1px solid #34495e'
          }"
        >
          Kategorie
        </button>

        <button
          @click="handleLogout"
          style="padding: 4px 10px; cursor:pointer; margin-left: 10px;"
        >
          Wyloguj
        </button>
      </div>
    </header>

    <main>
      <!-- niezalogowany: ekran logowania/rejestracji -->
      <AuthView v-if="!isLoggedIn" @logged-in="handleLoggedIn" />

      <!-- zalogowany: przełączane zakładki -->
      <template v-else>
        <IncomeListView v-if="activeTab === 'panel'" />
        <CategoriesView 
          v-else-if="activeTab === 'categories'"
          :key="activeTab" />
      </template>
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
