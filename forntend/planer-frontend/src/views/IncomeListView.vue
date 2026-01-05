<script setup>
import { ref, onMounted } from 'vue'

const incomes = ref([])
const message = ref('')

// NOWE: pola formularza
const newType = ref('realny')
const newAmount = ref(0)
const newCategory = ref('')
const newSubcategory = ref('')

const loadIncomes = async () => {
  message.value = ''

  const userId = localStorage.getItem('planer_userId')
  if (!userId) {
    message.value = 'Brak danych użytkownika'
    incomes.value = []
    return
  }

  try {
    const response = await fetch(`http://localhost:3000/api/income?userId=${userId}`)

    if (!response.ok) {
      const err = await response.json()
      message.value = err.error || 'Błąd wczytywania dochodów'
      return
    }

    incomes.value = await response.json()
  } catch (err) {
    console.error('Błąd pobierania dochodów:', err)
    message.value = 'Problem z połączeniem z serwerem'
  }
}

// NOWE: dodawanie dochodu
const addIncome = async () => {
  message.value = ''

  const userId = localStorage.getItem('planer_userId')
  if (!userId) {
    message.value = 'Brak danych użytkownika'
    return
  }

  try {
    const response = await fetch('http://localhost:3000/api/income', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        type: newType.value,
        amount: Number(newAmount.value),
        category: newCategory.value,
        subcategory: newSubcategory.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      message.value = data.error || 'Błąd dodawania dochodu'
      return
    }

    // po sukcesie odśwież listę
    await loadIncomes()

    // wyczyść formularz
    newAmount.value = 0
    newCategory.value = ''
    newSubcategory.value = ''
  } catch (err) {
    console.error('Błąd dodawania dochodu:', err)
    message.value = 'Problem z połączeniem z serwerem'
  }
}

onMounted(loadIncomes)
</script>

    
<template>
  <div style="max-width: 600px; margin: 40px auto;">
    <h2>Dochody</h2>

    <p v-if="message">{{ message }}</p>

    <table v-if="incomes.length" border="1" cellspacing="0" cellpadding="4" style="width: 100%; margin-bottom: 20px;">
      <thead>
        <tr>
          <th>Typ</th>
          <th>Kwota</th>
          <th>Kategoria</th>
          <th>Podkategoria</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="income in incomes" :key="income._id">
          <td>{{ income.type }}</td>
          <td>{{ income.amount }}</td>
          <td>{{ income.category }}</td>
          <td>{{ income.subcategory }}</td>
          <td>{{ new Date(income.createdAt).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>Brak zapisanych dochodów.</p>

    <!-- Formularz dodawania dochodu -->
    <h3>Dodaj dochód</h3>
    <form @submit.prevent="addIncome">
      <div style="margin-bottom: 8px;">
        <label>Typ:</label><br />
        <select v-model="newType" style="width: 100%; padding: 4px;">
          <option value="realny">Realny</option>
          <option value="przewidywany">Przewidywany</option>
        </select>
      </div>

      <div style="margin-bottom: 8px;">
        <label>Kwota:</label><br />
        <input
          type="number"
          v-model="newAmount"
          style="width: 100%; padding: 4px;"
          step="0.01"
          min="0"
          required
        />
      </div>

      <div style="margin-bottom: 8px;">
        <label>Kategoria:</label><br />
        <input
          type="text"
          v-model="newCategory"
          style="width: 100%; padding: 4px;"
          required
        />
      </div>

      <div style="margin-bottom: 8px;">
        <label>Podkategoria:</label><br />
        <input
          type="text"
          v-model="newSubcategory"
          style="width: 100%; padding: 4px;"
          required
        />
      </div>

      <button type="submit" style="padding: 6px 14px;">
        Zapisz dochód
      </button>
    </form>
  </div>
</template>

    