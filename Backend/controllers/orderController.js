import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import { sendEmail } from "../utils/sendEmail.js";

export const createOrder = async (req, res) => {
	try {
		const { items, shippingDetails, paymentMethod, totalAmount } = req.body;
		const userId = req.userId;

		if (!items || items.length === 0) {
			return res
				.status(400)
				.json({ success: false, message: "No items in order" });
		}

		// Stock Deduction with better matching
		for (const item of items) {
			const product = await Product.findById(item.productId);
			if (!product) {
				return res.status(404).json({
					success: false,
					message: `Product not found: ${item.name}`,
				});
			}

			// Improved size matching logic
			let variant = null;

			// 1. Try exact size match
			if (item.size) {
				variant = product.variants.find((v) => v.size === item.size);
			}

			// 2. Try "One Size" as fallback
			if (!variant) {
				variant = product.variants.find((v) => v.size === "One Size");
			}

			// 3. If still not found, take the first available variant (last resort)
			if (!variant && product.variants.length > 0) {
				variant = product.variants[0];
			}

			if (!variant) {
				return res.status(400).json({
					success: false,
					message: `No size available for ${item.name}`,
				});
			}

			// Check stock
			if (variant.stock < item.quantity) {
				return res.status(400).json({
					success: false,
					message: `Not enough stock for ${item.name} (${variant.size}) - Available: ${variant.stock}`,
				});
			}

			// Deduct stock
			variant.stock -= item.quantity;
			await product.save();
		}

		// Create Order
		const newOrder = await Order.create({
			user: userId,
			items,
			shippingDetails,
			paymentMethod,
			totalAmount,
		});
		try {
			await sendEmail({
				to: shippingDetails.email,
				subject: "Order Confirmation 🎉",
				html: `
    <h2>Thank you for your order!</h2>
    <p>Hello ${shippingDetails.firstName},</p>
    <p>Your order has been placed successfully.</p>

    <h3>Order Items:</h3>
    <ul>
      ${items
				.map(
					(item) => `
        <li>${item.name} x ${item.quantity}</li>
      `,
				)
				.join("")}
    </ul>

    <p><b>Total Amount:</b> NPR ${totalAmount}</p>
    <p>Payment Method: ${paymentMethod}</p>
  `,
			});

			// ✅ SEND EMAIL TO ADMIN
			await sendEmail({
				to: process.env.ADMIN_EMAIL,
				subject: "New Order Received 🛒",
				html: `
    <h2>New Order Alert</h2>
    <p>Customer: ${shippingDetails.firstName}</p>
    <p>Email: ${shippingDetails.email}</p>
    <p>Phone: ${shippingDetails.phone} </p>
    <p>${shippingDetails.firstName} order has been placed successfully.</p>
    <h3>Order Items:</h3>
    <ul>
      ${items
				.map(
					(item) => `
        <li>${item.name} x ${item.quantity}</li>
      `,
				)
				.join("")}
    </ul>
    <p>Total: NPR ${totalAmount}</p>
    <p>Payment: ${paymentMethod}</p>
  `,
			});
		} catch (err) {
			console.log("Email failed but order created");
			console.error("❌ Email error FULL:", error);
		}

		// Clear Cart
		await User.findByIdAndUpdate(userId, { cartData: {} });

		res.status(201).json({
			success: true,
			message: "Order placed successfully",
			order: newOrder,
		});
	} catch (error) {
		console.error("Create Order Error:", error);
		res.status(500).json({
			success: false,
			message: "Failed to place order",
		});
	}
};

// Get My Orders
export const getMyOrders = async (req, res) => {
	try {
		const userId = req.userId;

		// Pagination
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5; // 5 orders per page
		const skip = (page - 1) * limit;

		// Get total count for pagination info
		const totalOrders = await Order.countDocuments({ user: userId });

		// Fetch orders with pagination
		const orders = await Order.find({ user: userId })
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		const totalPages = Math.ceil(totalOrders / limit);

		res.status(200).json({
			success: true,
			orders,
			currentPage: page,
			totalPages,
			totalOrders,
			hasNextPage: page < totalPages,
			hasPrevPage: page > 1,
		});
	} catch (error) {
		console.error("Error fetching orders:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch orders",
		});
	}
};
