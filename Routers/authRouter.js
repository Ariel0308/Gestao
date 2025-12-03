import { Router } from 'express';
import loginController from '../Controllers/loginController.js';
import signUpController from '../Controllers/signUpController.js';

const router = Router();

router.post('/login', loginController.login);
router.post('/signup', signUpController.createUser);

export default router;