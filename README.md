# KillBill-App 💸

Aplikacja typu Full-Stack (MERN) do inteligentnego zarządzania subskrypcjami i kontrolowania miesięcznych wydatków.

---

## 📋 Spis treści
1. [O projekcie](#-o-projekcie)
2. [Funkcjonalności](#-funkcjonalności)
3. [Technologie](#-technologie)
4. [Instalacja i uruchomienie](#-instalacja-i-uruchomienie)
5. [Struktura projektu](#-struktura-projektu)
6. [Autorzy](#-autorzy)

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

```bash
git clone https://github.com/MajaWielgus/KillBill-App.git
cd killbill-app

### 2. Konfiguracja serwera (Backend)

Przejdź do folderu backend i zainstaluj biblioteki:

```bash
cd backend
npm install

Utwórz plik .env w folderze backend i uzupełnij go o własne dane konfiguracyjne:
MONGO_URI=twoj_link_do_bazy_danych
JWT_SECRET=twoj_tajny_klucz
PORT=5000

npm start

### 3. Konfiguracja (Frontend)

Przejdź do folderu frontend:

cd frontend
npm install
npm start


## 📁 Struktura projektu

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
└── README.md


## 👩‍💻 Autorzy

- Maja Wielgus 
- Wiktoria Radzanowska 


