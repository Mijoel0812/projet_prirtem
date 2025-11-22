import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './VehiclesManager.css'; 

const VehiclesManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    license_plate: '', brand: '', model: '', fuel_type: 'Diesel'
  });

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
    try {
      await api.post('/vehicles', formData);
      setFormData({ license_plate: '', brand: '', model: '', fuel_type: 'Diesel' });
      fetchVehicles(); // Recharger la liste pour voir le nouvel ajout
    } catch (err) {
      alert("Erreur lors de l'ajout du véhicule");
      console.error("Erreur POST", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      try {
        await api.delete(`/vehicles/${id}`);
        fetchVehicles(); 
      } catch (err) {
        alert("Erreur lors de la suppression");
        console.error("Erreur DELETE", err);
      }
    }
  };

  return (
    <div className="crud-container">
      
      <h2>Gestion des Véhicules</h2>
      
      <form onSubmit={handleSubmit} className="crud-form">
        <input 
          placeholder="Immatriculation" 
          value={formData.license_plate}
          onChange={(e) => setFormData({...formData, license_plate: e.target.value})}
          required 
        />
        <input 
          placeholder="Marque" 
          value={formData.brand}
          onChange={(e) => setFormData({...formData, brand: e.target.value})}
          required 
        />
        <input 
          placeholder="Modèle" 
          value={formData.model}
          onChange={(e) => setFormData({...formData, model: e.target.value})}
          required 
        />
        <select 
          value={formData.fuel_type}
          onChange={(e) => setFormData({...formData, fuel_type: e.target.value})}
        >
          <option value="Diesel">Diesel</option>
          <option value="Essence">Essence</option>
        </select>
        <button type="submit">Ajouter</button>
      </form>

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
             <tr><td colSpan="4">Aucun véhicule enregistré.</td></tr>
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