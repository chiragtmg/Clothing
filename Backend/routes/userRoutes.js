import express from "express";
import { upload } from "../config/middleware/upload.js";
import { updateUser } from "../controllers/userController.js"; //.js should be use to know file path
import { verifyToken } from "../config/middleware/verifyToken.js";

const router = express.Router();

router.put("/edit/:id", upload.single("avatar"), verifyToken, updateUser);

export default router;
