import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './ProfileManager.css';

const ProfileManager = () => {
  const [loading, setLoading] = useState(true);
  
  // Données du profil
  const [profile, setProfile] = useState({
    username: '', email: '', full_name: '', phone: '', address: '', avatar_url: ''
  });
  
  // Gestion image
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Gestion mot de passe
  const [passwords, setPasswords] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setProfile({
        ...res.data,
        full_name: res.data.full_name || '',
        phone: res.data.phone || '',
        address: res.data.address || ''
      });
    } catch (err) {
      console.error("Erreur chargement profil", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    
    // Utilisation de FormData pour envoyer texte + fichier
    const formData = new FormData();
    formData.append('full_name', profile.full_name);
    formData.append('phone', profile.phone);
    formData.append('address', profile.address);
    if (selectedFile) {
      formData.append('avatar', selectedFile);
    }

    try {
      const res = await api.put('/profile', formData);
      alert("Profil mis à jour !");
      // Mettre à jour l'avatar affiché
      if (res.data.avatarUrl) {
        setProfile(prev => ({ ...prev, avatar_url: res.data.avatarUrl }));
      }
    } catch (err) {
      alert("Erreur lors de la mise à jour.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return alert("Les mots de passe ne correspondent pas.");
    }
    if (passwords.newPassword.length < 6) {
      return alert("Le mot de passe doit faire au moins 6 caractères.");
    }

    try {
      await api.post('/profile/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      alert("Mot de passe modifié !");
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      alert(err.response?.data?.message || "Erreur serveur");
    }
  };

  if (loading) return <div className="loading-spinner">Chargement...</div>;

  return (
    <div className="profile-container">
      <h2>Mon Profil</h2>
      
      <div className="profile-grid">
        {/* Carte Informations */}
        <div className="card info-card">
          <div className="card-header">
            <h3>Informations Personnelles</h3>
          </div>
          
          <form onSubmit={handleInfoSubmit}>
            <div className="avatar-wrapper">
              <img 
                src={previewUrl || profile.avatar_url || "https://via.placeholder.com/150"} 
                alt="Avatar" 
                className="avatar-img"
              />
              <label htmlFor="avatar-upload" className="avatar-edit-btn">
                <ion-icon name="camera-reverse"></ion-icon>
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                onChange={handleFileChange} 
                accept="image/*" 
                hidden 
              />
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Nom d'utilisateur</label>
                <input type="text" value={profile.username} disabled className="disabled" />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={profile.email} disabled className="disabled" />
              </div>
            </div>

            <div className="input-group">
              <label>Nom Complet</label>
              <input 
                type="text" 
                value={profile.full_name}
                onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                placeholder="Votre nom complet"
              />
            </div>

            <div className="input-group">
              <label>Téléphone</label>
              <input 
                type="text" 
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                placeholder="034 00 000 00"
              />
            </div>

            <div className="input-group">
              <label>Adresse</label>
              <textarea 
                value={profile.address}
                onChange={(e) => setProfile({...profile, address: e.target.value})}
                placeholder="Votre adresse..."
                rows="3"
              ></textarea>
            </div>

            <button type="submit" className="btn-primary">Enregistrer les modifications</button>
          </form>
        </div>

        {/* Carte Sécurité */}
        <div className="card security-card">
          <div className="card-header">
            <h3>Sécurité</h3>
          </div>
          
          <form onSubmit={handlePasswordSubmit}>
            <div className="input-group">
              <label>Mot de passe actuel</label>
              <input 
                type="password" 
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                required
              />
            </div>

            <div className="input-group">
              <label>Nouveau mot de passe</label>
              <input 
                type="password" 
                value={passwords.newPassword}
                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                required
              />
            </div>

            <div className="input-group">
              <label>Confirmer le mot de passe</label>
              <input 
                type="password" 
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                required
              />
            </div>

            <button type="submit" className="btn-warning">Modifier le mot de passe</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileManager;