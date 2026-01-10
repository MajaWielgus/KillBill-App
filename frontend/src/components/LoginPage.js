import React, { useState } from 'react';

// Ten komponent przyjmuje funkcję "onLogin" z App.js
function LoginPage({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [authData, setAuthData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? 'register' : 'login';
    
    fetch(`http://localhost:5000/api/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        // Wywołuje funkcję przekazaną z App.js
        onLogin(data.token);
      } else if (data.message === 'Użytkownik zarejestrowany!') {
        setIsRegistering(false);
        setError('Konto utworzone! Zaloguj się teraz.');
      } else {
        setError(data.message);
      }
    })
    .catch(err => setError('Błąd połączenia z serwerem'));
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'Arial', textAlign: 'center', border: '1px solid #ddd', borderRadius: '10px' }}>
      <h2>{isRegistering ? 'Rejestracja 📝' : 'Logowanie 🔐'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" name="username" placeholder="Login" value={authData.username} onChange={handleChange} required style={{ padding: '10px' }} />
        <input type="password" name="password" placeholder="Hasło" value={authData.password} onChange={handleChange} required style={{ padding: '10px' }} />
        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          {isRegistering ? 'Zarejestruj się' : 'Zaloguj się'}
        </button>
      </form>

      <p style={{ marginTop: '20px', fontSize: '0.9em' }}>
        {isRegistering ? 'Masz już konto?' : 'Nie masz konta?'} <br/>
        <button onClick={() => { setIsRegistering(!isRegistering); setError(''); }} style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
          {isRegistering ? 'Zaloguj się tutaj' : 'Zarejestruj się tutaj'}
        </button>
      </p>
    </div>
  );
}

export default LoginPage;
