<script setup>
import { ref } from 'vue'
import LoginView from './LoginView.vue'
import RegisterView from './RegisterView.vue'

const showRegister = ref(false)

const emit = defineEmits(['logged-in'])

const handleLoggedIn = () => {
  emit('logged-in')
}
</script>

<template>
  <div style="max-width: 400px; margin: 40px auto;">
    <LoginView v-if="!showRegister" @logged-in="handleLoggedIn" />

    <div v-if="!showRegister" style="margin-top: 10px; text-align: right;">
      <button @click="showRegister = true" style="padding: 4px 10px; cursor:pointer;">
        Załóż nowe konto
      </button>
    </div>

    <RegisterView v-else />

    <div v-if="showRegister" style="margin-top: 10px; text-align: right;">
      <button @click="showRegister = false" style="padding: 4px 10px; cursor:pointer;">
        Mam już konto – logowanie
      </button>
    </div>
  </div>
</template>
