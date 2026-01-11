# 💰 Planer Oszczędności

Aplikacja webowa do zarządzania budżetem osobistym, śledzenia dochodów, wydatków i planowania oszczędności.

## 📋 Opis projektu

Planer Oszczędności to narzędzie wspierające użytkowników w kontrolowaniu finansów osobistych poprzez:
- Rejestrację i kategoryzację dochodów oraz wydatków
- Tworzenie budżetów miesięcznych z porównaniem planu do rzeczywistości
- Zarządzanie kategoriami i podkategoriami transakcji
- Analizę wydatków w czasie rzeczywistym

## 🚀 Stos technologiczny

**Backend:**
- Node.js + Express 5.2.1
- MongoDB + Mongoose 9.1.1
- JWT dla autentykacji (jsonwebtoken 9.0.3)
- bcryptjs 3.0.3 (hashowanie haseł)
- CORS 2.8.5
- dotenv 17.2.3

**Frontend:**
- Vue.js
- Axios (komunikacja z API)

## 📂 Struktura projektu

```
Planer_oszczednosci/
├── backend/
│   ├── models/              # Modele MongoDB (User, Income, Expense, Category, Budget)
│   ├── server.js            # Główny plik serwera + routing
│   ├── package.json
│   └── .env                 # Zmienne środowiskowe
├── forntend/
│   └── planer-frontend/     # Aplikacja Vue.js
├── docs/                    # Dokumentacja projektu
│   ├── REQUIREMENTS.md
│   ├── ARCHITECTURE.md
│   ├── MODULES.md
│   ├── USE_CASES.md
│   └── SETUP.md
└── README.md
```

## ⚙️ Szybki start

### Wymagania wstępne
- Node.js (v14+)
- MongoDB (lokalnie lub MongoDB Atlas)
- npm

### Instalacja

**Backend:**
```bash
cd backend
npm install
# Skonfiguruj plik .env z połączeniem do MongoDB
npm start
```

**Frontend:**
```bash
cd forntend/planer-frontend
npm install
npm run serve
```

Szczegółowe instrukcje znajdują się w [docs/SETUP.md](./docs/SETUP.md)

## 📖 Dokumentacja

- **[Wymagania funkcjonalne i niefunkcjonalne](./docs/REQUIREMENTS.md)** - szczegółowy opis wymagań systemu
- **[Architektura systemu](./docs/ARCHITECTURE.md)** - diagram i opis architektury
- **[Moduły i funkcjonalności](./docs/MODULES.md)** - opis modułów backendu i frontendu
- **[Przypadki użycia](./docs/USE_CASES.md)** - scenariusze użycia aplikacji
- **[Instrukcja instalacji](./docs/SETUP.md)** - krok po kroku jak uruchomić projekt

## 🔑 Kluczowe funkcjonalności

### Zarządzanie użytkownikami
- Rejestracja z hashowaniem haseł (bcrypt)
- Logowanie z tokenem uwierzytelniającym

### Zarządzanie finansami
- Dodawanie dochodów z kategorią, podkategorią i datą
- Dodawanie wydatków z pełną kategoryzacją
- Edycja i usuwanie transakcji
- Lista transakcji posortowana po dacie

### Kategorie
- Tworzenie kategorii dochodów i wydatków
- Hierarchia kategorie → podkategorie
- Automatyczna aktualizacja nazw w istniejących transakcjach
- Blokada usuwania kategorii z powiązanymi transakcjami

### Planowanie budżetu
- Tworzenie budżetu miesięcznego dla wybranych kategorii
- Porównanie planu vs. rzeczywiste wydatki
- Automatyczne obliczanie różnicy
- Lista transakcji składających się na rzeczywistość
- Zapobieganie duplikatom budżetu (ten sam miesiąc + kategoria)

## 🛣️ Roadmap

- [ ] Implementacja pełnego JWT (obecnie fake token)
- [ ] Wykresy i wizualizacje wydatków
- [ ] Eksport danych do CSV/PDF
- [ ] Powiadomienia o przekroczeniu budżetu
- [ ] Aplikacja mobilna (React Native)
- [ ] Wielowalutowość
- [ ] Raporty miesięczne/roczne

## 🤝 Wkład w projekt

Projekt jest rozwijany w ramach studiów informatycznych na UBB.

## 📄 Licencja

ISC

## 👨‍💻 Autor

**tomek1852**
- GitHub: [@tomek1852](https://github.com/tomek1852)

---

Projekt: Planer Oszczędności | 5 semestr | UBB
