import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './DriversManager.css';

const DriversManager = () => {
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    license_number: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  // Charger la liste au montage
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await api.get('/drivers');
      setDrivers(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des chauffeurs", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/drivers', formData);
      // Réinitialiser le formulaire et recharger la liste
      setFormData({ first_name: '', last_name: '', license_number: '', phone: '' });
      fetchDrivers();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce chauffeur ?")) {
      try {
        await api.delete(`/drivers/${id}`);
        fetchDrivers(); // Rafraîchir la liste
      } catch (err) {
        alert("Impossible de supprimer (peut-être lié à un véhicule ?)");
      }
    }
  };

  return (
    <div className="drivers-container">
      <div className="header-section">
        <h2>Gestion des Chauffeurs</h2>
      </div>
      
      {/* Formulaire d'ajout */}
      <div className="driver-form-card">
        <h3>Nouveau Chauffeur</h3>
        <form onSubmit={handleSubmit} className="driver-form">
          <div className="form-row">
            <input 
              type="text" 
              name="first_name" 
              placeholder="Prénom" 
              value={formData.first_name} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="text" 
              name="last_name" 
              placeholder="Nom" 
              value={formData.last_name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-row">
            <input 
              type="text" 
              name="license_number" 
              placeholder="Numéro de Permis" 
              value={formData.license_number} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="tel" 
              name="phone" 
              placeholder="Téléphone" 
              value={formData.phone} 
              onChange={handleChange} 
            />
          </div>
          <button type="submit" className="btn-add" disabled={loading}>
            {loading ? 'Ajout...' : 'Ajouter le Chauffeur'}
          </button>
        </form>
      </div>

      {/* Liste des chauffeurs */}
      <div className="drivers-list-card">
        <h3>Effectif ({drivers.length})</h3>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Nom Complet</th>
                <th>Permis</th>
                <th>Téléphone</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: 'center'}}>Aucun chauffeur enregistré</td></tr>
              ) : (
                drivers.map(driver => (
                  <tr key={driver.id}>
                    <td className="driver-name">
                      <div className="avatar-placeholder">
                        {driver.first_name[0]}{driver.last_name[0]}
                      </div>
                      {driver.first_name} {driver.last_name}
                    </td>
                    <td>{driver.license_number}</td>
                    <td>{driver.phone || '-'}</td>
                    <td>
                      <span className={`status-badge ${driver.status === 'Actif' ? 'active' : 'inactive'}`}>
                        {driver.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-icon delete" onClick={() => handleDelete(driver.id)}>
                        <ion-icon name="trash-outline"></ion-icon>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriversManager;