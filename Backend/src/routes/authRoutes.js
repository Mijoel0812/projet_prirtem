import { Router } from 'express';
import { register, login } from '../controllers/authController.js';

const router = Router();

// @route   POST /api/auth/register
// @desc    Enregistrer un nouvel utilisateur
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Connecter un utilisateur et renvoyer un token
router.post('/login', login);

export default router;