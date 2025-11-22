import pool from '../db/db.js';
import bcrypt from 'bcryptjs';

// 1. Récupérer le profil complet
export const getProfile = async (req, res) => {
  try {
    // Jointure pour récupérer l'email (table users) et les infos (table profiles)
    const query = `
      SELECT u.username, u.email, p.full_name, p.phone, p.address, p.avatar_url 
      FROM users u 
      LEFT JOIN profiles p ON u.id = p.user_id 
      WHERE u.id = $1
    `;
    const result = await pool.query(query, [req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

// 2. Mettre à jour le profil (et l'avatar)
export const updateProfile = async (req, res) => {
  const { full_name, phone, address } = req.body;
  const userId = req.user.id;
  
  // Gestion de l'URL de l'image
  let avatarUrl = null;
  if (req.file) {
    // Construit l'URL accessible publiquement (ajustez le port/domaine si nécessaire)
    avatarUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  }

  try {
    // Vérifier si le profil existe déjà pour cet utilisateur
    const check = await pool.query("SELECT * FROM profiles WHERE user_id = $1", [userId]);

    if (check.rows.length > 0) {
      // UPDATE : Si l'utilisateur n'envoie pas de nouvelle image, on garde l'ancienne
      const currentAvatar = avatarUrl || check.rows[0].avatar_url;
      
      await pool.query(
        "UPDATE profiles SET full_name = $1, phone = $2, address = $3, avatar_url = $4, updated_at = CURRENT_TIMESTAMP WHERE user_id = $5",
        [full_name, phone, address, currentAvatar, userId]
      );
    } else {
      // INSERT : Premier profil créé
      await pool.query(
        "INSERT INTO profiles (user_id, full_name, phone, address, avatar_url) VALUES ($1, $2, $3, $4, $5)",
        [userId, full_name, phone, address, avatarUrl]
      );
    }

    res.json({ message: "Profil mis à jour", avatarUrl });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur lors de la mise à jour");
  }
};

// 3. Changer le mot de passe
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    // Récupérer le hash actuel
    const user = await pool.query("SELECT password_hash FROM users WHERE id = $1", [userId]);
    
    // Vérifier l'ancien mot de passe
    const isMatch = await bcrypt.compare(currentPassword, user.rows[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe actuel incorrect" });
    }

    // Hacher le nouveau
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    // Sauvegarder
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [newHash, userId]);
    
    res.json({ message: "Mot de passe modifié avec succès" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};