import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ onLogout, isDarkMode, toggleTheme }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar d-flex flex-column p-3">
      {/* LOGO */}
      <div className="mb-4 text-center">
        <h4 className="fw-bold text-primary">💰 KillBill</h4>
      </div>

      {/* MENU */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <Link to="/" className={`nav-link ${isActive('/')} link-body-emphasis`}>
            📊 Pulpit
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/stats" className={`nav-link ${isActive('/stats')} link-body-emphasis`}>
            📈 Statystyki
          </Link>
        </li>
        <Link to="/calendar" className={`nav-link ${isActive('/calendar')} link-body-emphasis`}>
            📅 Kalendarz
        </Link>
      </ul>

      {/* DÓŁ PASKA */}
      <hr />
      <button onClick={toggleTheme} className="btn btn-sm btn-outline-secondary mb-2 w-100">
        {isDarkMode ? '☀️ Tryb Jasny' : '🌑 Tryb Ciemny'}
      </button>
      <button onClick={onLogout} className="btn btn-sm btn-danger w-100">
        Wyloguj
      </button>
    </div>
  );
}

export default Sidebar;