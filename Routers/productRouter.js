import express from 'express';
import { Router } from 'express';
import productController from '../Controllers/productController.js';

Router.get("/category/:categoryId", productController.getAllProducts);
Router.get("/:id", productController.getProduct);

module.exports = Router;