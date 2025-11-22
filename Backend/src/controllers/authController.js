import pool from '../db/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// --- Inscription (Register) ---
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Vérifier si l'utilisateur existe déjà
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1 OR username = $2", [email, username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "L'email ou le nom d'utilisateur existe déjà." });
    }

    // 2. Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Insérer le nouvel utilisateur
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, password_hash]
    );

    // 4. Créer un Token JWT
    const token = jwt.sign(
      { id: newUser.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 5. Renvoyer le token
    res.status(201).json({
      token,
      user: newUser.rows[0]
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur du serveur");
  }
};

// --- Connexion (Login) ---
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Vérifier si l'utilisateur existe
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Identifiants invalides." });
    }

    // 2. Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Identifiants invalides." });
    }

    // 3. Créer et renvoyer le Token JWT
    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur du serveur");
  }
};