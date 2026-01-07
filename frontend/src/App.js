import React, { useEffect, useState } from 'react';

function App() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/subscriptions')
      .then(response => response.json()) // zamieni odpowiedzi na zrozumiala dane (JSON)
      .then(data => {
        console.log('Pobrane dane:', data); 
        setSubs(data); 
      })
      .catch(error => console.error('Błąd pobierania:', error));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Moje Subskrypcje 🎬</h1>
      
      {/*wyświetl komunikat */}
      {subs.length === 0 ? (
        <p>Brak subskrypcji lub brak połączenia z serwerem...</p>
      ) : (
        <ul>
          {subs.map(sub => (
            <li key={sub._id}>
              <strong>{sub.name}</strong> - {sub.price} PLN ({sub.category})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;