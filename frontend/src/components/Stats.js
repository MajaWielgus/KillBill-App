import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function Stats({ token }) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:5000/api/subscriptions', { headers: { 'auth-token': token } })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSubs(data);
        else setSubs([]);
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, [token]);


  
  // Ile faktycznie płacisz w skali roku?
  const yearlyTotal = subs.reduce((sum, sub) => {
      if (sub.frequency === 'yearly') return sum + sub.price; // Już jest roczna
      return sum + (sub.price * 12); // Miesięczna * 12
  }, 0);

  // Ile średnio wychodzi na miesiąc?
  const monthlyTotal = yearlyTotal / 12;

  // Średnia cena subskrypcji (w skali miesiąca)
  const averagePrice = subs.length > 0 ? (monthlyTotal / subs.length) : 0;
  
  // Sortowanie (sprowadzamy wszystko do ceny rocznej żeby porównać co jest najdroższe)
  const sortedByYearlyCost = [...subs].sort((a, b) => {
      const priceYearlyA = a.frequency === 'yearly' ? a.price : a.price * 12;
      const priceYearlyB = b.frequency === 'yearly' ? b.price : b.price * 12;
      return priceYearlyB - priceYearlyA;
  });
  const top3Expensive = sortedByYearlyCost.slice(0, 3);
 


  // WYKRESY
  const categories = ['Rozrywka', 'Praca', 'Dom', 'Inne'];
  const categoryCosts = categories.map(cat => 
    subs.filter(s => s.category === cat).reduce((sum, s) => {
        // na wykresie sredni miesieczny 
        if (s.frequency === 'yearly') return sum + (s.price / 12);
        return sum + s.price;
    }, 0)
  );

  const barChartData = {
    labels: categories,
    datasets: [{
        label: 'Średnie wydatki miesięczne (PLN)',
        data: categoryCosts,
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)'],
        borderWidth: 1,
    }],
  };

  const months = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];
  const monthlyProjections = new Array(12).fill(0);
  const currentYear = new Date().getFullYear();

  subs.forEach(sub => {
    const subDate = new Date(sub.paymentDate);
    const subMonthIndex = subDate.getMonth();
    const subYear = subDate.getFullYear();
    
    // Jeśli to subskrypcja roczna, dodajemy całą kwotę tylko w miesiącu płatności
    if (sub.frequency === 'yearly') {
        // Jeśli płatność w tym roku, dodajemy w konkretnym miesiącu
        // skoki wydatkow w danym miesiacu
        if (subYear <= currentYear) { // Zakładamy cykliczność
             monthlyProjections[subMonthIndex] += sub.price;
        }
    } else {
        // Miesięczna dodajemy do każdego miesiąca od momentu startu
        if (subYear < currentYear) {
            for (let i = 0; i < 12; i++) monthlyProjections[i] += sub.price;
        } else if (subYear === currentYear) {
            for (let i = subMonthIndex; i < 12; i++) monthlyProjections[i] += sub.price;
        }
    }
  });

  const lineChartData = {
    labels: months,
    datasets: [{
        label: 'Przepływ gotówki (Kiedy płacisz)',
        data: monthlyProjections,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3, fill: true,
    }],
  };

  if (loading) return <div className="text-center mt-5 p-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="container mt-4 mb-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark">📊 Centrum Analityczne</h2>
        <p className="text-muted">Szczegółowa analiza Twoich finansów</p>
      </div>

      {/* kluczowe wskazniki*/}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100" style={{borderLeft: '5px solid #0d6efd'}}>
                <div className="card-body">
                    <small className="text-muted text-uppercase fw-bold">Średnio na miesiąc</small>
                    <h3 className="fw-bold text-dark mt-2">{Number(monthlyTotal).toFixed(2)} PLN</h3>
                </div>
            </div>
        </div>
        <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100" style={{borderLeft: '5px solid #dc3545'}}>
                <div className="card-body">
                    <small className="text-muted text-uppercase fw-bold">Rocznie (Suma)</small>
                    <h3 className="fw-bold text-danger mt-2">{Number(yearlyTotal).toFixed(2)} PLN</h3>
                </div>
            </div>
        </div>
        <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100" style={{borderLeft: '5px solid #198754'}}>
                <div className="card-body">
                    <small className="text-muted text-uppercase fw-bold">Średnia cena usługi</small>
                    <h3 className="fw-bold text-success mt-2">{Number(averagePrice).toFixed(2)} PLN</h3>
                </div>
            </div>
        </div>
        <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100" style={{borderLeft: '5px solid #ffc107'}}>
                <div className="card-body">
                    <small className="text-muted text-uppercase fw-bold">Ilość usług</small>
                    <h3 className="fw-bold text-dark mt-2">{subs.length}</h3>
                </div>
            </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6 mb-3">
            <div className="card shadow border-0 p-3 h-100">
                <h6 className="text-center text-muted mb-3">Podział na kategorie (Miesięcznie)</h6>
                <div className="card-body d-flex align-items-center justify-content-center">
                    <Bar data={barChartData} options={{plugins: {legend: {display: false}}}} />
                </div>
            </div>
        </div>
        <div className="col-md-6 mb-3">
            <div className="card shadow border-0 p-3 h-100">
                <h6 className="text-center text-muted mb-3">📈 Kiedy potrzebujesz gotówki? (Miesiące)</h6>
                <div className="card-body d-flex align-items-center justify-content-center">
                    <Line data={lineChartData} />
                </div>
            </div>
        </div>
      </div>

      {/* PODIUM */}
      <div className="row">
        <div className="col-12">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white fw-bold border-0 pt-3">🏆 Najdroższe w skali roku (TOP 3)</div>
                <div className="card-body">
                    <ul className="list-group list-group-flush">
                        {top3Expensive.map((sub, index) => {
                            // Obliczamy koszt roczny do wyświetlenia
                            const yearlyCost = sub.frequency === 'yearly' ? sub.price : sub.price * 12;
                            return (
                                <li key={sub._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className={`badge bg-${index === 0 ? 'warning' : 'secondary'} me-2 rounded-pill`}>#{index + 1}</span>
                                        {sub.name} 
                                        {sub.frequency === 'yearly' && <span className="badge bg-info text-dark ms-2">Płatne rocznie</span>}
                                    </div>
                                    <span className="fw-bold fs-5">{Number(yearlyCost).toFixed(2)} PLN / rok</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
      </div>

      <div className="text-center mt-4">
         <Link to="/" className="btn btn-outline-secondary">← Wróć do pulpitu</Link>
      </div>
    </div>
  );
}

export default Stats;