import User from "../models/userModel.js";
import Product from "../models/productModel.js";

export const addToCart = async (req, res) => {
	try {
		const userId = req.userId;
		const { productId, quantity = 1 } = req.body;

		console.log("addToCart called → user:", userId);
		console.log("Product ID:", productId, "Quantity:", quantity);

		const user = await User.findById(userId);
		if (!user) {
			console.log("User not found");
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		if (!user.cartData) user.cartData = {};

		const currentQty = user.cartData[productId] || 0;
		user.cartData[productId] = currentQty + Number(quantity);
		user.markModified("cartData");

		await user.save();

		console.log("Cart after save:", user.cartData);

		res.status(200).json({
			success: true,
			message: "Item added to cart",
			cart: user.cartData,
		});
	} catch (error) {
		console.error("addToCart error:", error);
		res.status(500).json({ success: false, message: error.message });
	}
};

export const getCart = async (req, res) => {
	try {
		const userId = req.userId;

		const user = await User.findById(userId);

		if (!user || !user.cartData || Object.keys(user.cartData).length === 0) {
			return res.status(200).json({
				success: true,
				cart: [],
				totalItems: 0,
			});
		}

		const productIds = Object.keys(user.cartData);

		const products = await Product.find({ _id: { $in: productIds } }).select(
			"name price images category subCategory variants", // adjust fields
		);

		const cartItems = products.map((product) => ({
			productId: product._id,
			name: product.name,
			price: product.price,
			image: product.images?.[0] || "", 
			quantity: user.cartData[product._id.toString()],
		}));

		const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

		res.status(200).json({
			success: true,
			cart: cartItems,
			totalItems,
			rawCartData: user.cartData,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const updateCartItem = async (req, res) => {
	try {
		const userId = req.userId;
		const { productId, quantity } = req.body;

		if (!productId || quantity === undefined) {
			return res
				.status(400)
				.json({ success: false, message: "Product ID and quantity required" });
		}

		const user = await User.findById(userId);
		if (!user.cartData?.[productId]) {
			return res
				.status(404)
				.json({ success: false, message: "Item not in cart" });
		}

		const newQty = Number(quantity);

		if (newQty <= 0) {
			delete user.cartData[productId];
		} else {
			user.cartData[productId] = newQty;
		}
		user.markModified("cartData");
		await user.save();

		res.status(200).json({
			success: true,
			message: newQty > 0 ? "Quantity updated" : "Item removed",
			cart: user.cartData,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const removeFromCart = async (req, res) => {
	try {
		const userId = req.userId;
		const { productId } = req.params;
		console.log("User ID:", req.userId);
		console.log("Product to delete:", productId);

		const user = await User.findById(userId);

		if (!user.cartData?.[productId]) {
			return res
				.status(404)
				.json({ success: false, message: "Item not found in cart" });
		}

		delete user.cartData[productId];
		user.markModified("cartData");
		await user.save();

		res.status(200).json({
			success: true,
			message: "Item removed from cart",
			cart: user.cartData,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const clearCart = async (req, res) => {
	try {
		const userId = req.userId;

		const user = await User.findById(userId);
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		user.cartData = {};
		await user.save();

		res.status(200).json({
			success: true,
			message: "Cart cleared successfully",
		});
	} catch (error) {
		console.error("Clear cart error:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};
