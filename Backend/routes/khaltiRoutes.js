import express from "express";

import {
	initiateKhaltiPayment,
	verifyKhaltiPayment,
} from "../controllers/khaltiController.js";

const router = express.Router();

router.post("/khalti/initiate", initiateKhaltiPayment);

// POST /khalti/verify    → confirms payment after Khalti redirects back
router.post("/khalti/verify", verifyKhaltiPayment);

export default router;
