# Wymagania projektu

## Wymagania funkcjonalne

### RF-01: Zarządzanie użytkownikami
- **RF-01.1** System umożliwia rejestrację nowego użytkownika (email + hasło)
- **RF-01.2** System waliduje unikalność adresu email przy rejestracji
- **RF-01.3** System hashuje hasła użytkowników algorytmem bcrypt (10 salt rounds)
- **RF-01.4** System umożliwia logowanie z weryfikacją danych
- **RF-01.5** System generuje token uwierzytelniający po zalogowaniu
- **RF-01.6** System wymagają niepustego emaila i hasła

### RF-02: Zarządzanie dochodami
- **RF-02.1** Użytkownik może dodać dochód z kategorią, podkategorią i datą
- **RF-02.2** System wymaga podania userId, amount i category
- **RF-02.3** Podkategoria i data są opcjonalne (domyślnie data bieżąca)
- **RF-02.4** Użytkownik może pobrać listę swoich dochodów
- **RF-02.5** Dochody są sortowane po dacie utworzenia (najnowsze pierwsze)
- **RF-02.6** Użytkownik może edytować kwotę dochodu
- **RF-02.7** Użytkownik może usunąć pojedynczy dochód

### RF-03: Zarządzanie wydatkami
- **RF-03.1** Użytkownik może dodać wydatek z kategorią, podkategorią i datą
- **RF-03.2** System wymaga podania userId, amount i category
- **RF-03.3** Podkategoria i data są opcjonalne
- **RF-03.4** Użytkownik może pobrać listę swoich wydatków
- **RF-03.5** Wydatki są sortowane po dacie utworzenia (najnowsze pierwsze)
- **RF-03.6** Użytkownik może edytować kwotę wydatku
- **RF-03.7** Użytkownik może usunąć pojedynczy wydatek

### RF-04: Zarządzanie kategoriami
- **RF-04.1** Użytkownik może tworzyć kategorie dochodów i wydatków
- **RF-04.2** Użytkownik może tworzyć podkategorie (hierarchia parent-child)
- **RF-04.3** System wymaga podania userId, kind (income/expense) i name
- **RF-04.4** Użytkownik może pobrać listę kategorii z filtrowaniem po typie
- **RF-04.5** Kategorie są sortowane alfabetycznie po nazwie
- **RF-04.6** Użytkownik może edytować nazwę kategorii
- **RF-04.7** System automatycznie aktualizuje nazwę kategorii we wszystkich powiązanych dochodach
- **RF-04.8** System automatycznie aktualizuje nazwę kategorii we wszystkich powiązanych wydatkach
- **RF-04.9** Użytkownik może usunąć kategorię
- **RF-04.10** System blokuje usuwanie kategorii, która ma powiązane dochody lub wydatki

### RF-05: Planowanie budżetu
- **RF-05.1** Użytkownik może tworzyć budżet miesięczny dla kategorii/podkategorii
- **RF-05.2** System wymaga podania userId, kind, category, month, year i plannedAmount
- **RF-05.3** System zapobiega tworzeniu duplikatów budżetu (ten sam miesiąc + kategoria)
- **RF-05.4** Użytkownik może pobrać budżety z automatycznym obliczeniem rzeczywistości
- **RF-05.5** System oblicza rzeczywiste wydatki/dochody na podstawie transakcji z danego miesiąca
- **RF-05.6** System oblicza różnicę między planem a rzeczywistością
- **RF-05.7** System zwraca liczbę transakcji składających się na rzeczywistość
- **RF-05.8** System zwraca listę transakcji z kwotami i datami
- **RF-05.9** Użytkownik może edytować planowaną kwotę budżetu
- **RF-05.10** Użytkownik może usunąć budżet

## Wymagania niefunkcjonalne

### Technologia

#### Backend
- **NFR-01** System wykorzystuje Node.js z frameworkiem Express 5.2.1
- **NFR-02** System wykorzystuje bazę danych MongoDB z Mongoose ODM 9.1.1
- **NFR-03** System wykorzystuje bcryptjs 3.0.3 do hashowania haseł
- **NFR-04** System wykorzystuje jsonwebtoken 9.0.3 do autentykacji (do rozbudowy)
- **NFR-05** System wykorzystuje CORS 2.8.5 do komunikacji między domenami
- **NFR-06** System wykorzystuje dotenv 17.2.3 do zarządzania zmiennymi środowiskowymi

#### Frontend
- **NFR-07** System wykorzystuje framework Vue.js
- **NFR-08** System wykorzystuje Axios do komunikacji z API

### Wydajność
- **NFR-09** Czas odpowiedzi API dla standardowych operacji CRUD < 500ms
- **NFR-10** System obsługuje wielu równoczesnych użytkowników
- **NFR-11** Zapytania do bazy danych wykorzystują indeksy (userId, createdAt)
- **NFR-12** Lista transakcji jest sortowana po stronie bazy danych

### Bezpieczeństwo
- **NFR-13** Hasła są hashowane algorytmem bcrypt z 10 salt rounds
- **NFR-14** Hasła nie są nigdy przechowywane w plain text
- **NFR-15** Wszystkie endpointy walidują dane wejściowe
- **NFR-16** System sprawdza wymagane pola przed zapisa