import React, { useEffect, useState } from 'react';

function App() {
  const [subs, setSubs] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Inne',
    date: ''
  });

  // Pobieranie danych (GET)
  useEffect(() => {
    fetch('http://localhost:5000/api/subscriptions')
      .then(res => res.json())
      .then(data => setSubs(data))
      .catch(err => console.error('Błąd pobierania:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Dodawanie (POST)
  const handleSubmit = (e) => {
    e.preventDefault(); 

    fetch('http://localhost:5000/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        price: Number(formData.price), 
        category: formData.category,
        paymentDate: formData.date 
      }),
    })
      .then(res => res.json())
      .then(newSub => {
        setSubs([...subs, newSub]);
        setFormData({ name: '', price: '', category: 'Inne', date: '' });
      })
      .catch(error => console.error('Błąd dodawania:', error));
  };

  // Funkcja usuwania (DELETE)
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/subscriptions/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      const newSubs = subs.filter(sub => sub._id !== id);
      setSubs(newSubs);
    })
    .catch(err => console.error('Błąd usuwania:', err));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pl-PL');
  };

  // LICZNIK: Sumujemy ceny wszystkich subskrypcji
  const totalCost = subs.reduce((suma, sub) => suma + sub.price, 0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{textAlign: 'center'}}>Menedżer Subskrypcji 💰</h1>

      {/* --- OKIENKO Z SUMĄ --- */}
      <div style={{ 
        background: '#007bff', 
        color: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        textAlign: 'center', 
        marginBottom: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Miesięczne wydatki:</div>
        <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>{totalCost} PLN</div>
      </div>

      {/* --- FORMULARZ --- */}
      <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Dodaj nową:</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
          
          <input type="text" name="name" placeholder="Nazwa (np. Netflix)" value={formData.name} onChange={handleChange} required style={{ padding: '8px' }} />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="number" name="price" placeholder="Cena" value={formData.price} onChange={handleChange} required style={{ padding: '8px', flex: 1 }} />
            <input type="date" name="date" value={formData.date} onChange={handleChange} required style={{ padding: '8px', flex: 1 }} />
          </div>

          <select name="category" value={formData.category} onChange={handleChange} style={{ padding: '8px' }}>
            <option value="Inne">Inne</option>
            <option value="Rozrywka">Rozrywka</option>
            <option value="Praca">Praca</option>
            <option value="Dom">Dom</option>
          </select>

          <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>Dodaj ➕</button>
        </form>
      </div>

      {/* --- LISTA --- */}
      <h3>Twoje wydatki:</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {subs.map(sub => (
          <li key={sub._id} style={{ borderBottom: '1px solid #ddd', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{sub.name}</strong> <span style={{fontSize: '0.8em', color: '#666'}}>({sub.category})</span>
              <br/>
              <small style={{ color: 'blue' }}>📅 {formatDate(sub.paymentDate)}</small>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontWeight: 'bold', color: '#333' }}>{sub.price} PLN</span>
              <button 
                onClick={() => handleDelete(sub._id)}
                style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Usuń 🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;