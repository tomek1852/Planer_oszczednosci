<script setup>
import { ref, onMounted, computed } from 'vue'

const incomes = ref([])
const expenses = ref([])

const message = ref('')

// DOCHODY – pola
const newType = ref('realny')
const newAmount = ref(0)
const newCategory = ref('')      // _id kategorii
const newSubcategory = ref('')   // _id podkategorii
const newDate = ref('')   

// WYDATKI – pola
const newExpType = ref('realny')
const newExpAmount = ref(0)
const newExpCategory = ref('')
const newExpSubcategory = ref('')
const newExpDate = ref('')

// KATEGORIE
const incomeCategories = ref([])   // wszystkie kategorie kind=income
const expenseCategories = ref([])  // wszystkie kategorie kind=expense

const loadIncomeCategories = async () => {
  const userId = localStorage.getItem('planer_userId')
  if (!userId) {
    incomeCategories.value = []
    return
  }

  try {
    const res = await fetch(`http://localhost:3000/api/categories?userId=${userId}&kind=income`)
    if (!res.ok) {
      incomeCategories.value = []
      return
    }
    incomeCategories.value = await res.json()
  } catch (err) {
    console.error('Błąd pobierania kategorii dochodów:', err)
    incomeCategories.value = []
  }
}

const loadExpenseCategories = async () => {
  const userId = localStorage.getItem('planer_userId')
  if (!userId) {
    expenseCategories.value = []
    return
  }

  try {
    const res = await fetch(`http://localhost:3000/api/categories?userId=${userId}&kind=expense`)
    if (!res.ok) {
      expenseCategories.value = []
      return
    }
    expenseCategories.value = await res.json()
  } catch (err) {
    console.error('Błąd pobierania kategorii wydatków:', err)
    expenseCategories.value = []
  }
}

// COMPUTED: główne/podkategorie DOCHODY
const incomeMainCategories = computed(() =>
  incomeCategories.value.filter(c => !c.parentId)
)

const incomeSubcategoriesForSelected = computed(() =>
  incomeCategories.value.filter(c => c.parentId === newCategory.value)
)

// COMPUTED: główne/podkategorie WYDATKI
const expenseMainCategories = computed(() =>
  expenseCategories.value.filter(c => !c.parentId)
)

const expenseSubcategoriesForSelected = computed(() =>
  expenseCategories.value.filter(c => c.parentId === newExpCategory.value)
)

// -------- DOCHODY ----------

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

const addIncome = async () => {
  message.value = ''

  const userId = localStorage.getItem('planer_userId')
  if (!userId) {
    message.value = 'Brak danych użytkownika'
    return
  }

  // znajdź nazwę kategorii/podkategorii po _id (jeśli backend nadal trzyma stringi nazw)
  const cat = incomeCategories.value.find(c => c._id === newCategory.value)
  const sub = incomeCategories.value.find(c => c._id === newSubcategory.value)

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
        category: cat ? cat.name : '',
        subcategory: sub ? sub.name : '',
        date: newDate.value || null
      })
    })

    const data = await response.json()

    if (!response.ok) {
      message.value = data.error || 'Błąd dodawania dochodu'
      return
    }

    await loadIncomes()

    newAmount.value = 0
    newCategory.value = ''
    newSubcategory.value = ''
    newDate.value = ''
  } catch (err) {
    console.error('Błąd dodawania dochodu:', err)
    message.value = 'Problem z połączeniem z serwerem'
  }
}

// -------- WYDATKI ----------

const loadExpenses = async () => {
  const userId = localStorage.getItem('planer_userId')
  if (!userId) {
    expenses.value = []
    return
  }

  try {
    const response = await fetch(`http://localhost:3000/api/expense?userId=${userId}`)

    if (!response.ok) {
      const err = await response.json()
      message.value = err.error || 'Błąd wczytywania wydatków'
      return
    }

    expenses.value = await response.json()
  } catch (err) {
    console.error('Błąd pobierania wydatków:', err)
    message.value = 'Problem z połączeniem z serwerem'
  }
}

const addExpense = async () => {
  message.value = ''

  const userId = localStorage.getItem('planer_userId')
  if (!userId) {
    message.value = 'Brak danych użytkownika'
    return
  }

  const cat = expenseCategories.value.find(c => c._id === newExpCategory.value)
  const sub = expenseCategories.value.find(c => c._id === newExpSubcategory.value)

  try {
    const response = await fetch('http://localhost:3000/api/expense', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        type: newExpType.value,
        amount: Number(newExpAmount.value),
        category: cat ? cat.name : '',
        subcategory: sub ? sub.name : '',
        date: newDate.value || null
      })
    })

    const data = await response.json()

    if (!response.ok) {
      message.value = data.error || 'Błąd dodawania wydatku'
      return
    }

    await loadExpenses()

    newExpAmount.value = 0
    newExpCategory.value = ''
    newExpSubcategory.value = ''
    newDate.value = ''
  } catch (err) {
    console.error('Błąd dodawania wydatku:', err)
    message.value = 'Problem z połączeniem z serwerem'
  }
}

const deleteIncome = async (income) => {
  message.value = ''
  const ok = window.confirm('Usunąć ten dochód?')
  if (!ok) return

  try {
    const res = await fetch(`http://localhost:3000/api/income/${income._id}`, {
      method: 'DELETE'
    })
    const data = await res.json()
    if (!res.ok) {
      message.value = data.error || 'Błąd usuwania dochodu'
      return
    }
    await loadIncomes()
  } catch (err) {
    console.error('Błąd usuwania dochodu:', err)
    message.value = 'Problem z połączeniem z serwerem'
  }
}

const deleteExpense = async (expense) => {
  message.value = ''
  const ok = window.confirm('Usunąć ten wydatek?')
  if (!ok) return

  try {
    const res = await fetch(`http://localhost:3000/api/expense/${expense._id}`, {
      method: 'DELETE'
    })
    const data = await res.json()
    if (!res.ok) {
      message.value = data.error || 'Błąd usuwania wydatku'
      return
    }
    await loadExpenses()
  } catch (err) {
    console.error('Błąd usuwania wydatku:', err)
    message.value = 'Problem z połączeniem z serwerem'
  }
}

// EDYCJA DOCHODÓW/WYDATKÓW
const editingEntryId = ref('')
const editingEntryType = ref('') // 'income' lub 'expense'
const editingAmount = ref(0)

const startEditIncome = (income) => {
  editingEntryId.value = income._id
  editingEntryType.value = 'income'
  editingAmount.value = income.amount
}

const startEditExpense = (expense) => {
  editingEntryId.value = expense._id
  editingEntryType.value = 'expense'
  editingAmount.value = expense.amount
}

const cancelEditEntry = () => {
  editingEntryId.value = ''
  editingEntryType.value = ''
  editingAmount.value = 0
}

const saveEditEntry = async () => {
  message.value = ''

  if (!editingEntryId.value || !editingEntryType.value) return
  if (!editingAmount.value && editingAmount.value !== 0) return

  const endpoint =
    editingEntryType.value === 'income'
      ? `http://localhost:3000/api/income/${editingEntryId.value}`
      : `http://localhost:3000/api/expense/${editingEntryId.value}`

  try {
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(editingAmount.value) })
    })

    const data = await res.json()
    if (!res.ok) {
      message.value = data.error || 'Błąd edycji wpisu'
      return
    }

    if (editingEntryType.value === 'income') {
      await loadIncomes()
    } else {
      await loadExpenses()
    }

    cancelEditEntry()
  } catch (err) {
    console.error('Błąd edycji wpisu:', err)
    message.value = 'Problem z połączeniem z serwerem'
  }
}


onMounted(async () => {
  await Promise.all([
    loadIncomes(),
    loadExpenses(),
    loadIncomeCategories(),
    loadExpenseCategories()
  ])
})
</script>




    
<template>
  <div style="max-width: 1000px; margin: 40px auto;">
    <!-- Górny tytuł -->
    <h2 style="text-align: center;">Panel finansowy</h2>

    <p v-if="message" style="text-align: center;">{{ message }}</p>

    <!-- Dwie kolumny: lewa - dochody, prawa - wydatki -->
    <div
      style="display: flex; gap: 40px; align-items: flex-start; margin-top: 20px;"
    >
      <!-- LEWA: dochody -->
      <div style="flex: 1;">
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
            <select
              v-model="newCategory"
              style="width: 100%; padding: 4px;"
              required
            >
              <option value="" disabled>Wybierz kategorię</option>
              <option
                v-for="cat in incomeMainCategories"
                :key="cat._id"
                :value="cat._id"
              >
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div style="margin-bottom: 8px;">
            <label>Podkategoria:</label><br />
            <select
              v-model="newSubcategory"
              style="width: 100%; padding: 4px;"
              :disabled="!incomeSubcategoriesForSelected.length"
            >
              <option value="">Brak / wybierz</option>
              <option
                v-for="sub in incomeSubcategoriesForSelected"
                :key="sub._id"
                :value="sub._id"
              >
                {{ sub.name }}
              </option>
            </select>
          </div>

          <div style="margin-bottom: 8px;">
            <label>Data:</label><br />
            <input
              type="date"
              v-model="newDate"
              style="width: 100%; padding: 4px;"
            />
          </div>


          <button type="submit" style="padding: 6px 14px;">
            Zapisz dochód
          </button>
        </form>
      </div>

      <!-- PRAWA: wydatki -->
      <div style="flex: 1;">
        <h3>Dodaj wydatek</h3>

        <form @submit.prevent="addExpense">
          <div style="margin-bottom: 8px;">
            <label>Typ:</label><br />
            <select v-model="newExpType" style="width: 100%; padding: 4px;">
              <option value="realny">Realny</option>
              <option value="przewidywany">Przewidywany</option>
            </select>
          </div>

          <div style="margin-bottom: 8px;">
            <label>Kwota:</label><br />
            <input
              type="number"
              v-model="newExpAmount"
              style="width: 100%; padding: 4px;"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div style="margin-bottom: 8px;">
            <label>Kategoria:</label><br />
            <select
              v-model="newExpCategory"
              style="width: 100%; padding: 4px;"
              required
            >
              <option value="" disabled>Wybierz kategorię</option>
              <option
                v-for="cat in expenseMainCategories"
                :key="cat._id"
                :value="cat._id"
              >
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div style="margin-bottom: 8px;">
            <label>Podkategoria:</label><br />
            <select
              v-model="newExpSubcategory"
              style="width: 100%; padding: 4px;"
              :disabled="!expenseSubcategoriesForSelected.length"
            >
              <option value="">Brak / wybierz</option>
              <option
                v-for="sub in expenseSubcategoriesForSelected"
                :key="sub._id"
                :value="sub._id"
              >
                {{ sub.name }}
              </option>
            </select>
          </div>

          <div style="margin-bottom: 8px;">
            <label>Data:</label><br />
            <input
              type="date"
              v-model="newExpDate"
              style="width: 100%; padding: 4px;"
            />
          </div>


          <button type="submit" style="padding: 6px 14px;">
            Zapisz wydatek
          </button>
        </form>
      </div>
    </div>

    <!-- Tabela dochodów -->
    <div style="margin-top: 30px;">
      <h3>Dochody (lista)</h3>

      <table
        v-if="incomes.length"
        border="1"
        cellspacing="0"
        cellpadding="4"
        style="width: 100%; margin-top: 10px;"
      >
        <thead>
          <tr>
            <th>Typ</th>
            <th>Kwota</th>
            <th>Kategoria</th>
            <th>Podkategoria</th>
            <th>Data</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="income in incomes" :key="income._id">
            <td>{{ income.type }}</td>

            <td>
              <template
                v-if="
                  editingEntryId === income._id &&
                  editingEntryType === 'income'
                "
              >
                <input
                  type="number"
                  v-model="editingAmount"
                  style="width: 80px; padding: 2px 4px;"
                  step="0.01"
                  min="0"
                />
              </template>
              <template v-else>
                {{ income.amount }}
              </template>
            </td>

            <td>{{ income.category }}</td>
            <td>{{ income.subcategory }}</td>
            <td>{{ new Date(income.createdAt).toLocaleDateString() }}</td>
            <td>
              <template
                v-if="
                  editingEntryId === income._id &&
                  editingEntryType === 'income'
                "
              >
                <button
                  @click="saveEditEntry"
                  style="
                    padding: 2px 6px;
                    font-size: 12px;
                    margin-right: 4px;
                  "
                >
                  Zapisz
                </button>
                <button
                  @click="cancelEditEntry"
                  style="padding: 2px 6px; font-size: 12px;"
                >
                  Anuluj
                </button>
              </template>
              <template v-else>
                <button
                  @click="startEditIncome(income)"
                  style="
                    padding: 2px 6px;
                    font-size: 12px;
                    margin-right: 4px;
                  "
                >
                  Edytuj
                </button>
                <button
                  @click="deleteIncome(income)"
                  style="padding: 2px 6px; font-size: 12px;"
                >
                  Usuń
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else>Brak zapisanych dochodów.</p>
    </div>

    <!-- Tabela wydatków -->
    <div style="margin-top: 30px;">
      <h3>Wydatki (lista)</h3>

      <table
        v-if="expenses.length"
        border="1"
        cellspacing="0"
        cellpadding="4"
        style="width: 100%; margin-top: 10px;"
      >
        <thead>
          <tr>
            <th>Typ</th>
            <th>Kwota</th>
            <th>Kategoria</th>
            <th>Podkategoria</th>
            <th>Data</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="expense in expenses" :key="expense._id">
            <td>{{ expense.type }}</td>

            <td>
              <template
                v-if="
                  editingEntryId === expense._id &&
                  editingEntryType === 'expense'
                "
              >
                <input
                  type="number"
                  v-model="editingAmount"
                  style="width: 80px; padding: 2px 4px;"
                  step="0.01"
                  min="0"
                />
              </template>
              <template v-else>
                {{ expense.amount }}
              </template>
            </td>

            <td>{{ expense.category }}</td>
            <td>{{ expense.subcategory }}</td>
            <td>{{ new Date(expense.createdAt).toLocaleDateString() }}</td>
            <td>
              <template
                v-if="
                  editingEntryId === expense._id &&
                  editingEntryType === 'expense'
                "
              >
                <button
                  @click="saveEditEntry"
                  style="
                    padding: 2px 6px;
                    font-size: 12px;
                    margin-right: 4px;
                  "
                >
                  Zapisz
                </button>
                <button
                  @click="cancelEditEntry"
                  style="padding: 2px 6px; font-size: 12px;"
                >
                  Anuluj
                </button>
              </template>
              <template v-else>
                <button
                  @click="startEditExpense(expense)"
                  style="
                    padding: 2px 6px;
                    font-size: 12px;
                    margin-right: 4px;
                  "
                >
                  Edytuj
                </button>
                <button
                  @click="deleteExpense(expense)"
                  style="padding: 2px 6px; font-size: 12px;"
                >
                  Usuń
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else>Brak zapisanych wydatków.</p>
    </div>
  </div>
</template>






    