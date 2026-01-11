# Przypadki użycia.

## UC-01: Rejestracja nowego użytkownika

**Aktor:** Nowy użytkownik

**Warunki wstępne:** Brak

**Przebieg główny:**
1. Użytkownik otwiera formularz rejestracji
2. Użytkownik wprowadza adres email
3. Użytkownik wprowadza hasło
4. Użytkownik klika przycisk "Zarejestruj"
5. System waliduje dane (email + hasło niepuste)
6. System sprawdza czy użytkownik o tym emailu nie istnieje w bazie
7. System hashuje hasło algorytmem bcrypt (10 salt rounds)
8. System zapisuje użytkownika w bazie MongoDB
9. System zwraca potwierdzenie rejestracji (201)
10. System wyświetla komunikat sukcesu
11. System przekierowuje użytkownika do strony logowania

**Przebieg alternatywny 5a: Dane nieprawidłowe**
- 5a1. System wykrywa że email lub hasło jest puste
- 5a2. System zwraca błąd 400 "Email i hasło jest wymagane"
- 5a3. System wyświetla komunikat błędu
- 5a4. Koniec przypadku użycia (niepomyślny)

**Przebieg alternatywny 6a: Użytkownik już istnieje**
- 6a1. System wykrywa użytkownika o podanym emailu w bazie
- 6a2. System zwraca błąd 409 "Użytkownik o tym adresie email już istnieje"
- 6a3. System wyświetla komunikat błędu
- 6a4. Koniec przypadku użycia (niepomyślny)

**Warunki końcowe:**
- Nowy użytkownik jest utworzony w bazie danych
- Hasło jest zahashowane
- Użytkownik może się zalogować

---

## UC-02: Logowanie użytkownika

**Aktor:** Zarejestrowany użytkownik

**Warunki wstępne:** Użytkownik ma konto w systemie

**Przebieg główny:**
1. Użytkownik otwiera formularz logowania
2. Użytkownik wprowadza email
3. Użytkownik wprowadza hasło
4. Użytkownik klika przycisk "Zaloguj"
5. System waliduje dane (email + hasło niepuste)
6. System sprawdza czy użytkownik istnieje w bazie
7. System weryfikuje hasło (bcrypt.compare)
8. System generuje token uwierzytelniający
9. System zwraca token i dane użytkownika (200)
10. System przechowuje token w localStorage
11. System wyświetla komunikat powitalny
12. System przekierowuje użytkownika do dashboardu

**Przebieg alternatywny 6a: Użytkownik nie istnieje**
- 6a1. System nie znajduje użytkownika o podanym emailu
- 6a2. System zwraca błąd 401 "Nieprawidłowe dane logowania"
- 6a3. Koniec przypadku użycia (niepomyślny)

**Przebieg alternatywny 7a: Nieprawidłowe hasło**
- 7a1. bcrypt.compare zwraca false
- 7a2. System zwraca błąd 401 "Nieprawidłowe dane logowania"
- 7a3. Koniec przypadku użycia (niepomyślny)

**Warunki końcowe:**
- Użytkownik jest zalogowany
- Token jest przechowany w przeglądarce
- Użytkownik ma dostęp do chronion
