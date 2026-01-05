<script setup>
import {ref} from 'vue'

const email = ref('')
const password = ref('')

const message = ref('')
const token = ref('')

const handleLogin = async () => {
    message.value = ''
    token.value = ''

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

        if (!response.ok){
            const errorData = await response.json()
            message.value = errorData.error || 'Błąd logowania'
            return
        }

        const data = await response.json()
        message.value = data.message
        token.value = data.token
    } catch (err){
        console.error('Błąd żądania:', err)
        message.value = 'Problem z połączeniem z serwerem'
    }
}
</script>

<template>
    <div style="max-width: 400px; margin: 40px auto;">
        <h2>Logowanie</h2>

        <form @submit.prevent="handleLogin">
            <div style="margin-bottom: 10px;">
                <label for="email">Email:</label><br />
                <input
                    id="email"
                    type="email"
                    v-model="email"
                    style="width: 100%;padding: 6px;"
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
                Zaloguj
            </button>
        </form>

        <div style="margin-top: 20px;">
            <p v-if="message">Komunikat: {{ message }}</p>
            <p v-if="token">Token: {{ token }}</p>
        </div>
    </div>
</template>