import React, { useEffect, useState } from 'react';

function App() {
  const [subs, setSubs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Inne',
    date: '' // tu będzie data wybrana w kalendarzu
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/subscriptions')
      .then(res => res.json())
      .then(data => setSubs(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/api/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        paymentDate: formData.date 
      }),
    })
      .then(response => response.json())
      .then(newSub => {
        setSubs([...subs, newSub]);
        setFormData({ name: '', price: '', category: 'Inne', date: '' });
      })
      .catch(error => console.error('Błąd dodawania:', error));
  };

  // pomocnicza funkcja do ładnego wyświetlania daty
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pl-PL');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Menedżer Subskrypcji 💰</h1>

      {/* --- FORMULARZ --- */}
      <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Dodaj nową:</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
          
          <input
            type="text"
            name="name"
            placeholder="Nazwa (np. Netflix)"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ padding: '8px' }}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="number"
              name="price"
              placeholder="Cena"
              value={formData.price}
              onChange={handleChange}
              required
              style={{ padding: '8px', flex: 1 }}
            />
            
            {/*Pole kalendarza */}
            <input 
              type="date" 
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={{ padding: '8px', flex: 1 }}
            />
          </div>

          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange}
            style={{ padding: '8px' }}
          >
            <option value="Inne">Inne</option>
            <option value="Rozrywka">Rozrywka</option>
            <option value="Praca">Praca</option>
            <option value="Dom">Dom</option>
          </select>

          <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
            Dodaj i Pamiętaj Datę 📅
          </button>
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
              {/* Wyświetlanie daty pod nazwą */}
              <small style={{ color: 'blue' }}>📅 Płatność: {formatDate(sub.paymentDate)}</small>
            </div>
            <div style={{ fontWeight: 'bold', color: '#333' }}>
              {sub.price} PLN
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;