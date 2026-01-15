import React, { useEffect, useState } from 'react';
// Importy do wykresu
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Rejestracja wykresu (wymagane przez bibliotekę)
ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard({ token, onLogout }) {
  const [subs, setSubs] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', category: 'Inne', date: '', frequency: 'monthly' });
  const [editingId, setEditingId] = useState(null);
  
  // Stan do zakładek (filtrowanie)
  const [filterCategory, setFilterCategory] = useState('Wszystkie');

  // Stan sortowania (domyślnie: najbliższa płatność)
  const [sortType, setSortType] = useState('date');

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

  // FUNKCJA OBLICZAJĄCA DNI (ROZRÓŻNIA ROCZNE I MIESIĘCZNE) ---
  const getDaysLeft = (sub) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zerujemy godziny

    const paymentDateOriginal = new Date(sub.paymentDate);
    let nextPayment;

    // Logika dla rocznych
    if (sub.frequency === 'yearly') {
        nextPayment = new Date(today.getFullYear(), paymentDateOriginal.getMonth(), paymentDateOriginal.getDate());
        // Jeśli data w tym roku już minęła, płatność jest w przyszłym roku
        if (nextPayment < today) {
            nextPayment.setFullYear(nextPayment.getFullYear() + 1);
        }
    } 
    // Logika dla miesiecznych
    else {
        const dayOfMonth = paymentDateOriginal.getDate();
        nextPayment = new Date(today.getFullYear(), today.getMonth(), dayOfMonth);
        if (nextPayment < today) {
            nextPayment.setMonth(nextPayment.getMonth() + 1);
        }
    }

    const diffTime = nextPayment - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filtrujemy (przekazujemy całe sub, a nie tylko datę)
  const upcomingPayments = subs
    .filter(sub => getDaysLeft(sub) <= 7)
    .sort((a, b) => getDaysLeft(a) - getDaysLeft(b));

  // -------------------------------------------------------

  // Logika formularza 
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const startEditing = (sub) => {
    setEditingId(sub._id);
    setFormData({ name: sub.name, price: sub.price, category: sub.category, date: sub.paymentDate.split('T')[0], frequency: sub.frequency || 'monthly' });
  };
  
  const cancelEdit = () => { setEditingId(null); setFormData({ name: '', price: '', category: 'Inne', date: '', frequency: 'monthly' }); };

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
        paymentDate: formData.date,
        frequency: formData.frequency
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

  // ovliczenia dla wykresu i statystyk. Jeśli roczna, to dzielimy cenę przez 12
  const totalCost = subs.reduce((sum, sub) => {
      if (sub.frequency === 'yearly') return sum + (sub.price / 12);
      return sum + sub.price;
  }, 0);
  

  // Zliczamy ile wydajemy na każdą kategorię
  const categories = ['Rozrywka', 'Praca', 'Dom', 'Inne'];
  const categoryTotals = categories.map(cat => 
    subs.filter(s => s.category === cat).reduce((sum, s) => {
        if (s.frequency === 'yearly') return sum + (s.price / 12);
        return sum + s.price;
    }, 0)
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



  
 // SORTOWANIE I FILTROWANIE
  const getSortedSubs = () => {
    // Najpierw filtrujemy po kategorii
    let processedSubs = filterCategory === 'Wszystkie' 
      ? subs 
      : subs.filter(sub => sub.category === filterCategory);

    // Teraz sortujemy to, co zostało
    processedSubs.sort((a, b) => {
      switch (sortType) {
        case 'priceDesc': // Najdroższe na górze
          return b.price - a.price;
        case 'priceAsc': // Najtańsze na górze
          return a.price - b.price;
        case 'alpha': // Alfabetycznie A-Z
          return a.name.localeCompare(b.name);
        case 'date': // Najbliższa płatność, ustawiona domyslnie
        default:
          return getDaysLeft(a) - getDaysLeft(b);
      }
    });

    return processedSubs;
  };

  const filteredSubs = getSortedSubs();


  // --- WIDOK (HTML + BOOTSTRAP) ---
  return (
    <div className="container mt-4">
      
      

      {/* : ŻÓŁTY ALARM O PŁATNOŚCIACH --- */}
      {upcomingPayments.length > 0 && (
        <div className="alert alert-warning shadow-sm mb-4 border-warning">
          <h5 className="alert-heading fw-bold">⚠️ Nadchodzące płatności (najbliższe 7 dni):</h5>
          <ul className="mb-0 list-unstyled mt-2">
            {upcomingPayments.map(sub => (
              <li key={sub._id} className="mb-2">
                👉 <strong>{sub.name}</strong>: 
                <span className="fw-bold text-danger mx-2">{Number(sub.price).toFixed(2)} PLN</span> (za {getDaysLeft(sub)} dni)
              </li>
            ))}
          </ul>
        </div>
      )}
      

      <div className="row">
        {/*lewa kolumna - Statystyki i wykres */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center">
              <h5 className="text-muted">Miesięczne wydatki</h5>
              <h1 className="display-4 font-weight-bold text-success">{Number(totalCost).toFixed(2)} PLN</h1>
            </div>
          </div>

          {/* WYKRES - Pokazujemy tylko jak są jakieś dane */}
          {subs.length > 0 && (
            <div className="card shadow-sm p-3">
              <h6 className="text-center mb-3">Struktura wydatków</h6>
              <div style={{ maxHeight: '300px', display: 'flex', justifyContent: 'center' }}>
                <Doughnut data={chartData}  />
              </div>
            </div>
          )}
        </div>

        {/* PRAWA KOLUMNA: formularz i lista */}
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
                  <input type="number" className="form-control" name="price" placeholder="Cena" value={formData.price} onChange={handleChange} required min='0' step="0.01" />
                </div>
                
                {/* MIESIĘCZNIE / ROCZNIE */}
                <div className="col-md-3">
                   <select className="form-select" name="frequency" value={formData.frequency} onChange={handleChange}>
                      <option value="monthly">Co miesiąc</option>
                      <option value="yearly">Raz w roku</option>
                   </select>
                </div>
                
                {/* kategoria */}
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

         {/* PASEK NARZĘDZI: ZAKŁADKI + SORTOWANIE*/}
          <div className="d-flex justify-content-between align-items-center mb-3">
            
            {/* Zakładki Kategorii  */}
            <ul className="nav nav-pills">
              {['Wszystkie', 'Rozrywka', 'Praca', 'Dom', 'Inne'].map(cat => (
                <li className="nav-item" key={cat}>
                  <button 
                    className={`nav-link btn-sm ${filterCategory === cat ? 'active fw-bold' : ''}`} 
                    onClick={() => setFilterCategory(cat)}
                    style={{cursor: 'pointer'}}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>

            {/* Wybór Sortowania (po prawej) */}
            <div className="d-flex align-items-center">
              <span className="me-2 small text-muted">Sortuj:</span>
              <select 
                className="form-select form-select-sm" 
                style={{width: 'auto', cursor: 'pointer'}}
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="date">📅 Najbliższe</option>
                <option value="priceDesc">💰 Najdroższe</option>
                <option value="priceAsc">💸 Najtańsze</option>
                <option value="alpha">🔤 Alfabetycznie</option>
              </select>
            </div>

          </div>

          {/* LISTA SUBSKRYPCJI */}
          <div className="list-group shadow-sm">
            {filteredSubs.length === 0 ? (
              <div className="list-group-item text-center text-muted p-4">
                Brak subskrypcji w tej kategorii.
              </div>
            ) : (
              filteredSubs.map(sub => (
                <div key={sub._id} className="list-group-item d-flex justify-content-between align-items-center">
                  
                  {/* LEWA STRONA: Nazwa, data */}
                  <div className="d-flex align-items-center gap-3">
                    
                   

                    <div>
                      <div className="d-flex align-items-center gap-2">
                          <h5 className="mb-1 fw-bold">{sub.name}</h5>
                          {sub.frequency === 'yearly' && <span className="badge bg-info text-dark" style={{fontSize: '0.65em'}}>Roczna</span>}
                      </div>
                      <small className="text-muted">
                        📅 {sub.paymentDate ? new Date(sub.paymentDate).toLocaleDateString('pl-PL') : ''} 
                        <span className="badge bg-secondary ms-2">{sub.category}</span>
                      </small>
                    </div>
                  </div>

                  {/* prawa strona: Cena i przyciski */}
                  <div className="d-flex align-items-center gap-3">
                    <div className="text-end">
                      <span className="fs-5 fw-bold text-dark">{Number(sub.price).toFixed(2)} PLN</span>
                      <div style={{fontSize: '0.7rem'}} className="text-muted text-uppercase">
                            {sub.frequency === 'yearly' ? '/ rok' : '/ mies'}
                      </div>
                    </div>
                    
                    <div>
                      <button onClick={() => startEditing(sub)} className="btn btn-sm btn-outline-warning me-2" title="Edytuj">✏️</button>
                      <button onClick={() => handleDelete(sub._id)} className="btn btn-sm btn-outline-danger" title="Usuń">🗑️</button>
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