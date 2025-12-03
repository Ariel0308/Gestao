import express from 'express';
import { Router } from 'express';
import categoryController from '../Controllers/categoryController.js';

Router.get("/", categoryController.getCategories);

module.exports = Router;