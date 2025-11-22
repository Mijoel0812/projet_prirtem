import { Router } from 'express';
import { getAllDrivers, createDriver, deleteDriver, updateDriverStatus } from '../controllers/driverController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Toutes les routes nécessitent d'être connecté
router.use(authenticateToken);

router.get('/', getAllDrivers);
router.post('/', createDriver);
router.delete('/:id', deleteDriver);
router.patch('/:id/status', updateDriverStatus); // Route pour changer juste le statut

export default router;