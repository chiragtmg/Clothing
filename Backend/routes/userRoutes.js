import express from "express";
import { updateUser } from "../controllers/userController.js"; //.js should be use to know file path
import { verifyToken } from "../config/middleware/verifyToken.js";

const router = express.Router();

router.put("/edit/:id", verifyToken, updateUser);

export default router;
