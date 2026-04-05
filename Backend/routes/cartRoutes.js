import express from "express";
import { verifyToken } from "../config/middleware/verifyToken.js";

import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();


router.post("/add",verifyToken, addToCart);
router.get("/", verifyToken, getCart);
router.put("/update",verifyToken, updateCartItem);
router.delete("/remove/:productId",verifyToken, removeFromCart);
router.delete("/clear",verifyToken, clearCart);  

export default router;