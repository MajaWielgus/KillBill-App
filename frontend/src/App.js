import React, { useEffect, useState } from 'react';

function App() {
  const [subs, setSubs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Inne',
    date: ''
  });

  // Pamięta czy coś edytujemy (trzyma ID edytowanego elementu)
  // Jeśli null -> tryb dodawania. Jeśli ma ID -> tryb edycji.
  const [editingId, setEditingId] = useState(null);

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

  // Funkcja która wypełnia formularz danymi do edycji
  const startEditing = (sub) => {
    setEditingId(sub._id); 
    setFormData({
      name: sub.name,
      price: sub.price,
      category: sub.category,
      date: sub.paymentDate.split('T')[0] 
    });
  };

  // Funkcja do anulowania edycji (czyszczenie)
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', category: 'Inne', date: '' });
  };

  // Obsługa formularza (POST LUB PUT)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // --- TRYB EDYCJI (PUT) ---
      fetch(`http://localhost:5000/api/subscriptions/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price),
          category: formData.category,
          paymentDate: formData.date 
        }),
      })
      .then(res => res.json())
      .then(updatedSub => {
        // Aktualizujemy listę na ekranie (podmieniamy stary element na nowy)
        setSubs(subs.map(item => (item._id === editingId ? updatedSub : item)));
        // Wracamy do trybu dodawania
        cancelEdit();
      })
      .catch(err => console.error('Błąd edycji:', err));

    } else {
      // --- TRYB DODAWANIA (POST) ---
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
    }
  };

  // Usuwanie (DELETE)
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

  const totalCost = subs.reduce((suma, sub) => suma + sub.price, 0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{textAlign: 'center'}}>Menedżer Subskrypcji 💰</h1>

      <div style={{ background: '#007bff', color: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Miesięczne wydatki:</div>
        <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>{totalCost} PLN</div>
      </div>

      {/* --- FORMULARZ --- */}
      <div style={{ 
        background: editingId ? '#fff3cd' : '#f0f0f0', // Żółty jak edytujemy, szary jak dodajemy
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: editingId ? '1px solid #ffeeba' : 'none'
      }}>
        <h3>{editingId ? 'Edytuj subskrypcję ✏️' : 'Dodaj nową:'}</h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
          <input type="text" name="name" placeholder="Nazwa" value={formData.name} onChange={handleChange} required style={{ padding: '8px' }} />
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

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ flex: 1, padding: '10px', background: editingId ? '#ffc107' : '#28a745', color: editingId ? 'black' : 'white', border: 'none', cursor: 'pointer' }}>
              {editingId ? 'Zapisz zmiany 💾' : 'Dodaj ➕'}
            </button>
            
            {/* Przycisk Anuluj (pojawia się tylko przy edycji) */}
            {editingId && (
              <button type="button" onClick={cancelEdit} style={{ padding: '10px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
                Anuluj ❌
              </button>
            )}
          </div>
        </form>
      </div>

      <h3>Twoje wydatki:</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {subs.map(sub => (
          <li key={sub._id} style={{ borderBottom: '1px solid #ddd', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{sub.name}</strong> <span style={{fontSize: '0.8em', color: '#666'}}>({sub.category})</span>
              <br/>
              <small style={{ color: 'blue' }}>📅 {formatDate(sub.paymentDate)}</small>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 'bold', color: '#333', marginRight: '10px' }}>{sub.price} PLN</span>
              
              {/* Przycisk Edycji */}
              <button 
                onClick={() => startEditing(sub)}
                style={{ background: '#ffc107', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
              >
                ✏️
              </button>

              <button 
                onClick={() => handleDelete(sub._id)}
                style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;