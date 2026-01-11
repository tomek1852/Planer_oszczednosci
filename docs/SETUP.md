# Instrukcja instalacji i uruchomienia.

## Wymagania wstępne

- **Node.js** (wersja 14 lub nowsza) - [Pobierz tutaj](https://nodejs.org/)
- **MongoDB** (lokalnie lub MongoDB Atlas w chmurze)
- **npm** (zainstalowany z Node.js)
- **Git** (opcjonalnie, do klonowania repozytorium)

### Sprawdzenie wersji

```bash
node --version  # Powinno wyświetlić v14.x.x lub nowszą
npm --version   # Powinno wyświetlić 6.x.x lub nowszą
mongo --version # Weryfikacja MongoDB (jeśli lokalnie)
```

---

## Krok 1: Pobranie projektu

### Opcja A: Klonowanie przez Git

```bash
git clone https://github.com/tomek1852/Planer_oszczednosci.git
cd Planer_oszczednosci
```

### Opcja B: Pobieranie jako ZIP

1. Wejśdź na https://github.com/tomek1852/Planer_oszczednosci
2. Kliknij "Code" → "Download ZIP"
3. Rozpakuj archiwum
4. Otwórz terminal w folderze projektu

---

## Krok 2: Konfiguracja backendu

### 2.1 Instalacja zależności

```bash
cd backend
npm install
```

To zainstaluje:
- `express` (5.2.1)
- `mongoose` (9.1.1)
- `bcryptjs` (3.0.3)
- `jsonwebtoken` (9.0.3)
- `cors` (2.8.5)
- `dotenv` (17.2.3)

### 2.2 Konfiguracja zmiennych środowiskowych

**MongoDB lokalnie:**

Utwórz plik `.env` w folderze `backend/`:

```env
DB_URI=mongodb://localhost:27017/planer_oszczednosci
PORT=3000
```

**MongoDB Atlas (chmura):**

1. Utwórz darmowe konto na [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Utwórz klaster
3. Dodaj użytkownika bazy danych
4. Dodaj swój adres IP do whitelist (lub 0.0.0.0/0 dla testów)
5. Skopiuj connection string

```env
DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/planer_oszczednosci?retryWrites=true&w=majority
PORT=3000
```

Zastąp `<username>` i `<password>` swoimi danymi.

### 2.3 Uruchomienie backendu

```bash
node server.js
```

**Oczekiwany output:**
```
Połączono
Serwer na http://localhost:3000
```

### 2.4 Weryfikacja backendu

W nowym terminalu:

```bash
curl http://localhost:3000
# Powinno zwrócić: Działa!
```

Lub otwórz w przeglądarce: `http://localhost:3000`

---

## Krok 3: Konfiguracja frontendu

### 3.1 Instalacja zależności

W **nowym terminalu** (pozostaw backend działający):

```bash
cd forntend/planer-frontend
npm install
```

### 3.2 Konfiguracja połączenia z API

Upewnij się, że w plikach Vue.js URL API wskazuje na backend:

```javascript
// Przykład w pliku API/axios config
const API_URL = 'http://localhost:3000/api'
```

Jeśli backend działa na innym porcie, zmień odpowiednio.

### 3.3 Uruchomienie frontendu

```bash
npm run serve
```

**Oczekiwany output:**
```
App running at:
- Local:   http://localhost:8080/
- Network: http://192.168.x.x:8080/
```

### 3.4 Otwarcie aplikacji

Otwórz przeglądarkę na adresie: **http://localhost:8080**

---

## Krok 4: Testowanie aplikacji

### 4.1 Rejestracja i logowanie

1. Otwórz `http://localhost:8080`
2. Przejdź do formularza rejestracji
3. Wprowadź email i hasło
4. Kliknij "Zarejestruj"
5. Zaloguj się podanymi danymi

### 4.2 Testowanie funkcji

**Kategorie:**
1. Przejdź do zarządzania kategoriami
2. Dodaj kategorię "Jedzenie" (wydatek)
3. Dodaj kategorię "Wynagrodzenie" (dochód)

**Transakcje:**
1. Dodaj dochód: 5000 zł, kategoria "Wynagrodzenie"
2. Dodaj wydatek: 250 zł, kategoria "Jedzenie"
3. Sprawdź listę transakcji

**Budżet:**
1. Utwórz budżet na bieżący miesiąc
2. Kategoria "Jedzenie", planowana kwota: 1500 zł
3. Sprawdź porównanie planu vs. rzeczywistość

---

## Struktura katalogów projektu

```
Planer_oszczednosci/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Income.js
│   │   ├── Expense.js
│   │   ├── Category.js
│   │   └── Budget.js
│   ├── node_modules/       # Zależności (generowane przez npm install)
│   ├── server.js           # Główny plik serwera
│   ├── package.json
│   ├── package-lock.json
│   └── .env                # Zmienne środowiskowe (tworzysz ręcznie)
├── forntend/
│   └── planer-frontend/
│       ├── src/
│       │   ├── components/     # Komponenty Vue
│       │   ├── views/          # Widoki (strony)
│       │   ├── router/         # Vue Router
│       │   ├── store/          # Vuex (jeśli używane)
│       │   └── App.vue
│       ├── public/
│       ├── node_modules/
│       ├── package.json
│       └── package-lock.json
├── docs/                   # Dokumentacja
│   ├── REQUIREMENTS.md
│   ├── ARCHITECTURE.md
│   ├── MODULES.md
│   ├── USE_CASES.md
│   └── SETUP.md (ten plik)
└── README.md
```

---

## Rozwiązywanie problemów

### Backend nie łączy się z MongoDB

**Problem:** `Błąd: MongooseServerSelectionError`

**Rozwiązania:**

1. **MongoDB lokalne:**
   ```bash
   # Sprawdź czy MongoDB działa
   sudo systemctl status mongod   # Linux
   brew services list             # macOS
   
   # Uruchom MongoDB
   sudo systemctl start mongod    # Linux
   brew services start mongodb-community  # macOS
   ```

2. **MongoDB Atlas:**
   - Sprawdź czy connection string jest poprawny
   - Zweryfikuj username/password
   - Dodaj swój IP do Atlas Network Access (lub 0.0.0.0/0)
   - Sprawdź czy klaster jest aktywny

### Port już zajęty

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Rozwiązanie:**

```bash
# Znajdź proces używający portu 3000
lsof -i :3000       # Linux/macOS
netstat -ano | findstr :3000  # Windows

# Zakończ proces lub zmień PORT w .env
PORT=3001
```

### CORS errors w przeglądarce

**Problem:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Rozwiązanie:**

1. Sprawdź czy backend ma CORS włączony:
   ```javascript
   // backend/server.js
   const cors = require('cors')
   app.use(cors())  // To powinno być obecne
   ```

2. Upewnij się, że frontend wysyła żądania na właściwy URL (http://localhost:3000/api)

### npm install kończy się błędem

**Problem:** `npm ERR! code EINTEGRITY`

**Rozwiązanie:**

```bash
# Wyczyść cache i ponów instalację
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Frontend nie ładuje się

**Problem:** Biała strona po otwarciu http://localhost:8080

**Rozwiązanie:**

1. Sprawdź konsolę przeglądarki (F12)
2. Zrestartuj serwer developerski:
   ```bash
   # Ctrl+C aby zatrzymać
   npm run serve
   ```

---

## Uruchomienie dla produkcji

### Backend

**Opcja 1: PM2 (Process Manager)**

```bash
# Instalacja PM2 globalnie
npm install -g pm2

# Uruchomienie backendu
cd backend
pm2 start server.js --name "planer-api"

# Sprawdzenie statusu
pm2 status

# Logi
pm2 logs planer-api

# Restart
pm2 restart planer-api

# Zatrzymanie
pm2 stop planer-api
```

**Opcja 2: systemd (Linux)**

```bash
# Utwórz plik serwisu
sudo nano /etc/systemd/system/planer-api.service

# Zawartość pliku:
[Unit]
Description=Planer Oszczednosci API
After=network.target

[Service]
Type=simple
User=your_user
WorkingDirectory=/path/to/Planer_oszczednosci/backend
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target

# Uruchomienie
sudo systemctl start planer-api
sudo systemctl enable planer-api  # Autostart przy boot
```

### Frontend

**Build produkcyjny:**

```bash
cd forntend/planer-frontend
npm run build
```

To utworzy folder `dist/` z zoptymalizowanymi plikami statycznymi.

**Wdrożenie na nginx:**

```nginx
server {
    listen 80;
    server_name twoja-domena.pl;
    
    root /ścieżka/do/Planer_oszczednosci/forntend/planer-frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Dodatkowe komendy

### Development

```bash
# Backend - automatyczny restart przy zmianach (nodemon)
npm install -g nodemon
cd backend
nodemon server.js

# Frontend - hot reload (domyślnie włączony)
cd forntend/planer-frontend
npm run serve

# Sprawdzenie logów MongoDB (lokalnie)
tail -f /var/log/mongodb/mongod.log
```

### Backup bazy danych

```bash
# Eksport (MongoDB lokalnie)
mongodump --db planer_oszczednosci --out ./backup

# Import
mongorestore --db planer_oszczednosci ./backup/planer_oszczednosci

# Eksport do JSON
mongoexport --db planer_oszczednosci --collection users --out users.json
```

### Testy

```bash
# Testy backendu (jeśli skonfigurowane)
cd backend
npm test

# Testy frontendu
cd forntend/planer-frontend
npm run test:unit
```

---

## Więcej informacji

- **Dokumentacja MongoDB:** https://docs.mongodb.com/
- **Dokumentacja Express:** https://expressjs.com/
- **Dokumentacja Vue.js:** https://vuejs.org/guide/
- **Mongoose Guide:** https://mongoosejs.com/docs/guide.html

---

## Pomoc

Jeśli napotkasz problemy:

1. Sprawdź logi backendu (terminal gdzie uruchomiony `node server.js`)
2. Sprawdź konsolę przeglądarki (F12 → Console)
3. Zweryfikuj połączenie z MongoDB
4. Upewnij się, że wszystkie zależności są zainstalowane (`npm install`)

Powodzenia! 🚀
