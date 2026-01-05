<script setup>
import { ref, onMounted, computed, watch } from 'vue'

const categories = ref([])
const message = ref('')

const kind = ref('income') // domyślnie dochody
const name = ref('')
const parentId = ref('') // '' = kategoria główna

const loadCategories = async () => {
  message.value = ''

  const userId = localStorage.getItem('planer_userId')
  if (!userId) {
    message.value = 'Brak danych użytkownika'
    categories.value = []
    return
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/categories?userId=${userId}&kind=${kind.value}`
    )

    if (!response.ok) {
      const err = await response.json()
      message.value = err.error || 'Błąd wczytywania kategorii'
      return
    }

    categories.value = await response.json()
  } catch (err) {
    console.error('Błąd pobierania kategorii:', err)
    message.value = 'Problem z połączeniem z serwerem'
  }
}

watch(kind, () => {
  loadCategories()
})

const addCategory = async () => {
  message.value = ''

  const userId = localStorage.getItem('planer_userId')
  if (!userId) {
    message.value = 'Brak danych użytkownika'
    return
  }

  try {
    const response = await fetch('http://localhost:3000/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        kind: kind.value,
        name: name.value,
        parentId: parentId.value || null
      })
    })

    const data = await response.json()

    if (!response.ok) {
      message.value = data.error || 'Błąd dodawania kategorii'
      return
    }

    name.value = ''
    parentId.value = ''
    await loadCategories()
  } catch (err) {
    console.error('Błąd dodawania kategorii:', err)
    message.value = 'Problem z połączeniem z serwerem'
  }
}

const deleteCategory = async (cat) => {
  message.value = ''

  const ok = window.confirm(`Usunąć kategorię "${cat.name}"?`)
  if (!ok) return

  try {
    const response = await fetch(
      `http://localhost:3000/api/categories/${cat._id}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.ok) {
      const err = await response.json()
      message.value = err.error || 'Błąd usuwania kategorii'
      return
    }

    await loadCategories()
  } catch (err) {
    console.error('Błąd usuwania kategorii:', err)
    message.value = 'Problem z połączeniem z serwerem'
  }
}

const editingId = ref('')
const editingName = ref('')

const startEdit = (cat) => {
  editingId.value = cat._id
  editingName.value = cat.name
}

const cancelEdit = () => {
  editingId.value = ''
  editingName.value = ''
}

const saveEdit = async (cat) => {
  message.value = ''

  if (!editingName.value.trim()) {
    message.value = 'Nazwa kategorii nie może być pusta'
    return
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/categories/${cat._id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingName.value.trim() })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      message.value = data.error || 'Błąd edycji kategorii'
      return
    }

    await loadCategories()
    cancelEdit()
  } catch (err) {
    console.error('Błąd edycji kategorii:', err)
    message.value = 'Problem z połączeniem z serwerem'
  }
}



const mainCategories = computed(() =>
  categories.value.filter(c => !c.parentId)
)

onMounted(() => {
  loadCategories()
})

</script>

