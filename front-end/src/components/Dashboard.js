import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">✓</div>
            <h1>TaskFlow</h1>
          </div>
          <div className="user-section">
            <span>Bienvenue, {user?.username || user?.email}</span>
            <button onClick={handleLogout} className="logout-button">
              Déconnexion
            </button>
          </div>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Tableau de bord</h2>
          <p>Vous êtes maintenant connecté à TaskFlow ! Votre système de gestion de tâches est prêt.</p>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Tâches en cours</h3>
              <div className="stat-number">0</div>
            </div>
            <div className="stat-card">
              <h3>Tâches terminées</h3>
              <div className="stat-number">0</div>
            </div>
            <div className="stat-card">
              <h3>Projets actifs</h3>
              <div className="stat-number">0</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;