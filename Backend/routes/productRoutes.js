import { upload } from "../config/middleware/upload.js";
import { verifyToken } from "../config/middleware/verifyToken.js";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProductById,
	updateProduct,
} from "../controllers/productController.js";
import express from "express";

const router = express.Router();

router.post(
	"/create/product",
	verifyToken,
	upload.array("images", 3),
	createProduct,
);
router.put(
	"/edit/product/:id",
	verifyToken,
	upload.array("images", 3),
	updateProduct,
);
router.delete("/delete/product/:id", verifyToken, deleteProduct);
router.get("/get/product", getAllProducts);
router.get("/get/product/:id", getProductById);

export default router;
