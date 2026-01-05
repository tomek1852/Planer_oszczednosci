<script setup>
    import { ref } from 'vue'
    
    const email = ref('')
    const password = ref('')
    const message = ref('')
    
    const handleRegister = async () => {
      message.value = ''
    
      try {
        const response = await fetch('http://localhost:3000/api/register', {
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
          message.value = data.error || 'Błąd rejestracji'
          return
        }
    
        message.value = data.message || 'Użytkownik zarejestrowany – możesz się zalogować'
        email.value = ''
        password.value = ''
      } catch (err) {
        console.error('Błąd żądania rejestracji:', err)
        message.value = 'Problem z połączeniem z serwerem'
      }
    }
</script>
    
    <template>
      <div style="max-width: 400px; margin: 40px auto;">
        <h2>Rejestracja</h2>
    
        <form @submit.prevent="handleRegister">
          <div style="margin-bottom: 10px;">
            <label for="email">Email:</label><br />
            <input
              id="email"
              type="email"
              v-model="email"
              style="width: 100%; padding: 6px;"
              required
            />
          </div>
    
          <div style="margin-bottom: 10px;">
            <label for="password">Hasło:</label><br />
            <input
              id="password"
              type="password"
              v-model="password"
              style="width: 100%; padding: 6px;"
              required
            />
          </div>
    
          <button type="submit" style="padding: 8px 16px;">
            Zarejestruj
          </button>
        </form>
    
        <div style="margin-top: 20px;">
          <p v-if="message">Komunikat: {{ message }}</p>
        </div>
      </div>
    </template>
    