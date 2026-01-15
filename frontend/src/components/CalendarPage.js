import React, { useEffect, useState, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 

function CalendarPage({ token }) {
  const [subs, setSubs] = useState([]);
  const [date, setDate] = useState(new Date());

  const fetchSubscriptions = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/subscriptions', {
        headers: { 'auth-token': token }
      });
      const data = await response.json();
      if (Array.isArray(data)) setSubs(data);
    } catch (err) {
      console.error("Błąd ładowania kalendarza:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const getSubsForDate = (dateToCheck) => {
    return subs.filter(sub => {
      const paymentDate = new Date(sub.paymentDate);
      const day = paymentDate.getDate();
      
      // Dla miesięcznych sprawdzamy tylko dzień miesiąca
      if (sub.frequency === 'monthly') {
        return dateToCheck.getDate() === day;
      }
      // Dla rocznych musi zgadzać się i dzień, i miesiąc
      return dateToCheck.getDate() === day && dateToCheck.getMonth() === paymentDate.getMonth();
    });
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'rozrywka': return '🎬';
      case 'praca': return '💼';
      case 'dom': return '🏠';
      default: return '💸';
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const daySubs = getSubsForDate(date);
      if (daySubs.length > 0) {
        return (
          <div className="payment-dot-container">
             {daySubs.slice(0, 1).map((s, i) => (
                <div key={i} className="payment-dot animate-pulse-dot"></div>
             ))}
          </div>
        );
      }
    }
  };

  const selectedSubs = getSubsForDate(date);

  return (
    <div className="container mt-4 animate-scale-in">
      {/* Dynamiczny nagłówek */}
      <div className="calendar-header-glass p-4 mb-4 rounded-4 d-flex justify-content-between align-items-center animate-fade-in-up">
        <div>
            <h2 className="fw-bold m-0 text-gradient display-6">Harmonogram Płatności</h2>
            <p className="text-muted m-0 lead">Wszystkie Twoje subskrypcje w jednym miejscu</p>
        </div>
        <div className="current-month-badge shadow-sm">
            {date.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}
        </div>
      </div>
      
      <div className="row g-4">
        {/* LEWA STRONA: kalendarz z animacja */}
        <div className="col-md-7 animate-fade-in-left">
          <div className="calendar-glass-card shadow-lg">
             <Calendar 
               onChange={setDate} 
               value={date} 
               tileContent={tileContent}
               locale="pl-PL"
               className="rounded-3"
             />
          </div>
        </div>

        {/* PRAWA STRONA: lista platnosci na wybrany dzien */}
        <div className="col-md-5 animate-fade-in-right">
           <div className="details-glass-card shadow-lg h-100">
              <div className="details-header p-4">
                 <h5 className="fw-bold m-0 text-gradient">Wydarzenia na {date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}</h5>
              </div>
              <div className="p-4 details-scroll-area"> 
                 {selectedSubs.length > 0 ? (
                   selectedSubs.map((sub, index) => (
                     <div key={sub._id} className="sub-item-glass-card mb-3 p-3 rounded-3 d-flex justify-content-between align-items-center animate-item-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="d-flex align-items-center gap-3">
                            <div className="category-icon-bg">{getCategoryIcon(sub.category)}</div>
                            <div>
                                <div className="fw-bold">{sub.name}</div>
                                <div className="text-muted extra-small text-uppercase">{sub.category}</div>
                            </div>
                        </div>
                        <div className="text-end">
                            <div className="fw-bold text-danger">-{Number(sub.price).toFixed(2)} zł</div>
                            <div className="extra-small opacity-50">{sub.frequency.toUpperCase()}</div>
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="empty-state text-center py-5 animate-fade-in-up">
                      <div className="display-1 mb-3">🎉</div>
                      <p className="lead text-muted">Brak zaplanowanych płatności w tym dniu!</p>
                      <small className="text-muted">Jesteś wolny od wydatków. Ciesz się dniem!</small>
                   </div>
                 )}
              </div>
              <div className="details-footer bg-transparent p-3 text-center rounded-bottom">
                 <small className="text-muted">Kliknij datę, aby zobaczyć szczegóły płatności.</small>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;