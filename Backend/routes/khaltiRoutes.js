import express from "express";

import {
	initiateKhaltiPayment,
	verifyKhaltiPayment,
} from "../controllers/khaltiController.js";
import { verifyToken } from "../config/middleware/verifyToken.js";

const router = express.Router();
router.use(verifyToken);

router.post("/khalti/initiate", initiateKhaltiPayment);

router.post("/khalti/verify", verifyKhaltiPayment);

export default router;
