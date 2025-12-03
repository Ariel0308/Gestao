import express from 'express';
import { Router } from 'express';
import loginController from '../Controllers/loginController.js';
import signUpController from '../Controllers/signUpController.js';

Router.post('/login', loginController.login);
Router.post('/signup', signUpController.createUser);

module.exports = Router;