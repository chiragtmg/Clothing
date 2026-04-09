import express from "express";
import { verifyToken } from "../config/middleware/verifyToken.js";
import { createOrder, getAllOrders, getMyOrders, updateOrderStatus } from "../controllers/orderController.js";
import { verifyTokenAndAdmin } from "../config/middleware/adminOnly.js";

const router = express.Router();

// Protect all order routes
router.use(verifyToken);

router.post("/create", createOrder);
router.get("/myorders", getMyOrders);
router.get('/adminorders', verifyTokenAndAdmin, getAllOrders);
router.put('/orders/:orderId/status', verifyTokenAndAdmin, updateOrderStatus);

export default router;
