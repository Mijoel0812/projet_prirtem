import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import './DashboardPage.css';

function DashboardPage({ onLogout, toggleTheme, isDarkTheme }) {
  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={onLogout} /> 
      
      {/* Classe "main" renommée en "dashboard-content" */}
      <main className="dashboard-content">
        
        {/* Bouton de Thème de sidebar.txt  */}
        <div className="theme-toggle" onClick={toggleTheme}>
          <ion-icon name={isDarkTheme ? "sunny-sharp" : "moon-sharp"}></ion-icon>
        </div>

        <h1>Dashboard</h1>
        <p>Bienvenue sur votre tableau de bord de gestion de carburant.</p>
        
      </main>
    </div>
  );
}

export default DashboardPage;