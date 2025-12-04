import { Router } from 'express';
import categoryController from '../Controllers/categoryController.js';
import { authenticate, requireAdmin } from '../Middlewares/authMiddleware.js';

const router = Router();

router.get('/', categoryController.listCategories);
router.get('/:id', categoryController.getCategory);

// Admin (proteção será adicionada posteriormente)
router.post('/', authenticate, requireAdmin, categoryController.createCategory);
router.put('/:id', authenticate, requireAdmin, categoryController.updateCategory);
router.delete('/:id', authenticate, requireAdmin, categoryController.deleteCategory);

export default router;