import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { getProfile, updateProfile, changePassword } from '../controllers/profileController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Configuration de Multer pour stocker les images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // S'assurer que ce dossier existe à la racine Backend/
  },
  filename: (req, file, cb) => {
    cb(null, `user-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

router.get('/', getProfile);
// 'avatar' doit correspondre au nom du champ dans le FormData du frontend
router.put('/', upload.single('avatar'), updateProfile);
router.post('/password', changePassword);

export default router;