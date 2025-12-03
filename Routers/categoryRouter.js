import { Router } from 'express';
import categoryController from '../Controllers/categoryController.js';

const router = Router();

router.get("/", categoryController.getCategories);

export default router;