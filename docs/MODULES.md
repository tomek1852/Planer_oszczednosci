# Moduły systemu.

## Moduły backendowe

### 1. Moduł autentykacji

**Plik:** `backend/server.js`

**Endpointy:**
- `POST /api/register`
- `POST /api/login`

**Funkcjonalności:**
- Rejestracja użytkownika z walidacją email/hasło
- Sprawdzanie unikalności emaila
- Hashowanie haseł (bcrypt, 10 rounds)
- Logowanie z weryfikacją hasła
- Generowanie tokenu (obecnie fake token - do rozbudowy o JWT)

**Modele:**
- `User` (backend/models/User.js)

**Przykład użycia:**
```javascript
// Rejestracja
POST /api/register
{
  "email": "jan@example.com",
  "password": "bezpieczneHaslo123"
}

// Odpowiedź
{
  "message": "Uzytkownik zarejestrowany",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "jan@example.com"
  }
}

// Logowanie
POST /api/login
{
  "email": "jan@example.com",
  "password": "bezpieczneHaslo123"
}

// Odpowiedź
{
  "message": "Zalogowano",
  "token": "FAKE_TOKEN-507f1f77bcf86cd799439011",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "jan@example.com"
  }
}
```

---

### 2. Moduł dochodów

**Plik:** `backend/server.js`

**Endpointy:**
- `POST /api/income` - dodawanie dochodu
- `GET /api/income?userId=X` - pobieranie dochodów
- `PUT /api/income/:id` - aktualizacja kwoty
- `DELETE /api/income/:id` - usuwanie dochodu

**Funkcjonalności:**
- Dodawanie dochodów z kategorią, podkategorią, datą
- Pobieranie listy dochodów użytkownika (sortowanie po dacie malejąco)
- Edycja kwoty istniejącego dochodu
- Usuwanie pojedynczego dochodu

**Modele:**
- `Income` (backend/models/Income.js)

**Przykład użycia:**
```javascript
// Dodawanie dochodu
POST /api/income
{
  "userId": "507f1f77bcf86cd799439011",
  "amount": 5000,
  "category": "Wynagrodzenie",
  "subcategory": "Pensja",
  "date": "2026-01-10"
}

// Odpowiedź
{
  "message": "Dochód zapisany",
  "income": {
    "_id": "...",
    "userId": "507f1f77bcf86cd799439011",
    "amount": 5000,
    "category": "Wynagrodzenie",
    "subcategory": "Pensja",
    "createdAt": "2026-01-10T00:00:00.000Z"
  }
}

// Pobieranie dochodów
GET /api/income?userId=507f1f77bcf86cd799439011

// Aktualizacja
PUT /api/income/60d5ec49f1b2c72b8c8e4f1a
{
  "amount": 5500
}

// Usuwanie
DELETE /api/income/60d5ec49f1b2c72b8c8e4f1a
```

---

### 3. Moduł wydatków

**Plik:** `backend/server.js`

**Endpointy:**
- `POST /api/expense` - dodawanie wydatku
- `GET /api/expense?userId=X` - pobieranie wydatków
- `PUT /api/expense/:id` - aktualizacja kwoty
- `DELETE /api/expense/:id` - usuwanie wydatku

**Funkcjonalności:**
- Dodawanie wydatków z kategorią, podkategorią, datą
- Pobieranie listy wydatków użytkownika (sortowanie po dacie malejąco)
- Edycja kwoty istniejącego wydatku
- Usuwanie pojedynczego wydatku

**Modele:**
- `Expense` (backend/models/Expense.js)

**Przykład użycia:**
```javascript
// Dodawanie wydatku
POST /api/expense
{
  "userId": "507f1f77bcf86cd799439011",
  "amount": 250,
  "category": "Jedzenie",
  "subcategory": "Restauracje",
  "date": "2026-01-11"
}

// Odpowiedź
{
  "message": "Wydatek zapisany",
  "expense": {
    "_id": "...",
    "userId": "507f1f77bcf86cd799439011",
    "amount": 250,
    "category": "Jedzenie",
    "subcategory": "Restauracje",
    "createdAt": "2026-01-11T00:00:00.000Z"
  }
}
```

---

### 4. Moduł kategorii

**Plik:** `backend/server.js`

**Endpointy:**
- `GET /api/categories?userId=X&kind=income|expense` - lista kategorii
- `POST /api/categories` - dodawanie kategorii/podkategorii
- `PUT /api/categories/:id` - edycja nazwy (+ aktualizacja w transakcjach)
- `DELETE /api/categories/:id` - usuwanie kategorii (z zabezpieczeniem)

**Funkcjonalności:**
- Tworzenie kategorii dochodów i wydatków
- Tworzenie podkategorii (hierarchia parent-child)
- Filtrowanie kategorii po typie (income/expense)
- Edycja nazwy kategorii z **automatyczną aktualizacją** we wszystkich powiązanych dochodach i wydatkach
- Usuwanie kategorii z **blokadą**, gdy istnieją powiązane transakcje

**Modele:**
- `Category` (backend/models/Category.js)

**Przykład użycia:**
```javascript
// Dodawanie kategorii głównej
POST /api/categories
{
  "userId": "507f1f77bcf86cd799439011",
  "kind": "expense",
  "name": "Transport"
}

// Dodawanie podkategorii
POST /api/categories
{
  "userId": "507f1f77bcf86cd799439011",
  "kind": "expense",
  "name": "Benzyna",
  "parentId": "60d5ec49f1b2c72b8c8e4f20"
}

// Edycja nazwy kategorii (aktualizuje wszystkie transakcje!)
PUT /api/categories/60d5ec49f1b2c72b8c8e4f20
{
  "name": "Komunikacja"
}
// System automatycznie zmieni "Transport" na "Komunikacja" 
// we wszystkich dochodach i wydatkach

// Usuwanie kategorii (blokada gdy są transakcje)
DELETE /api/categories/60d5ec49f1b2c72b8c8e4f20
// Błąd 400: "Nie można usunąć kategorii powiązanej z istniejącymi..."
```

---

### 5. Moduł budżetu

**Plik:** `backend/server.js`

**Endpointy:**
- `GET /api/budget?userId=X&kind=X&month=X&year=X` - budżety z rzeczywistością
- `POST /api/budget` - tworzenie budżetu
- `PUT /api/budget/:id` - aktualizacja planowanej kwoty
- `DELETE /api/budget/:id` - usuwanie budżetu

**Funkcjonalności:**
- Tworzenie budżetu miesięcznego dla kategorii/podkategorii
- Zapobieganie duplikatom (ten sam użytkownik + typ + kategoria + miesiąc + rok)
- **Automatyczne obliczanie rzeczywistości:**
  - Pobieranie transakcji z danego miesiąca
  - Sumowanie kwot
  - Obliczanie różnicy (plan - rzeczywistość)
  - Zwracanie listy transakcji składających się na rzeczywistość
- Edycja planowanej kwoty
- Usuwanie budżetu

**Modele:**
- `Budget` (backend/models/Budget.js)

**Logika biznesowa:**

Przy pobieraniu budżetów (`GET /api/budget`), system:
1. Pobiera budżety z bazy danych
2. Dla każdego budżetu:
   - Tworzy filtr dla transakcji (userId, category, subcategory, zakres dat miesiąca)
   - Pobiera transakcje z Income/Expense
   - Sumuje kwoty: `actualAmount = transactions.reduce((sum, t) => sum + t.amount, 0)`
   - Oblicza różnicę: `difference = plannedAmount - actualAmount`
3. Zwraca rozszerzone obiekty budżetu

**Przykład użycia:**
```javascript
// Tworzenie budżetu
POST /api/budget
{
  "userId": "507f1f77bcf86cd799439011",
  "kind": "expense",
  "category": "Jedzenie",
  "month": 1,
  "year": 2026,
  "plannedAmount": 1500
}

// Odpowiedź
{
  "message": "Budżet zapisany",
  "budget": {...}
}

// Pobieranie budżetów z rzeczywistością
GET /api/budget?userId=507f1f77bcf86cd799439011&kind=expense&month=1&year=2026

// Odpowiedź
[
  {
    "_id": "...",
    "userId": "507f1f77bcf86cd799439011",
    "kind": "expense",
    "category": "Jedzenie",
    "month": 1,
    "year": 2026,
    "plannedAmount": 1500,
    "actualAmount": 1234.50,    // Obliczone przez system
    "difference": 265.50,        // 1500 - 1234.50
    "transactionCount": 23,      // Ilość transakcji
    "transactions": [            // Lista transakcji
      {
        "createdAt": "2026-01-05T10:30:00.000Z",
        "amount": 120,
        "subcategory": "Restauracje"
      },
      {...}
    ]
  }
]
```

---

## Modele danych (MongoDB)

### User
**Plik:** `backend/models/User.js`

```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
```

### Income
**Plik:** `backend/models/Income.js`

```javascript
const incomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
})
```

### Expense
**Plik:** `backend/models/Expense.js`

Analogicznie do Income

### Category
**Plik:** `backend/models/Category.js`

```javascript
const categorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  kind: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
```

### Budget
**Plik:** `backend/models/Budget.js`

```javascript
const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  kind: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    default: ''
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  plannedAmount: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
```

---

## Moduły frontendowe

**Lokalizacja:** `forntend/planer-frontend/src/`

### 1. Moduł rejestracji/logowania
- Formularze rejestracji i logowania
- Walidacja danych (email, hasło)
- Przechowywanie tokenu (localStorage)
- Przekierowanie po zalogowaniu

### 2. Dashboard
- Widok główny aplikacji
- Podsumowanie finansowe (sumy dochodów/wydatków)
- Wykresy i statystyki (do implementacji)
- Najnowsze transakcje

### 3. Zarządzanie transakcjami
- Formularz dodawania dochodów/wydatków
- Lista transakcji z opcją edycji/usuwania
- Filtrowanie po kategoriach i datach
- Sortowanie

### 4. Zarządzanie kategoriami
- Lista kategorii dochodów i wydatków
- Dodawanie nowych kategorii
- Edycja nazw kategorii
- Usuwanie kategorii (z komunikatem błędu gdy są powiązania)

### 5. Planowanie budżetu
- Tworzenie budżetów miesięcznych
- Wybor kategorii z listy
- Wprowadzanie planowanych kwot
- Wizualizacja porównania plan vs. rzeczywistość
- Wskaźniki postępów (progress bars)
- Lista transakcji w ramach budżetu

---

## Komunikacja między modułami

### Frontend → Backend
- Protokół: HTTP/HTTPS
- Format: JSON
- Biblioteka: Axios
- Headers: `Content-Type: application/json`, `Authorization: Bearer <token>`

### Backend → Database
- ORM: Mongoose
- Operacje: CRUD (Create, Read, Update, Delete)
- Zapytania: Mongoose queries (find, findOne, findByIdAndUpdate, etc.)

### Przykład komunikacji:

```
Vue Component (Frontend)
  ↓ axios.post('/api/expense', data)
  ↓
Express Route (Backend)
  ↓ await Expense.save()
  ↓
Mongoose Model
  ↓ MongoDB Driver
  ↓
MongoDB Database
  ↓ zwraca dokument
  ↑
Express Route
  ↑ res.json(expense)
  ↑
Vue Component (aktualizuje widok)
```
