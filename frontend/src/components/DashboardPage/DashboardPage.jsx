import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import VehiclesManager from '../Vehicles/VehiclesManager';
import DriversManager from '../Drivers/DriversManager';
import ProfileManager from '../Profile/ProfileManager';
import './DashboardPage.css';

function DashboardPage({ onLogout, toggleTheme, isDarkTheme }) {
  const [activeIndex, setActiveIndex] = useState(0); 

  const renderContent = () => {
    switch (activeIndex) {
      case 0:
        return (
          <div>
            <h1>Tableau de bord</h1>
            <p>Bienvenue sur votre tableau de bord global.</p>
          </div>
        );
      case 1:
        return <ProfileManager />;
      case 2:
        return <VehiclesManager />;
      case 3:
        return <DriversManager />;
      case 4:
        return <h1>Rapports (À venir)</h1>;
      case 5:
        return <h1>Paramètres (À venir)</h1>;
      default:
        return <h1>Page non trouvée</h1>;
    }
  };
  
  return (
    <div className="dashboard-layout">
      <Sidebar 
        onLogout={onLogout} 
        activeIndex={activeIndex} 
        setActiveIndex={setActiveIndex} 
      /> 
      
      <main className="dashboard-content">
        <div className="theme-toggle" onClick={toggleTheme}>
          <ion-icon name={isDarkTheme ? "sunny-sharp" : "moon-sharp"}></ion-icon>
        </div>

        {renderContent()}
        
      </main>
    </div>
  );
}

export default DashboardPage;