import { Router } from 'express';
import purchaseController from '../Controllers/purchaseController.js';
import { authenticate } from '../Middlewares/authMiddleware.js';

const router = Router();

router.post('/', authenticate, purchaseController.createPurchase);

export default router;

