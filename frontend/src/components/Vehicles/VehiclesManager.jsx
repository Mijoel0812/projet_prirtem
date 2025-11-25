import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './VehiclesManager.css';

const VehiclesManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    license_plate: '', brand: '', model: '', fuel_type: 'Diesel'
  });

  const toggleForm = () => setShowForm(!showForm);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/vehicles');
      setVehicles(res.data);
    } catch (err) {
      console.error("Erreur de chargement des véhicules", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/vehicles', formData);
      setFormData({ license_plate: '', brand: '', model: '', fuel_type: 'Diesel' });
      setShowForm(false);
      fetchVehicles(); 
    } catch (err) {
      alert("Erreur lors de l'ajout du véhicule");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce véhicule ?")) {
      try {
        await api.delete(`/vehicles/${id}`);
        fetchVehicles(); 
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  return (
    <div className="crud-container">
      <h2>Gestion des Véhicules</h2>

      <button className="btn-toggle-form" onClick={toggleForm}>
        {showForm ? 'Fermer' : 'Ajout'}
      </button>
      
      {showForm && (
        <div className="modal-overlay" onClick={toggleForm}>
          <div className="modal-content is-focused" onClick={e => e.stopPropagation()}>
            <div className="card-header">
              <h3>Nouveau Véhicule</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="styled-form"> 
              <div className="input-box">
                <input 
                  type="text" 
                  name="license_plate" 
                  value={formData.license_plate} 
                  onChange={handleChange} 
                  required 
                />
                <label>Plaque d'immatriculation</label>
                <i className='bx bxs-card'></i>
              </div>

              <div className="form-row">
                <div className="input-box">
                  <input 
                    type="text" 
                    name="brand" 
                    value={formData.brand} 
                    onChange={handleChange} 
                    required 
                  />
                  <label>Marque</label>
                  <i className='bx bxs-car'></i>
                </div>
                
                <div className="input-box">
                  <input 
                    type="text" 
                    name="model" 
                    value={formData.model} 
                    onChange={handleChange} 
                    required 
                  />
                  <label>Modèle</label>
                  <i className='bx bxs-car-mechanic'></i>
                </div>
              </div>

              {/* Select Box stylisé custom */}
              <div className="input-box select-box">
                <select name="fuel_type" value={formData.fuel_type} onChange={handleChange}>
                  <option value="Diesel">Diesel</option>
                  <option value="Essence">Essence</option>
                  <option value="Hybride">Hybride</option>
                  <option value="Electrique">Électrique</option>
                </select>
                <label className="static-label">Carburant</label>
                <i className='bx bxs-gas-pump'></i>
              </div>

              <button type="submit" className="btn-add-modal" disabled={loading}>
                {loading ? 'Création...' : 'Créer le Véhicule'}
              </button>
            </form>
          </div>
        </div>
      )}

      <table className="crud-table">
        <thead>
          <tr>
            <th>Marque/Modèle</th>
            <th>Plaque</th>
            <th>Carburant</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length === 0 ? (
             <tr><td colSpan="4">Aucun véhicule.</td></tr>
          ) : (
            vehicles.map(v => (
              <tr key={v.id}> 
                <td>{v.brand} {v.model}</td>
                <td>{v.license_plate}</td>
                <td>{v.fuel_type}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(v.id)}>
                    Supprimer
                  </button>
                </td>
               </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VehiclesManager;