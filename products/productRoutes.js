// routes/productRoutes.js
import express from "express";
import { addProduct } from "./productController.js";
import { getProductsInfinite } from "./productController.js";

const ProductRouter = express.Router();

ProductRouter.post('/add', addProduct);
// 🔥 Infinite loading + filters + search + sorting API
ProductRouter.get('/list', getProductsInfinite);

export default ProductRouter;