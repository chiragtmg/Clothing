import express from "express";
import { verifyToken } from "../config/middleware/verifyToken.js";
import {
  createOrder,
  getMyOrders,
} from "../controllers/orderController.js";

const router = express.Router();

// Protect all order routes
router.use(verifyToken);

router.post("/create", createOrder);
router.get("/myorders", getMyOrders);

export default router;