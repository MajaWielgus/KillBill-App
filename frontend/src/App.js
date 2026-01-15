import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// IMPORT: Wskazujemy na plik LoginPage.js
import Login from './components/LoginPage';

// pozostałe komponenty
import Dashboard from './components/Dashboard';
import Stats from './components/Stats';
import Sidebar from './components/Sidebar'; 
import LandingPage from './components/LandingPage';
import CalendarPage from './components/CalendarPage';


import './App.css';

function App() {
  // Pobieramy token z pamięci przeglądarki
  const [token, setToken] = useState(localStorage.getItem('auth-token'));
  
  // Stan dla Trybu Ciemnego (false = jasny, true = ciemny)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Funkcja przełączająca tryb
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Funkcja po udanym logowaniu
  const handleLoginSuccess = (receivedToken) => {
    setToken(receivedToken);
    localStorage.setItem('auth-token', receivedToken);
  };

  // Funkcja wylogowania
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('auth-token');
  };

  return (
    // Główny pojemnik z klasą dla trybu ciemnego
    <div className={isDarkMode ? 'dark-mode' : ''} style={{ minHeight: '100vh', transition: 'background-color 0.3s' }}>
      
      <Router>
        
        {/* === JEŚLI ZALOGOWANY: Pokaż układ z Paskiem Bocznym === */}
        {token ? (
          <div className="app-container">
            {/* Pasek boczny po lewej */}
            <Sidebar 
                onLogout={handleLogout} 
                isDarkMode={isDarkMode} 
                toggleTheme={toggleTheme} 
            />
            
            {/* Treść po prawej */}
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard token={token} onLogout={handleLogout} />} />
                <Route path="/stats" element={<Stats token={token} />} />
                <Route path="*" element={<Navigate to="/" />} />
                 <Route path="/calendar" element={<CalendarPage token={token} />} />
              </Routes>
            </div>
          </div>
        ) : (
          
        /* === JEŚLI NIEZALOGOWANY: Pokaż Landing Page lub Login === */
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}

      </Router>

    </div>
  );
}

export default App;