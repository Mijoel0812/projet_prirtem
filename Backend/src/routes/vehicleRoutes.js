import { Router } from 'express';
import { getAllVehicles, createVehicle, deleteVehicle } from '../controllers/vehicleController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Toutes les routes sont protégées par le middleware JWT
router.get('/', authenticateToken, getAllVehicles);
router.post('/', authenticateToken, createVehicle);
router.delete('/:id', authenticateToken, deleteVehicle);

export default router;