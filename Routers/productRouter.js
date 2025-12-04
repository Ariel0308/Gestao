import { Router } from 'express';
import productController from '../Controllers/productController.js';
import { authenticate, requireAdmin } from '../Middlewares/authMiddleware.js';

const router = Router();

// Público
router.get('/', productController.listProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/:id', productController.getProduct);

router.post('/', authenticate, requireAdmin, productController.createProduct);
router.put('/:id', authenticate, requireAdmin, productController.updateProduct);
router.delete('/:id', authenticate, requireAdmin, productController.deleteProduct);

export default router;