import { Router } from 'express';
import movementController from '../Controllers/movementController.js';
import { authenticate, requireAdmin } from '../Middlewares/authMiddleware.js';

const router = Router();

router.get('/', authenticate, requireAdmin, movementController.listMovements);
router.post('/', authenticate, requireAdmin, movementController.createMovement);

export default router;

