import { Router } from 'express';
import productController from '../Controllers/productController.js';

const router = Router();

router.get("/category/:categoryId", productController.getAllProducts);
router.get("/:id", productController.getProduct);

export default router;