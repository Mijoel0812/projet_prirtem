// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm/AuthForm';
import DashboardPage from './components/DashboardPage/DashboardPage';
import './App.css';

function App() {
  // Vérifier si l'utilisateur est connecté au chargement
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer le thème sauvegardé ou utiliser 'light' par défaut
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Appliquer le thème au chargement et aux changements
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fonction pour changer de thème
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Fonction appelée après une connexion réussie
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    // Supprimer le token et les données utilisateur
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Mettre à jour l'état
    setIsAuthenticated(false);
    
    console.log('Déconnexion réussie');
  };

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return <div className="App-loading">Chargement...</div>;
  }

  // Afficher AuthForm ou Dashboard selon l'état d'authentification
  return (
    <div className="App">
      {!isAuthenticated ? (
        <div className="App-auth-layout">
          <AuthForm onLoginSuccess={handleLoginSuccess} />
        </div>
      ) : (
        <DashboardPage 
          onLogout={handleLogout} 
          toggleTheme={toggleTheme}
          isDarkTheme={theme === 'dark'}
        />
      )}
    </div>
  );
}

export default App;