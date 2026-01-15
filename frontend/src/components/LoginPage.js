import React, { useState } from 'react';

// ten komponent przyjmuje funkcje 'onlogin' z app.js
function LoginPage({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [authData, setAuthData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Decyzja: czy to logowanie czy rejestracja?
    const endpoint = isRegistering ? 'register' : 'login';
    
    fetch(`http://localhost:5000/api/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authData) // Wysyłamy { username, password }
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        // SUKCES LOGOWANIA
        onLogin(data.token);
      } else if (data.message === 'Użytkownik zarejestrowany!') {
        // SUKCES REJESTRACJI - Przełączamy na logowanie
        setIsRegistering(false);
        setSuccessMsg('Konto utworzone! Możesz się zalogować. 🎉');
        setAuthData({ username: '', password: '' }); // Czyścimy pola
      } else {
        // BŁĄD Z SERWERA
        setError(data.message || 'Wystąpił błąd.');
      }
    })
    .catch(err => setError('Błąd połączenia z serwerem.'));
  };

  // Funkcja do przełączania trybu i czyszczenia błędów
  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setSuccessMsg('');
  };

  return (
    <div className="login-container">
      <div className="card login-card p-4 p-md-5">
        <div className="card-body">
          
          {/* naglowek */}
          <div className="text-center mb-4">
            <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                <span style={{fontSize: '2.5rem'}}>💰</span>
                <h2 className="fw-bold mb-0" style={{letterSpacing: '-1px'}}>KillBill</h2>
            </div>
            <h5 className="text-muted fw-normal">
              {isRegistering ? 'Załóż nowe konto' : 'Witaj ponownie!'}
            </h5>
          </div>

          {/* komunikat bledu i sukcesu */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              ⚠️ <div className="ms-2">{error}</div>
            </div>
          )}
          {successMsg && (
            <div className="alert alert-success d-flex align-items-center" role="alert">
              ✅ <div className="ms-2">{successMsg}</div>
            </div>
          )}

          {/* FORMULARZ */}
          <form onSubmit={handleSubmit}>
            
            {/* Login (USERNAME) */}
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control rounded-4"
                id="floatingInput"
                name="username" 
                placeholder="Twój login"
                value={authData.username}
                onChange={handleChange}
                required
                autoFocus
              />
              <label htmlFor="floatingInput">Login</label>
            </div>

            {/* Hasło */}
            <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control rounded-4"
                id="floatingPassword"
                name="password"
                placeholder="Hasło"
                value={authData.password}
                onChange={handleChange}
                required
              />
              <label htmlFor="floatingPassword">Hasło</label>
            </div>

            {/* Przycisk */}
            <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill fw-bold py-3 shadow-sm">
              {isRegistering ? 'Zarejestruj się ✨' : 'Zaloguj się 🚀'}
            </button>
          </form>

          {/* PRZEŁĄCZNIK TRYBU (Logowanie <-> Rejestracja) */}
          <div className="text-center mt-4 text-muted">
            {isRegistering ? 'Masz już konto?' : 'Nie masz jeszcze konta?'} <br />
            <button 
                onClick={toggleMode} 
                className="btn btn-link text-primary fw-bold text-decoration-none p-0"
            >
              {isRegistering ? 'Zaloguj się tutaj' : 'Załóż darmowe konto'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginPage;