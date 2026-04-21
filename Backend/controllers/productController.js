import Product from "../models/productModel.js";
import fs from "fs";
import path from "path";

export const createProduct = async (req, res) => {
	const {
		name,
		description,
		price,
		category,
		subCategory,
		variants,
		bestSeller,
	} = req.body;

	try {
		let imagePaths = [];
		if (req.files && req.files.length > 0) {
			imagePaths = req.files.map((file) => `/images/${file.filename}`);
		} else {
			return res.status(400).json({
				success: false,
				message: "At least one image is required",
			});
		}

		let parsedVariants = [];

		if (variants) {
			try {
				parsedVariants = JSON.parse(variants);

				if (!Array.isArray(parsedVariants)) {
					throw new Error("Variants must be an array");
				}

				parsedVariants = parsedVariants
					.filter((v) => v && typeof v === "object")
					.map((v) => ({
						size: String(v.size || "").trim(),
						stock: Number(v.stock) || 0,
					}))
					.filter((v) => v.size !== "" && v.stock >= 0); // remove invalid entries
			} catch (parseError) {
				console.log("Failed to parse variants:", parseError);
				return res.status(400).json({
					success: false,
					message: "Invalid variants format. Must be valid JSON array.",
				});
			}
		}

		if (parsedVariants.length === 0) {
			return res.status(400).json({
				success: false,
				message: "At least one size with stock is required",
			});
		}

		const newProduct = await Product.create({
			name,
			description,
			price: Number(price),
			images: imagePaths,
			category,
			subCategory,
			variants: parsedVariants,
			bestSeller:
				bestSeller === "true" || bestSeller === true || bestSeller === "1",
		});

		res.status(201).json({
			success: true,
			message: "New product created successfully",
			data: newProduct,
		});
	} catch (error) {
		console.error("Error creating product:", error);

		if (req.files && req.files.length > 0) {
			req.files.forEach((file) => {
				fs.unlink(file.path, (err) => {
					if (err) console.error("Error deleting file:", err);
				});
			});
		}

		res.status(500).json({
			success: false,
			message: "Server error while creating product",
			error: error.message,
		});
	}
};

export const updateProduct = async (req, res) => {
	try {
		const productId = req.params.id;
		const updateData = { ...req.body };

		const existingProduct = await Product.findById(productId);
		if (!existingProduct) {
			return res.status(404).json({
				success: false,
				message: "Product not found",
			});
		}

		if (updateData.price) {
			updateData.price = Number(updateData.price);
		}

		if (updateData.bestSeller !== undefined) {
			updateData.bestSeller =
				updateData.bestSeller === "true" || updateData.bestSeller === true;
		}

		if (updateData.variants) {
			try {
				updateData.variants = JSON.parse(updateData.variants);
			} catch (err) {
				return res.status(400).json({
					success: false,
					message: "Invalid variants data format. Must be valid JSON array.",
				});
			}

			if (!Array.isArray(updateData.variants)) {
				return res.status(400).json({
					success: false,
					message: "Variants must be an array",
				});
			}
		}

		if (updateData.sizes) {
			if (typeof updateData.sizes === "string") {
				try {
					updateData.sizes = JSON.parse(updateData.sizes);
				} catch (e) {
					updateData.sizes = updateData.sizes.split(",").map((s) => s.trim());
				}
			}
		}

		let oldImages = [];
		if (req.files && req.files.length > 0) {
			const newImagePaths = req.files.map((file) => `/images/${file.filename}`);

			const keepExistingImages = req.body.keepExistingImages === "true";

			if (keepExistingImages) {
				updateData.images = [...existingProduct.images, ...newImagePaths];
			} else {
				oldImages = existingProduct.images;
				updateData.images = newImagePaths;
			}
		}

		const updatedProduct = await Product.findByIdAndUpdate(
			productId,
			updateData,
			{ new: true, runValidators: true },
		);

		if (oldImages.length > 0) {
			oldImages.forEach((imagePath) => {
				const filename = imagePath.replace("/images/", "");
				const fullPath = path.join(process.cwd(), "public", "images", filename);

				fs.unlink(fullPath, (err) => {
					if (err) console.error("Error deleting old image:", err);
				});
			});
		}

		res.status(200).json({
			success: true,
			message: "Product updated successfully",
			data: updatedProduct,
		});
	} catch (error) {
		console.log("Error updating product:", error);

		if (req.files && req.files.length > 0) {
			req.files.forEach((file) => {
				fs.unlink(file.path, (err) => {
					if (err) console.error("Error deleting file:", err);
				});
			});
		}

		res.status(500).json({
			success: false,
			message: "Server error while updating product",
			error: error.message,
		});
	}
};

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find().sort({ createdAt: -1 });
		res.status(200).json({
			success: true,
			message: "All products retrieved successfully",
			data: products,
		});
	} catch (error) {
		console.log("Error fetching products:", error);
		res.status(500).json({
			success: false,
			message: "Server error while fetching products",
			error: error.message,
		});
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found",
			});
		}

		if (product.images && product.images.length > 0) {
			product.images.forEach((imagePath) => {
				const filename = imagePath.replace("/images/", "");
				const fullPath = path.join(process.cwd(), "public", "images", filename);

				fs.unlink(fullPath, (err) => {
					if (err) console.error("Error deleting image:", err);
				});
			});
		}

		await Product.findByIdAndDelete(req.params.id);

		res.status(200).json({
			success: true,
			message: "Product deleted successfully",
		});
	} catch (error) {
		console.log("Error deleting product:", error);
		res.status(500).json({
			success: false,
			message: "Server error while deleting product",
			error: error.message,
		});
	}
};

export const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Product retrieved successfully",
			data: product,
		});
	} catch (error) {
		console.log("Error fetching product:", error);
		res.status(500).json({
			success: false,
			message: "Server error while fetching product",
			error: error.message,
		});
	}
};
