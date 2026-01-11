<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const email = ref('')
  const password = ref('')
  const message = ref('')
  
  const handleLogin = async () => {
    message.value = ''
  
    if (!email.value || !password.value) {
      message.value = 'Email i hasło są wymagane'
      return
    }
  
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value
        })
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        message.value = data.error || 'Błąd logowania'
        return
      }
  
      // Zapisz token i ID użytkownika
      localStorage.setItem('planer_userId', data.user.id)
  
      // Wyślij event że się zalogowano
      window.dispatchEvent(new Event('userLoggedIn'))
  
      // Przejdź na stronę dochodów
      setTimeout(() => {
        router.push('/income')
      }, 100)
    } catch (err) {
      console.error('Błąd logowania:', err)
      message.value = 'Problem z połączeniem z serwerem'
    }
  }
  </script>
  
  <template>
    <div style="max-width: 400px; margin: 40px auto; padding: 20px;">
      <h1 style="text-align: center;">Logowanie</h1>
  
      <p v-if="message" style="color: #d32f2f; text-align: center;">
        {{ message }}
      </p>
  
      <form @submit.prevent="handleLogin" style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <label style="display: block; margin-bottom: 4px;">Email:</label>
          <input
            type="email"
            v-model="email"
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
            required
          />
        </div>
  
        <div>
          <label style="display: block; margin-bottom: 4px;">Hasło:</label>
          <input
            type="password"
            v-model="password"
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
            required
          />
        </div>
  
        <button
          type="submit"
          style="padding: 10px; background-color: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;"
        >
          Zaloguj
        </button>
      </form>
  
      <p style="text-align: center; margin-top: 20px;">
        Nie masz konta?
        <router-link to="/register" style="color: #1976d2; text-decoration: none;">Zarejestruj się</router-link>
      </p>
    </div>
  </template>
  