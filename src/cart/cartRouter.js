// routes/authRoutes.js
import express from "express";
import { addToCart, getCart, updateCart, removeItem, mergeCart } from "../cart/cartController.js";
const cartRouter = express.Router();

/**
 * NOTE: these routes expect session-based auth (passport)
 * We assume req.isAuthenticated() is available
 */
function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ success: false, message: "Not authenticated" });
}

// Protected routes
cartRouter.get("/", ensureAuth, getCart);
cartRouter.post("/add", ensureAuth, addToCart);
cartRouter.post("/update", ensureAuth, updateCart);
cartRouter.post("/remove", ensureAuth, removeItem);
cartRouter.post("/merge", ensureAuth, mergeCart); // call after successful login, frontend sends guest cart


export default cartRouter;