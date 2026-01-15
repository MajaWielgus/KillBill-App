import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      
      {/* To jest do paska nawigacyjnego */}
      <nav className="navbar navbar-expand-lg py-4">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <span style={{fontSize: '1.5rem'}}>💰</span>
            <span className="fw-bold fs-4" style={{letterSpacing: '-1px'}}>KillBill</span>
          </div>
          <div>
            <Link to="/login" className="btn btn-dark rounded-pill px-4 fw-bold">
              Zaloguj się
            </Link>
          </div>
        </div>
      </nav>

      {/* strona glowna ktora sie wyswietla */}
      <header className="container text-center mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <span className="badge bg-light text-primary border rounded-pill px-3 py-2 mb-3 fw-bold">
              🚀 Nowa wersja 2.0 jest już dostępna
            </span>
            <h1 className="display-3 fw-bold mb-4" style={{letterSpacing: '-2px', lineHeight: '1.1'}}>
              Zapanuj nad swoimi <br />
              <span className="text-gradient">pieniędzmi i subskrypcjami.</span>
            </h1>
            <p className="lead text-muted mb-5 px-5">
              Netflix, Spotify, HBO... tracisz rachubę? KillBill to Twój osobisty asystent, 
              który przypomni o płatnościach i podliczy, ile naprawdę wydajesz.
            </p>
            
            <div className="d-flex justify-content-center gap-3 mb-5">
              <Link to="/login" className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg">
                Zacznij za darmo
              </Link>
              <a href="#features" className="btn btn-outline-secondary btn-lg px-5 py-3 rounded-pill fw-bold bg-white">
                Jak to działa?
              </a>
            </div>
          </div>
        </div>

        {/* Wizualizacja aplikacji w 3D CSS */}
        <div className="hero-mockup mt-4 p-2">
           {/* To jest wizualizacja paska przeglądarki */}
           <div className="border-bottom pb-2 mb-3 d-flex gap-2 px-3 pt-2">
              <div className="rounded-circle bg-danger" style={{width:10, height:10}}></div>
              <div className="rounded-circle bg-warning" style={{width:10, height:10}}></div>
              <div className="rounded-circle bg-success" style={{width:10, height:10}}></div>
           </div>
           {/* To jest wizualizacja treści aplikacji */}
           <div className="bg-light rounded text-center p-5 text-muted" style={{minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div>
                  <h2 className="fw-bold text-dark">Twoje Centrum Dowodzenia 📊</h2>
                  <p>Tutaj będzie widok Twojego Dashboardu po zalogowaniu.</p>
                  <div className="spinner-border text-primary mt-3" role="status"></div>
              </div>
           </div>
        </div>
      </header>

      {/* liczby, ktore sie wyswietlaja i opisy*/}
      <section className="py-5 border-top border-bottom bg-white mt-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4">
              <h2 className="fw-bold text-dark">100+</h2>
              <p className="text-muted text-uppercase small ls-1">Zadowolonych użytkowników</p>
            </div>
            <div className="col-md-4">
              <h2 className="fw-bold text-primary">0 PLN</h2>
              <p className="text-muted text-uppercase small ls-1">Koszt korzystania z aplikacji</p>
            </div>
            <div className="col-md-4">
              <h2 className="fw-bold text-dark">100%</h2>
              <p className="text-muted text-uppercase small ls-1">Prywatności danych</p>
            </div>
          </div>
        </div>
      </section>

      {/* karta z funkcjami */}
      <section id="features" className="container py-5 mt-5 mb-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Wszystko, czego potrzebujesz</h2>
          <p className="text-muted">Proste narzędzia, potężne efekty.</p>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="feature-card p-4 rounded-4">
              <div className="icon-square">📊</div>
              <h4 className="fw-bold mb-3">Pełna analityka</h4>
              <p className="text-muted">Wykresy kołowe i słupkowe pokażą Ci brutalną prawdę</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card p-4 rounded-4">
              <div className="icon-square">🔔</div>
              <h4 className="fw-bold mb-3">Smart Alerty</h4>
              <p className="text-muted">Żółty alert przypomni Ci o płatności 7 dni wcześniej. Koniec z niespodziewanymi obciążeniami konta.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card p-4 rounded-4">
              <div className="icon-square">🌑</div>
              <h4 className="fw-bold mb-3">Tryb Nocny</h4>
              <p className="text-muted">Interfejs, który nie wypala oczu. Przełączaj się między trybem jasnym i ciemnym jednym kliknięciem.</p>
            </div>
          </div>
        </div>
      </section>

      {/* opcja przeskoczenia do logowania */}
      <section className="container mb-5">
        <div className="bg-dark text-white rounded-5 p-5 text-center shadow-lg" 
             style={{backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)'}}>
          <h2 className="fw-bold mb-3">Gotowy na porządki w finansach?</h2>
          <p className="lead mb-4 text-white-50">Dołączenie zajmuje mniej niż minutę.</p>
          <Link to="/login" className="btn btn-primary btn-lg rounded-pill px-5 fw-bold">
            Załóż darmowe konto
          </Link>
        </div>
      </section>

      {/* stopka */}
      <footer className="mt-auto py-4 text-center text-muted border-top">
        <small>&copy; 2026 KillBill App</small>
      </footer>

    </div>
  );
}

export default LandingPage;