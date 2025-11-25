import pool from '../db/db.js';

// 1. Obtenir tous les chauffeurs
export const getAllDrivers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM drivers ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 2. Ajouter un nouveau chauffeur
export const createDriver = async (req, res) => {
  const { first_name, last_name, license_number, phone } = req.body;

  try {
    // Vérifier si le numéro de permis existe déjà
    const checkLicense = await pool.query("SELECT * FROM drivers WHERE license_number = $1", [license_number]);
    if (checkLicense.rows.length > 0) {
      return res.status(400).json({ message: "Ce numéro de permis existe déjà." });
    }

    const newDriver = await pool.query(
      "INSERT INTO drivers (first_name, last_name, license_number, phone, status) VALUES ($1, $2, $3, $4, 'Actif') RETURNING *",
      [first_name, last_name, license_number, phone]
    );

    res.status(201).json(newDriver.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Erreur lors de la création" });
  }
};

// 3. Mettre à jour le statut d'un chauffeur (ex: Actif / En congé)
export const updateDriverStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "Actif", "Inactif", "En mission"

  try {
    const updatedDriver = await pool.query(
      "UPDATE drivers SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (updatedDriver.rows.length === 0) {
      return res.status(404).json({ message: "Chauffeur non trouvé" });
    }

    res.json(updatedDriver.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 4. Supprimer un chauffeur
export const deleteDriver = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM drivers WHERE id = $1", [id]);
    res.json({ message: "Chauffeur supprimé avec succès" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};