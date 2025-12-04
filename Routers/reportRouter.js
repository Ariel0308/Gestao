import { Router } from 'express';
import reportController from '../Controllers/reportController.js';
import { authenticate, requireAdmin } from '../Middlewares/authMiddleware.js';

const router = Router();

router.get('/sales', authenticate, requireAdmin, reportController.salesReport);
router.get('/stock-movements', authenticate, requireAdmin, reportController.stockMovementsReport);
router.get('/top-products', authenticate, requireAdmin, reportController.topProductsReport);

export default router;

