import express from "express";
import { verifyToken } from "../config/middleware/verifyToken.js";
import { getAnalytics } from "../controllers/adminController.js";
import { verifyTokenAndAdmin } from "../config/middleware/adminOnly.js";

const router = express.Router();

router.use(verifyToken);

router.get("/admin/analytics", verifyTokenAndAdmin, getAnalytics);

export default router;
