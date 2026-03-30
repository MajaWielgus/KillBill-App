# KillBill-App 💸

Aplikacja typu Full-Stack (MERN) do inteligentnego zarządzania subskrypcjami i kontrolowania miesięcznych wydatków.

---

## 📋 Spis treści
1. [O projekcie](#-o-projekcie)
2. [Funkcjonalności](#-funkcjonalności)
3. [Technologie](#%EF%B8%8F-technologie)
4. [Instalacja i uruchomienie](#%EF%B8%8F-instalacja-i-uruchomienie)
5. [Struktura projektu](#-struktura-projektu)
6. [Zautomatyzowane Testy End-to-End (E2E)](#-zautomatyzowane-testy-end-to-end-e2e)
7. [Autorzy](#%E2%80%8D-autorzy)
   
---

## 🎯 O projekcie

**KillBill-App** powstał, aby rozwiązać problem "ukrytych kosztów" wynikających z posiadania wielu subskrypcji. Aplikacja pozwala użytkownikowi w jednym miejscu zgromadzić informacje o płatnościach za serwisy streamingowe, karnety czy oprogramowanie.

Głównym celem projektu było stworzenie narzędzia, które nie tylko przechowuje dane, ale też wizualizuje je w sposób czytelny, pomagając w optymalizacji domowego budżetu.

---

## ✨ Funkcjonalności

Aplikacja oferuje szereg funkcji ułatwiających codzienną kontrolę finansów:

* **System Autoryzacji:** Bezpieczne logowanie i rejestracja użytkowników (JWT).
* **Zarządzanie Wydatkami:** Dodawanie, edytowanie i monitorowanie aktywnych subskrypcji.
* **Wizualizacja Danych:** Dynamiczne wykresy (kołowe/słupkowe) prezentujące miesięczne obciążenie portfela.
* **Kalendarz Płatności:** Podgląd nadchodzących terminów płatności w interaktywnym kalendarzu.
* **Tryb Ciemny (Dark Mode):** Możliwość zmiany motywu interfejsu dla lepszego komfortu użytkowania.

---

## 🛠️ Technologie

Projekt został zbudowany przy użyciu następującego stosu technologicznego:

### Backend
* **Node.js & Express.js** – silnik serwerowy i obsługa API.
* **MongoDB & Mongoose** – baza danych NoSQL i modelowanie danych.
* **JWT (JSON Web Token)** – uwierzytelnianie użytkowników.
* **Bcryptjs** – bezpieczne haszowanie haseł.

### Frontend
* **React 19** – biblioteka interfejsu użytkownika.
* **React Router 7** – nawigacja wewnątrz aplikacji.
* **Chart.js** – renderowanie wykresów statystycznych.
* **Bootstrap** – responsywne stylowanie i gotowe komponenty UI.
* **React Calendar** – obsługa widoku kalendarza.

---

## ⚙️ Instalacja i uruchomienie

Aby uruchomić projekt lokalnie, wykonaj poniższe kroki:

### 1. Sklonuj repozytorium

```
git clone https://github.com/MajaWielgus/KillBill-App.git
cd killbill-app
```

### 2. Konfiguracja serwera (Backend)

Przejdź do folderu backend i zainstaluj biblioteki:

```
cd backend
npm install
```

Utwórz plik .env w folderze backend i uzupełnij go o własne dane konfiguracyjne:
```
MONGO_URI=twoj_link_do_bazy_danych
JWT_SECRET=twoj_tajny_klucz
PORT=5000

npm start
```

### 3. Konfiguracja (Frontend)

Przejdź do folderu frontend:

```
cd frontend
npm install
npm start
```

---

## 📁 Struktura projektu

```text
KILLBILL-APP
├── backend/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── App.js
│       └── index.js
├── killbill-e2e/
│   ├── playwright-report/
│   ├── test-results/
│   ├── tests/
│   ├── package.json
│   └── playwright.config.ts
└── README.md
```

### 📸 Podgląd aplikacji

1. Landing Page & Logowanie - 
Strona powitalna wprowadzająca użytkownika w funkcjonalności aplikacji oraz bezpieczny system autoryzacji.

<img width="1899" height="931" alt="Zrzut ekranu 2026-01-17 200951" src="https://github.com/user-attachments/assets/331ddce1-697d-4335-9a37-7e1e8caf71cb" />

<img width="1890" height="928" alt="Zrzut ekranu 2026-01-17 201019" src="https://github.com/user-attachments/assets/82e7a009-9268-4ffe-969e-0a085b1c1874" />

<img width="1901" height="930" alt="Zrzut ekranu 2026-01-17 201032" src="https://github.com/user-attachments/assets/268c519d-0a92-41dc-8ec1-b63f8fe4fa93" />


2. Dashboard (Panel Główny) - 
Centralne miejsce zarządzania subskrypcjami, pozwalające na szybki podgląd wszystkich aktywnych usług i ich kosztów.

<img width="1916" height="936" alt="Zrzut ekranu 2026-01-17 201052" src="https://github.com/user-attachments/assets/ee49cb4b-f963-4b00-8696-d65d4d6dcb98" />

3. Statystyki - 
Graficzna analiza wydatków w formie interaktywnych wykresów, pomagająca monitorować budżet.

<img width="1900" height="938" alt="Zrzut ekranu 2026-01-17 201116" src="https://github.com/user-attachments/assets/80888613-2e81-490b-983b-f27496d1c42b" />

4. Kalendarz Płatności - 
Przejrzysty harmonogram, który pokazuje nadchodzące terminy płatności, abyś nigdy nie przegapił odnowienia subskrypcji.

<img width="1873" height="934" alt="Zrzut ekranu 2026-01-17 201148" src="https://github.com/user-attachments/assets/1b2eeb19-1c0c-4a75-88a5-fc8f8103f54e" />

---

## 🧪 Zautomatyzowane Testy End-to-End (E2E)

Do weryfikacji poprawności działania kluczowych funkcji aplikacji wykorzystano nowoczesny framework **Playwright**. Przeprowadzono kompleksowe testy symulujące zachowanie prawdziwego użytkownika, co stanowi ostatnią linię obrony przed błędami.

### Zakres testów
Przestestowana została "Pełna ścieżka krytyczna użytkownika", która obejmuje:
1.  **Nawigację:** Otwarcie strony głównej i przejście do formularza rejestracji.
2.  **Rejestrację unikalnego użytkownika:** Wypełnienie danych (wykorzystanie generatora czasu w loginie w celu uniknięcia duplikatów w bazie) i utworzenie konta.
3.  **Logowanie:** Weryfikacja poprawności danych i przejście do panelu głównego (Dashboard).
4.  **Dodanie subskrypcji (np. Netflix):** Wypełnienie formularza, wybór kategorii i daty.
5.  **Asercję widoczności:** Sprawdzenie, czy nowa subskrypcja faktycznie pojawiła się na liście (weryfikacja sukcesu akcji przez robota).

### Cross-Browser Testing
Testy zostały skonfigurowane w trybie sekwencyjnym (`workers=1`), aby zapewnić stabilność połączenia z bazą danych. Pomyślnie wykonano identyczny scenariusz na trzech głównych silnikach przeglądarek:
* **Chromium** (Google Chrome, Microsoft Edge)
* **Firefox**
* **WebKit** (Apple Safari)


### 📸 Dowody pomyślnego wykonania testów

**1. Podsumowanie z terminala pokazujące pomyślne zaliczenie całego zestawu testów przy użyciu jednego wątku roboczego (workers=1):**

<img width="388" height="99" alt="terminal-wynik png" src="https://github.com/user-attachments/assets/d4ce846d-1c45-4c67-8ba3-5bbe2da835bb" />

**2. Widok ze środowiska UI Playwright - test "Pełna ścieżka E2E" zakończony sukcesem na wszystkich przeglądarkach:**

<img width="1482" height="350" alt="podsumowanie-testow png" src="https://github.com/user-attachments/assets/2bdaf04d-c721-4fc5-89d8-2e54c91bdd4a" />

**3. Szczegółowy raport HTML z przebiegu testu na Chromium (widoczne poszczególne kroki i czasy wykonania):**

<img width="1544" height="764" alt="szczegolowy-raport png" src="https://github.com/user-attachments/assets/d28d3063-1023-448b-9ecf-72f619f3969a" />

---

## 👩‍💻 Autorzy

- Maja Wielgus 
- Wiktoria Radzanowska 

