import React, { useEffect, useState } from 'react';
// Importy do wykresu
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Rejestracja wykresu (wymagane przez bibliotekę)
ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard({ token, onLogout }) {
  const [subs, setSubs] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', category: 'Inne', date: '' });
  const [editingId, setEditingId] = useState(null);
  
  // NOWOŚĆ: Stan do zakładek (filtrowanie)
  const [filterCategory, setFilterCategory] = useState('Wszystkie');

  // 1. POBIERANIE DANYCH
  useEffect(() => {
    fetch('http://localhost:5000/api/subscriptions', {
      headers: { 'auth-token': token }
    })
      .then(res => res.json())
      .then(data => {
         if(Array.isArray(data)) setSubs(data);
         else setSubs([]);
      })
      .catch(err => console.error(err));
  }, [token]);

  // Logika formularza (bez zmian)
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const startEditing = (sub) => {
    setEditingId(sub._id);
    setFormData({ name: sub.name, price: sub.price, category: sub.category, date: sub.paymentDate.split('T')[0] });
  };
  
  const cancelEdit = () => { setEditingId(null); setFormData({ name: '', price: '', category: 'Inne', date: '' }); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `http://localhost:5000/api/subscriptions/${editingId}` : 'http://localhost:5000/api/subscriptions';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json', 'auth-token': token },
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

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/subscriptions/${id}`, { 
        method: 'DELETE', headers: { 'auth-token': token }
    }).then(() => setSubs(subs.filter(sub => sub._id !== id)));
  };

  // --- OBLICZENIA DO WYKRESU I STATYSTYK ---
  const totalCost = subs.reduce((sum, sub) => sum + sub.price, 0);

  // Zliczamy ile wydajemy na każdą kategorię
  const categories = ['Rozrywka', 'Praca', 'Dom', 'Inne'];
  const categoryTotals = categories.map(cat => 
    subs.filter(s => s.category === cat).reduce((sum, s) => sum + s.price, 0)
  );

  // Dane dla wykresu kołowego
  const chartData = {
    labels: categories,
    datasets: [
      {
        data: categoryTotals,
        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'], // Kolory kawałków tortu
        borderWidth: 1,
      },
    ],
  };

  // --- FILTROWANIE LISTY (ZAKŁADKI) ---
  const filteredSubs = filterCategory === 'Wszystkie' 
    ? subs 
    : subs.filter(sub => sub.category === filterCategory);


  // --- WIDOK (HTML + BOOTSTRAP) ---
  return (
    <div className="container mt-4">
      
      {/* NAGŁÓWEK */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white shadow-sm rounded">
        <h2 className="m-0 text-primary">💰 Menedżer Subskrypcji</h2>
        <button onClick={onLogout} className="btn btn-outline-danger">Wyloguj</button>
      </div>

      <div className="row">
        {/* LEWA KOLUMNA: Statystyki i Wykres */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center">
              <h5 className="text-muted">Miesięczne wydatki</h5>
              <h1 className="display-4 font-weight-bold text-success">{totalCost} PLN</h1>
            </div>
          </div>

          {/* WYKRES - Pokazujemy tylko jak są jakieś dane */}
          {subs.length > 0 && (
            <div className="card shadow-sm p-3">
              <h6 className="text-center mb-3">Struktura wydatków</h6>
              <div style={{ maxHeight: '300px', display: 'flex', justifyContent: 'center' }}>
                <Doughnut data={chartData} />
              </div>
            </div>
          )}
        </div>

        {/* PRAWA KOLUMNA: Formularz i Lista */}
        <div className="col-md-8">
          
          {/* FORMULARZ */}
          <div className={`card shadow-sm mb-4 ${editingId ? 'border-warning' : ''}`}>
            <div className="card-header bg-light">
              {editingId ? '✏️ Edytuj subskrypcję' : '➕ Dodaj nową subskrypcję'}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-6">
                  <input type="text" className="form-control" name="name" placeholder="Nazwa (np. Netflix)" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="col-md-3">
                  <input type="number" className="form-control" name="price" placeholder="Cena" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="col-md-3">
                  <select className="form-select" name="category" value={formData.category} onChange={handleChange}>
                    <option value="Inne">Inne</option>
                    <option value="Rozrywka">Rozrywka</option>
                    <option value="Praca">Praca</option>
                    <option value="Dom">Dom</option>
                  </select>
                </div>
                <div className="col-md-12 d-flex gap-2">
                  <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
                  <button type="submit" className={`btn ${editingId ? 'btn-warning' : 'btn-success'} w-100`}>
                    {editingId ? 'Zapisz zmiany' : 'Dodaj'}
                  </button>
                  {editingId && <button type="button" onClick={cancelEdit} className="btn btn-secondary">Anuluj</button>}
                </div>
              </form>
            </div>
          </div>

          {/* ZAKŁADKI (TABS) */}
          <ul className="nav nav-tabs mb-3">
            {['Wszystkie', 'Rozrywka', 'Praca', 'Dom', 'Inne'].map(cat => (
              <li className="nav-item" key={cat}>
                <button 
                  className={`nav-link ${filterCategory === cat ? 'active fw-bold' : ''}`} 
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>

          {/* LISTA SUBSKRYPCJI */}
          <div className="list-group shadow-sm">
            {filteredSubs.length === 0 ? (
              <div className="list-group-item text-center text-muted p-4">Brak subskrypcji w tej kategorii.</div>
            ) : (
              filteredSubs.map(sub => (
                <div key={sub._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">{sub.name}</h5>
                    <small className="text-muted">
                      📅 {sub.paymentDate ? new Date(sub.paymentDate).toLocaleDateString('pl-PL') : ''} 
                      <span className="badge bg-secondary ms-2">{sub.category}</span>
                    </small>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="fs-5 fw-bold text-dark">{sub.price} PLN</span>
                    <div>
                      <button onClick={() => startEditing(sub)} className="btn btn-sm btn-outline-warning me-2">✏️</button>
                      <button onClick={() => handleDelete(sub._id)} className="btn btn-sm btn-outline-danger">🗑️</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;