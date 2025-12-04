import { Router } from 'express';
import accessoryController from '../Controllers/accessoryController.js';
import { authenticate, requireAdmin } from '../Middlewares/authMiddleware.js';

const router = Router();

router.get('/', accessoryController.listAccessories);
router.get('/:id', accessoryController.getAccessory);

// Admin endpoints (serão protegidos futuramente)
router.post('/', authenticate, requireAdmin, accessoryController.createAccessory);
router.put('/:id', authenticate, requireAdmin, accessoryController.updateAccessory);
router.delete('/:id', authenticate, requireAdmin, accessoryController.deleteAccessory);

export default router;

