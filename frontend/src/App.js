import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(null);

  // Funkcja którą przekaże do LoginPage
  const handleLoginSuccess = (receivedToken) => {
    setToken(receivedToken);
  };

  // Funkcja którą przekaże do Dashboard
  const handleLogout = () => {
    setToken(null);
  };

  // --- GŁÓWNA DECYZJA ---
  // Jeśli nie ma tokena -> Pokaż Logowanie
  // Jeśli jest token -> Pokaż Dashboard
  return (
    <div>
      {!token ? (
        <LoginPage onLogin={handleLoginSuccess} />
      ) : (
        <Dashboard token={token} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;