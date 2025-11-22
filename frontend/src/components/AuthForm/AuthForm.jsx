// frontend/src/components/AuthForm/AuthForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';

const API_URL = 'http://localhost:3001/api/auth';

function AuthForm({ onLoginSuccess }) {
  const [isActive, setIsActive] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Réinitialiser les champs lors du changement de mode
  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    resetForm();
    setIsActive(true);
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    resetForm();
    setIsActive(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation basique
    if (!username.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    try {
      const payload = { username, password };
      const res = await axios.post(`${API_URL}/login`, payload);
      localStorage.setItem('token', res.data.token);
      onLoginSuccess();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur de connexion. Vérifiez vos identifiants.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation basique
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    try {
      const payload = { username, email, password };
      const res = await axios.post(`${API_URL}/register`, payload);
      localStorage.setItem('token', res.data.token);
      onLoginSuccess();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur d'inscription. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={isActive ? "wrapper active" : "wrapper"}>
      <span className="rotate-bg"></span>
      <span className="rotate-bg2"></span>

      {/* SECTION CONNEXION */}
      <div className="form-box login">
        <h2 className="title animation" style={{ "--i": 0, "--j": 21 }}>Connexion</h2>
        <form onSubmit={handleLoginSubmit}>
          {error && !isActive && <p className="error-message">{error}</p>}
          <div className="input-box animation" style={{ "--i": 1, "--j": 22 }}>
            <input 
              type="text" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <label>Nom d'utilisateur</label>
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box animation" style={{ "--i": 2, "--j": 23 }}>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <label>Mot de passe</label>
            <i className='bx bxs-lock-alt'></i>
          </div>
          <button 
            type="submit" 
            className="btn animation" 
            style={{ "--i": 3, "--j": 24 }}
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Connexion'}
          </button>
          <div className="linkTxt animation" style={{ "--i": 5, "--j": 25 }}>
            <p>Pas encore de compte ? <a href="#" className="register-link" onClick={handleRegisterClick}>S'inscrire</a></p>
          </div>
        </form>
      </div>
      <div className="info-text login">
        <h2 className="animation" style={{ "--i": 0, "--j": 20 }}>Bon retour !</h2>
        <p className="animation" style={{ "--i": 1, "--j": 21 }}>
          Connectez-vous pour accéder au tableau de bord PRIRTEM.
        </p>
      </div>

      {/* SECTION INSCRIPTION */}
      <div className="form-box register">
        <h2 className="title animation" style={{ "--i": 17, "--j": 0 }}>Créer un compte</h2>
        <form onSubmit={handleRegisterSubmit}>
          {error && isActive && <p className="error-message">{error}</p>}
          <div className="input-box animation" style={{ "--i": 18, "--j": 1 }}>
            <input 
              type="text" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <label>Nom d'utilisateur</label>
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box animation" style={{ "--i": 19, "--j": 2 }}>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <label>Email</label>
            <i className='bx bxs-envelope'></i>
          </div>
          <div className="input-box animation" style={{ "--i": 20, "--j": 3 }}>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <label>Mot de passe</label>
            <i className='bx bxs-lock-alt'></i>
          </div>
          <button 
            type="submit" 
            className="btn animation" 
            style={{ "--i": 21, "--j": 4 }}
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer'}
          </button>
          <div className="linkTxt animation" style={{ "--i": 22, "--j": 5 }}>
            <p>Vous avez déjà un compte ? <a href="#" className="login-link" onClick={handleLoginClick}>Se connecter</a></p>
          </div>
        </form>
      </div>
      <div className="info-text register">
        <h2 className="animation" style={{ "--i": 17, "--j": 0 }}>Bienvenue!</h2>
        <p className="animation" style={{ "--i": 18, "--j": 1 }}>
          Inscrivez-vous pour commencer le suivi de carburant.
        </p>
      </div>
    </div>
  );
}

export default AuthForm;