<template>
  <div
    style="
      max-width: 700px;
      margin: 40px auto;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #ddd;
      background-color: #fafafa;
    "
  >
    <h2>Kategorie i podkategorie</h2>

    <p v-if="message">{{ message }}</p>

    <!-- Wybór typu: dochody / wydatki -->
    <div style="margin-bottom: 15px;">
      <label>Typ:</label>
      <select v-model="kind" @change="loadCategories" style="margin-left: 8px;">
        <option value="income">Dochody</option>
        <option value="expense">Wydatki</option>
      </select>
    </div>

    <!-- Formularz dodania kategorii/podkategorii -->
    <form @submit.prevent="addCategory" style="margin-bottom: 20px;">
      <div style="margin-bottom: 8px;">
        <label>Nazwa kategorii / podkategorii:</label><br />
        <input
          type="text"
          v-model="name"
          style="width: 100%; padding: 4px;"
          required
        />
      </div>

      <div style="margin-bottom: 8px;">
        <label>Rodzic (opcjonalne):</label><br />
        <select v-model="parentId" style="width: 100%; padding: 4px;">
          <option value="">(kategoria główna)</option>
          <option
            v-for="cat in mainCategories"
            :key="cat._id"
            :value="cat._id"
          >
            {{ cat.name }}
          </option>
        </select>
      </div>

      <button type="submit" style="padding: 6px 14px;">
        Zapisz kategorię
      </button>
    </form>

    <!-- Lista kategorii/podkategorii -->
    <h3>Lista kategorii</h3>

    <ul style="list-style: none; padding-left: 0;">
      <!-- Wyświetl tylko kategorie główne -->
      <template v-for="mainCat in mainCategories" :key="mainCat._id">
        <li
          style="
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 4px 8px;
            border-radius: 4px;
          "
          class="category-row"
        >
          <div style="flex: 1; font-weight: 600;">
            <template v-if="editingId === mainCat._id">
              <input
                v-model="editingName"
                style="width: 100%; padding: 2px 4px;"
              />
            </template>
            <template v-else>
              {{ mainCat.name }}
            </template>
          </div>

          <div class="category-actions" style="display: flex; gap: 6px;">
            <template v-if="editingId === mainCat._id">
              <button
                @click="saveEdit(mainCat)"
                style="
                  padding: 2px 8px;
                  font-size: 12px;
                  border-radius: 4px;
                  border: 1px solid #4caf50;
                  background-color: #e8f5e9;
                  color: #2e7d32;
                  cursor: pointer;
                "
              >
                Zapisz
              </button>
              <button
                @click="cancelEdit"
                style="
                  padding: 2px 8px;
                  font-size: 12px;
                  border-radius: 4px;
                  border: 1px solid #9e9e9e;
                  background-color: #f5f5f5;
                  color: #424242;
                  cursor: pointer;
                "
              >
                Anuluj
              </button>
            </template>
            <template v-else>
              <button
                @click="startEdit(mainCat)"
                style="
                  padding: 2px 8px;
                  font-size: 12px;
                  border-radius: 4px;
                  border: 1px solid #64b5f6;
                  background-color: #e3f2fd;
                  color: #1565c0;
                  cursor: pointer;
                "
              >
                Edytuj
              </button>
              <button
                @click="deleteCategory(mainCat)"
                style="
                  padding: 2px 8px;
                  font-size: 12px;
                  border-radius: 4px;
                  border: 1px solid #e57373;
                  background-color: #ffebee;
                  color: #c62828;
                  cursor: pointer;
                "
              >
                Usuń
              </button>
            </template>
          </div>
        </li>

        <!-- Podkategorie tego rodzica -->
        <template
          v-for="subCat in categories.filter(c => c.parentId === mainCat._id)"
          :key="subCat._id"
        >
          <li
            style="
              margin-bottom: 4px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 4px 8px;
              padding-left: 24px;
              border-radius: 4px;
            "
            class="category-row"
          >
            <div style="flex: 1;">
              <template v-if="editingId === subCat._id">
                <input
                  v-model="editingName"
                  style="width: 100%; padding: 2px 4px;"
                />
              </template>
              <template v-else>
                - {{ subCat.name }}
              </template>
            </div>

            <div class="category-actions" style="display: flex; gap: 6px;">
              <template v-if="editingId === subCat._id">
                <button
                  @click="saveEdit(subCat)"
                  style="
                    padding: 2px 8px;
                    font-size: 12px;
                    border-radius: 4px;
                    border: 1px solid #4caf50;
                    background-color: #e8f5e9;
                    color: #2e7d32;
                    cursor: pointer;
                  "
                >
                  Zapisz
                </button>
                <button
                  @click="cancelEdit"
                  style="
                    padding: 2px 8px;
                    font-size: 12px;
                    border-radius: 4px;
                    border: 1px solid #9e9e9e;
                    background-color: #f5f5f5;
                    color: #424242;
                    cursor: pointer;
                  "
                >
                  Anuluj
                </button>
              </template>
              <template v-else>
                <button
                  @click="startEdit(subCat)"
                  style="
                    padding: 2px 8px;
                    font-size: 12px;
                    border-radius: 4px;
                    border: 1px solid #64b5f6;
                    background-color: #e3f2fd;
                    color: #1565c0;
                    cursor: pointer;
                  "
                >
                  Edytuj
                </button>
                <button
                  @click="deleteCategory(subCat)"
                  style="
                    padding: 2px 8px;
                    font-size: 12px;
                    border-radius: 4px;
                    border: 1px solid #e57373;
                    background-color: #ffebee;
                    color: #c62828;
                    cursor: pointer;
                  "
                >
                  Usuń
                </button>
              </template>
            </div>
          </li>
        </template>
      </template>
    </ul>
  </div>
</template>

<style scoped>
.category-row {
  transition: background-color 0.15s ease;
}

.category-row:hover {
  background-color: #f0f0f0;
}

/* domyślnie ukryj przyciski */
.category-actions {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}

/* pokaż przyciski dopiero przy hoverze na wiersz */
.category-row:hover .category-actions {
  opacity: 1;
  pointer-events: auto;
}
</style>
