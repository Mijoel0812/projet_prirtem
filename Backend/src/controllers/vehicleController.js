import pool from '../db/db.js';

// Obtenir tous les véhicules
export const getAllVehicles = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vehicles ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer un véhicule
export const createVehicle = async (req, res) => {
  const { license_plate, brand, model, fuel_type } = req.body;
  try {
    const newVehicle = await pool.query(
      "INSERT INTO vehicles (license_plate, brand, model, fuel_type) VALUES ($1, $2, $3, $4) RETURNING *",
      [license_plate, brand, model, fuel_type]
    );
    res.status(201).json(newVehicle.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer un véhicule
export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM vehicles WHERE id = $1", [id]);
    res.json({ message: "Véhicule supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};