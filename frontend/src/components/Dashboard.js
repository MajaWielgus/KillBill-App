import React, { useEffect, useState } from 'react';

function Dashboard({ token, onLogout }) {
  const [subs, setSubs] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', category: 'Inne', date: '' });
  const [editingId, setEditingId] = useState(null);

  // POBIERANIE (z tokenem)
  useEffect(() => {
    fetch('http://localhost:5000/api/subscriptions', {
      method: 'GET',
      headers: {
        'auth-token': token 
      }
    })
      .then(res => res.json())
      .then(data => {
        // Jeśli token wygasł lub jest błąd, data może być komunikatem błędu
        if (Array.isArray(data)) {
            setSubs(data);
        } else {
            console.log("Błąd lub brak danych", data);
            setSubs([]); // Pusta lista w razie błędu
        }
      })
      .catch(err => console.error(err));
  }, [token]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const startEditing = (sub) => {
    setEditingId(sub._id);
    setFormData({ name: sub.name, price: sub.price, category: sub.category, date: sub.paymentDate ? sub.paymentDate.split('T')[0] : '' });
  };
  
  const cancelEdit = () => { setEditingId(null); setFormData({ name: '', price: '', category: 'Inne', date: '' }); };

  // DODAWANIE / EDYCJA (z tokenem)
  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `http://localhost:5000/api/subscriptions/${editingId}` : 'http://localhost:5000/api/subscriptions';

    fetch(url, {
      method: method,
      headers: { 
        'Content-Type': 'application/json',
        'auth-token': token 
      }, 
      body: JSON.stringify({
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        paymentDate: formData.date
      }),
    }).then(res => res.json()).then(data => {
      if (editingId) {
        setSubs(subs.map(item => (item._id === editingId ? data : item)));
        cancelEdit();
      } else {
        setSubs([...subs, data]);
        setFormData({ name: '', price: '', category: 'Inne', date: '' });
      }
    });
  };

  // USUWANIE (z tokenem)
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/subscriptions/${id}`, { 
        method: 'DELETE',
        headers: { 
            'auth-token': token 
        }
    })
      .then(() => setSubs(subs.filter(sub => sub._id !== id)));
  };

  const totalCost = subs.reduce((sum, sub) => sum + sub.price, 0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Twoje Subskrypcje 💰</h1>
        <button onClick={onLogout} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Wyloguj</button>
      </div>

      <div style={{ background: '#007bff', color: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center', marginBottom: '30px' }}>
        <div>Miesięczne wydatki:</div>
        <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>{totalCost} PLN</div>
      </div>

      <div style={{ background: editingId ? '#fff3cd' : '#f0f0f0', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>{editingId ? 'Edytuj ✏️' : 'Dodaj nową:'}</h3>
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
            <button type="submit" style={{ flex: 1, padding: '10px', background: editingId ? '#ffc107' : '#28a745', color: editingId ? 'black' : 'white', border: 'none', cursor: 'pointer' }}>{editingId ? 'Zapisz' : 'Dodaj'}</button>
            {editingId && <button type="button" onClick={cancelEdit} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '10px' }}>Anuluj</button>}
          </div>
        </form>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {subs.map(sub => (
          <li key={sub._id} style={{ borderBottom: '1px solid #ddd', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><strong>{sub.name}</strong> ({sub.category})<br/><small style={{ color: 'blue' }}>📅 {sub.paymentDate ? new Date(sub.paymentDate).toLocaleDateString('pl-PL') : ''}</small></div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <strong>{sub.price} PLN</strong>
              <button onClick={() => startEditing(sub)} style={{ background: '#ffc107', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>✏️</button>
              <button onClick={() => handleDelete(sub._id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;