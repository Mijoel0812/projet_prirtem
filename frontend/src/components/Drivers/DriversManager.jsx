import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './DriversManager.css';

const DriversManager = () => {
  const [drivers, setDrivers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    license_number: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const toggleForm = () => setShowForm(!showForm);

  // Charger la liste au montage
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await api.get('/drivers');
      setDrivers(res.data);
    } catch (err) {
      console.error("Erreur chargement chauffeurs", err);
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
      setFormData({ first_name: '', last_name: '', license_number: '', phone: '' });
      setShowForm(false);
      fetchDrivers();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous supprimer ce chauffeur ?")) {
      try {
        await api.delete(`/drivers/${id}`);
        fetchDrivers();
      } catch (err) {
        alert("Impossible de supprimer.");
      }
    }
  };

  return (
    <div className="drivers-container">
      <div className="header-section">
        <h2>Gestion des Chauffeurs</h2>
      </div>

      <button className="btn-toggle-form" onClick={toggleForm}>
        {showForm ? 'Fermer' : 'Ajout'}
      </button>
      
      {showForm && (
        <div className="modal-overlay" onClick={toggleForm}>
          <div className="modal-content is-focused" onClick={e => e.stopPropagation()}>
            <div className="card-header">
              <h3>Nouveau Chauffeur</h3>
            </div>
            
            {/* Formulaire stylisé comme AuthForm */}
            <form onSubmit={handleSubmit} className="styled-form"> 
              <div className="form-row">
                <div className="input-box">
                  <input 
                    type="text" 
                    name="first_name" 
                    value={formData.first_name} 
                    onChange={handleChange} 
                    required 
                  />
                  <label>Prénom</label>
                  <i className='bx bxs-user'></i>
                </div>
                
                <div className="input-box">
                  <input 
                    type="text" 
                    name="last_name" 
                    value={formData.last_name} 
                    onChange={handleChange} 
                    required 
                  />
                  <label>Nom</label>
                  <i className='bx bxs-user-detail'></i>
                </div>
              </div>

              <div className="input-box">
                <input 
                  type="text" 
                  name="license_number" 
                  value={formData.license_number} 
                  onChange={handleChange} 
                  required 
                />
                <label>Numéro de Permis</label>
                <i className='bx bxs-id-card'></i>
              </div>

              <div className="input-box">
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                />
                <label>Téléphone</label>
                <i className='bx bxs-phone'></i>
              </div>

              <button type="submit" className="btn-add-modal" disabled={loading}>
                {loading ? 'Enregistrement...' : 'Enregistrer le Chauffeur'}
              </button>
            </form>
          </div>
        </div>
      )}

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
                <tr><td colSpan="5" style={{textAlign: 'center'}}>Aucun chauffeur</td></tr>
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
                    <td><span className={`status-badge ${driver.status === 'Actif' ? 'active' : 'inactive'}`}>{driver.status}</span></td>
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