<script setup>
    import { ref, onMounted, computed, watch } from 'vue'
    
    const budgets = ref([])
    const message = ref('')
    
    // Selektor miesiąca
    const currentDate = ref(new Date())
    const selectedMonth = computed(() => currentDate.value.getMonth() + 1)
    const selectedYear = computed(() => currentDate.value.getFullYear())
    
    // Typ: income/expense
    const kind = ref('expense')
    
    // Nowy budżet
    const newCategory = ref('')
    const newSubcategory = ref('')
    const newPlannedAmount = ref(0)
    
    // Kategorie
    const categories = ref([])
    
    // Edycja budżetu
    const editingBudgetId = ref('')
    const editingAmount = ref(0)
    
    const loadCategories = async () => {
      const userId = localStorage.getItem('planer_userId')
      if (!userId) {
        categories.value = []
        return
      }
    
      try {
        const res = await fetch(
          `http://localhost:3000/api/categories?userId=${userId}&kind=${kind.value}`
        )
        if (!res.ok) {
          categories.value = []
          return
        }
        categories.value = await res.json()
      } catch (err) {
        console.error('Błąd pobierania kategorii:', err)
        categories.value = []
      }
    }
    
    const mainCategories = computed(() =>
      categories.value.filter(c => !c.parentId)
    )
    
    const subcategoriesForSelected = computed(() =>
      categories.value.filter(c => c.parentId === newCategory.value)
    )
    
    const loadBudgets = async () => {
      message.value = ''
    
      const userId = localStorage.getItem('planer_userId')
      if (!userId) {
        message.value = 'Brak danych użytkownika'
        budgets.value = []
        return
      }
    
      try {
        const res = await fetch(
          `http://localhost:3000/api/budget?userId=${userId}&kind=${kind.value}&month=${selectedMonth.value}&year=${selectedYear.value}`
        )
    
        if (!res.ok) {
          const err = await res.json()
          message.value = err.error || 'Błąd wczytywania budżetów'
          budgets.value = []
          return
        }
    
        budgets.value = await res.json()
      } catch (err) {
        console.error('Błąd pobierania budżetów:', err)
        message.value = 'Problem z połączeniem z serwerem'
      }
    }
    
    // Obserwuj zmianę daty
    watch(currentDate, () => {
      loadBudgets()
    })
    
    const addBudget = async () => {
      message.value = ''
    
      const userId = localStorage.getItem('planer_userId')
      if (!userId) {
        message.value = 'Brak danych użytkownika'
        return
      }
    
      const cat = categories.value.find(c => c._id === newCategory.value)
      if (!cat) {
        message.value = 'Wybierz kategorię'
        return
      }
    
      if (!newPlannedAmount.value || newPlannedAmount.value <= 0) {
        message.value = 'Podaj dodatnią kwotę'
        return
      }
    
      const sub = categories.value.find(c => c._id === newSubcategory.value)
    
      try {
        const res = await fetch('http://localhost:3000/api/budget', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            kind: kind.value,
            category: cat.name,
            subcategory: sub ? sub.name : '',
            month: selectedMonth.value,
            year: selectedYear.value,
            plannedAmount: Number(newPlannedAmount.value)
          })
        })
    
        const data = await res.json()
    
        if (!res.ok) {
          message.value = data.error || 'Błąd dodawania budżetu'
          return
        }
    
        await loadBudgets()
    
        newCategory.value = ''
        newSubcategory.value = ''
        newPlannedAmount.value = 0
      } catch (err) {
        console.error('Błąd dodawania budżetu:', err)
        message.value = 'Problem z połączeniem z serwerem'
      }
    }
    
    const startEdit = (budget) => {
      editingBudgetId.value = budget._id
      editingAmount.value = budget.plannedAmount
    }
    
    const cancelEdit = () => {
      editingBudgetId.value = ''
      editingAmount.value = 0
    }
    
    const saveEdit = async (budget) => {
      message.value = ''
    
      if (!editingAmount.value || editingAmount.value <= 0) {
        message.value = 'Kwota musi być dodatnia'
        return
      }
    
      try {
        const res = await fetch(
          `http://localhost:3000/api/budget/${budget._id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ plannedAmount: Number(editingAmount.value) })
          }
        )
    
        const data = await res.json()
    
        if (!res.ok) {
          message.value = data.error || 'Błąd edycji budżetu'
          return
        }
    
        await loadBudgets()
        cancelEdit()
      } catch (err) {
        console.error('Błąd edycji budżetu:', err)
        message.value = 'Problem z połączeniem z serwerem'
      }
    }
    
    const deleteBudget = async (budget) => {
      message.value = ''
      const ok = window.confirm(`Usunąć budżet dla "${budget.category}"?`)
      if (!ok) return
    
      try {
        const res = await fetch(
          `http://localhost:3000/api/budget/${budget._id}`,
          {
            method: 'DELETE'
          }
        )
    
        const data = await res.json()
    
        if (!res.ok) {
          message.value = data.error || 'Błąd usuwania budżetu'
          return
        }
    
        await loadBudgets()
      } catch (err) {
        console.error('Błąd usuwania budżetu:', err)
        message.value = 'Problem z połączeniem z serwerem'
      }
    }
    
    const previousMonth = () => {
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() - 1,
        1
      )
    }
    
    const nextMonth = () => {
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1,
        1
      )
    }
    
    const getProgressPercent = (budget) => {
      if (budget.plannedAmount === 0) return 0
      return Math.min((budget.actualAmount / budget.plannedAmount) * 100, 100)
    }
    
    const handleKindChange = async () => {
      newCategory.value = ''
      newSubcategory.value = ''
      await loadCategories()
      await loadBudgets()
    }

    

    
    onMounted(async () => {
      await loadCategories()
      await loadBudgets()
    })
    </script>
    
    <template>
      <div style="max-width: 1200px; margin: 40px auto; padding: 20px;">
        <h2 style="text-align: center;">Budżet</h2>
    
        <p v-if="message" style="text-align: center; color: #d32f2f;">
          {{ message }}
        </p>
    
        <!-- Selektor miesiąca -->
        <div style="text-align: center; margin-bottom: 20px;">
          <button @click="previousMonth" style="padding: 6px 14px; margin-right: 10px;">
            ← Poprzedni miesiąc
          </button>
          <span style="font-size: 18px; font-weight: bold; margin: 0 20px;">
            {{ currentDate.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' }) }}
          </span>
          <button @click="nextMonth" style="padding: 6px 14px; margin-left: 10px;">
            Następny miesiąc →
          </button>
        </div>
    
        <!-- Dwie kolumny -->
        <div style="display: flex; gap: 40px; align-items: flex-start;">
          <!-- LEWA: Dodawanie/edycja budżetów -->
          <div style="flex: 1; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #fafafa;">
            <h3>Dodaj budżet</h3>
    
            <form @submit.prevent="addBudget">
              <div style="margin-bottom: 8px;">
                <label>Typ:</label><br />
                <select
                  v-model="kind"
                  @change="handleKindChange"
                  style="width: 100%; padding: 4px;"
                >
                  <option value="income">Dochody</option>
                  <option value="expense">Wydatki</option>
                </select>
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
                    v-for="cat in mainCategories"
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
                  :disabled="!subcategoriesForSelected.length"
                >
                  <option value="">Brak / wybierz</option>
                  <option
                    v-for="sub in subcategoriesForSelected"
                    :key="sub._id"
                    :value="sub._id"
                  >
                    {{ sub.name }}
                  </option>
                </select>
              </div>
    
              <div style="margin-bottom: 8px;">
                <label>Planowana kwota:</label><br />
                <input
                  type="number"
                  v-model="newPlannedAmount"
                  style="width: 100%; padding: 4px;"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
    
              <button type="submit" style="padding: 6px 14px;">
                Dodaj budżet
              </button>
            </form>
    
            <h3 style="margin-top: 30px;">Lista budżetów na ten miesiąc</h3>
    
            <div v-if="budgets.length" style="display: flex; flex-direction: column; gap: 12px;">
              <div
                v-for="budget in budgets"
                :key="budget._id"
                style="
                  border: 1px solid #ccc;
                  padding: 12px;
                  border-radius: 4px;
                  background-color: white;
                "
              >
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <strong>{{ budget.category }}</strong>
                  <span v-if="budget.subcategory" style="font-size: 12px; color: #666;">
                    ({{ budget.subcategory }})
                  </span>
                </div>
    
                <!-- Plan/Rzeczywistość -->
                <div style="font-size: 12px; margin-bottom: 8px;">
                  <span style="color: #1976d2;">Plan: {{ budget.plannedAmount }} zł</span>
                  |
                  <span style="color: #d32f2f;">Rzeczywistość: {{ budget.actualAmount }} zł</span>
                  |
                  <span :style="{ color: budget.difference >= 0 ? '#388e3c' : '#d32f2f' }">
                    Różnica: {{ budget.difference >= 0 ? '+' : '' }}{{ budget.difference }} zł
                  </span>
                </div>
    
                <!-- Pasek postępu -->
                <div style="width: 100%; background-color: #eee; height: 20px; border-radius: 4px; overflow: hidden; margin-bottom: 8px;">
                  <div
                    :style="{
                      width: getProgressPercent(budget) + '%',
                      backgroundColor: budget.difference >= 0 ? '#4caf50' : '#f44336',
                      height: '100%',
                      transition: 'width 0.3s ease'
                    }"
                  ></div>
                </div>
    
                <!-- Edycja/Usuń -->
                <div style="display: flex; gap: 6px;">
                  <template v-if="editingBudgetId === budget._id">
                    <input
                      type="number"
                      v-model="editingAmount"
                      style="width: 80px; padding: 2px 4px; font-size: 12px;"
                      step="0.01"
                      min="0"
                    />
                    <button
                      @click="saveEdit(budget)"
                      style="padding: 2px 6px; font-size: 11px; background-color: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;"
                    >
                      Zapisz
                    </button>
                    <button
                      @click="cancelEdit"
                      style="padding: 2px 6px; font-size: 11px; background-color: #999; color: white; border: none; border-radius: 4px; cursor: pointer;"
                    >
                      Anuluj
                    </button>
                  </template>
                  <template v-else>
                    <button
                      @click="startEdit(budget)"
                      style="padding: 2px 6px; font-size: 11px; background-color: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;"
                    >
                      Edytuj
                    </button>
                    <button
                      @click="deleteBudget(budget)"
                      style="padding: 2px 6px; font-size: 11px; background-color: #d32f2f; color: white; border: none; border-radius: 4px; cursor: pointer;"
                    >
                      Usuń
                    </button>
                  </template>
                </div>
              </div>
            </div>
    
            <p v-else style="color: #999;">
              Brak budżetów na ten miesiąc. Dodaj pierwszy budżet!
            </p>
          </div>
    
          <!-- PRAWA: Podsumowanie i statystyki -->
                <!-- PRAWA: Podsumowanie i statystyki -->
        <div style="flex: 1;">
          <div style="border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #fafafa;">
            <h3>Podsumowanie {{ kind === 'income' ? 'dochodów' : 'wydatków' }}</h3>

            <div v-if="budgets.length" style="display: flex; flex-direction: column; gap: 16px;">
              <!-- Całkowity plan -->
              <div style="padding: 12px; background-color: #e3f2fd; border-radius: 4px; border-left: 4px solid #1976d2;">
                <div style="font-size: 12px; color: #666;">Całkowity plan</div>
                <div style="font-size: 24px; font-weight: bold; color: #1976d2;">
                  {{ budgets.reduce((sum, b) => sum + b.plannedAmount, 0).toFixed(2) }} zł
                </div>
              </div>

              <!-- Całkowita rzeczywistość -->
              <div style="padding: 12px; background-color: #fff3e0; border-radius: 4px; border-left: 4px solid #f57c00;">
                <div style="font-size: 12px; color: #666;">Całkowita rzeczywistość</div>
                <div style="font-size: 24px; font-weight: bold; color: #f57c00;">
                  {{ budgets.reduce((sum, b) => sum + b.actualAmount, 0).toFixed(2) }} zł
                </div>
              </div>

              <!-- Całkowita różnica -->
              <div
                :style="{
                  padding: '12px',
                  backgroundColor: budgets.reduce((sum, b) => sum + b.difference, 0) >= 0 ? '#e8f5e9' : '#ffebee',
                  borderRadius: '4px',
                  borderLeft: '4px solid ' + (budgets.reduce((sum, b) => sum + b.difference, 0) >= 0 ? '#388e3c' : '#d32f2f')
                }"
              >
                <div style="font-size: 12px; color: #666;">Całkowita różnica</div>
                <div
                  :style="{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: budgets.reduce((sum, b) => sum + b.difference, 0) >= 0 ? '#388e3c' : '#d32f2f'
                  }"
                >
                  {{ budgets.reduce((sum, b) => sum + b.difference, 0) >= 0 ? '+' : '' }}{{ budgets.reduce((sum, b) => sum + b.difference, 0).toFixed(2) }} zł
                </div>
              </div>

              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

              <!-- Tabela detali -->
              <h4>Szczegóły po kategoriach</h4>
              <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; font-size: 12px;">
                <thead>
                  <tr style="background-color: #f5f5f5;">
                    <th>Kategoria</th>
                    <th>Plan</th>
                    <th>Rzeczywistość</th>
                    <th>Liczba wpisów</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="budget in budgets" :key="budget._id">
                    <td>
                      <strong>{{ budget.category }}</strong>
                      <br />
                      <span style="font-size: 10px; color: #999;">
                        {{ budget.subcategory || '-' }}
                      </span>
                    </td>
                    <td style="text-align: right;">{{ budget.plannedAmount.toFixed(2) }} zł</td>
                    <td style="text-align: right;">{{ budget.actualAmount.toFixed(2) }} zł</td>
                    <td style="text-align: center;">{{ budget.transactionCount || 0 }}</td>
                    <td
                      :style="{
                        textAlign: 'center',
                        backgroundColor: budget.difference >= 0 ? '#c8e6c9' : '#ffcdd2',
                        fontWeight: 'bold',
                        color: budget.difference >= 0 ? '#2e7d32' : '#c62828'
                      }"
                    >
                      {{ budget.difference >= 0 ? '✓ OK' : '✗ PRZEKR.' }}
                    </td>
                  </tr>
                </tbody>
              </table>

              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

              <!-- Rozwijane detale dla każdej kategorii -->
              <h4>Szczegółowe wydatki</h4>
              <div v-for="budget in budgets" :key="budget._id" style="margin-bottom: 20px; border: 1px solid #ddd; padding: 12px; border-radius: 4px;">
                <div style="font-weight: bold; margin-bottom: 8px; display: flex; justify-content: space-between;">
                  <span>{{ budget.category }}</span>
                  <span style="font-size: 12px; font-weight: normal;">
                    Plan: {{ budget.plannedAmount.toFixed(2) }} zł | Wydano: {{ budget.actualAmount.toFixed(2) }} zł
                  </span>
                </div>
                
                <div v-if="budget.transactions && budget.transactions.length">
                  <div style="font-size: 11px; color: #666; margin-bottom: 8px;">
                    Liczba transakcji: {{ budget.transactions.length }}
                  </div>
                  <table border="1" cellspacing="0" cellpadding="6" style="width: 100%; font-size: 11px;">
                    <thead>
                      <tr style="background-color: #f9f9f9;">
                        <th>Data</th>
                        <th>Kwota</th>
                        <th>Podkategoria</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(trans, idx) in budget.transactions" :key="idx">
                        <td>{{ new Date(trans.createdAt).toLocaleDateString('pl-PL') }}</td>
                        <td style="text-align: right;">{{ trans.amount.toFixed(2) }} zł</td>
                        <td>{{ trans.subcategory || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else style="color: #999; font-size: 12px;">
                  Brak transakcji w tym miesiącu
                </div>
              </div>
            </div>

            <p v-else style="color: #999; text-align: center; padding: 40px 20px;">
              Brak danych do wyświetlenia.
              <br />
              Dodaj budżet po lewej stronie.
            </p>
          </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
button {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #1565c0;
}

input[type='number'],
select {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px;
  font-family: inherit;
}

input[type='number']:focus,
select:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}
</style>

    