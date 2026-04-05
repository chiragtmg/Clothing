import express from "express";
import {
	initiatePayment,
	verifyPayment,
} from "../controllers/esewaController.js";
import { verifyToken } from "../config/middleware/verifyToken.js";

const router = express.Router();

router.post("/esewa/initiate", initiatePayment);
router.post("/esewa/verify", verifyPayment);

export default router;
