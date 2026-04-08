import axios from "axios";
import Order from "../models/orderModel.js";

// 🔑 Use SECRET KEY from: https://test-admin.khalti.com
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;

// ✅ SANDBOX URLs (TEST MODE)
const KHALTI_INITIATE_URL = "https://dev.khalti.com/api/v2/epayment/initiate/";
const KHALTI_LOOKUP_URL = "https://dev.khalti.com/api/v2/epayment/lookup/";

// Debug (remove in production)
console.log("Khalti Key:", KHALTI_SECRET_KEY);
console.log("Khalti URL:", KHALTI_INITIATE_URL);

export const initiateKhaltiPayment = async (req, res) => {
	try {
		const { amount, cartItems, shippingDetails } = req.body;

		// ✅ Convert to paisa (must be integer)
		const amountInPaisa = Math.round(amount * 100);

		// ❗ Minimum amount check (Rs 10)
		if (amountInPaisa < 1000) {
			return res.status(400).json({
				success: false,
				message: "Minimum amount should be Rs. 10",
			});
		}

		const payload = {
			return_url: "http://localhost:5173/khalti-success",
			website_url: "http://localhost:5173",
			amount: amountInPaisa,
			purchase_order_id: `ORDER_${Date.now()}`,
			purchase_order_name: "My Shop Order",
			customer_info: {
				name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
				email: shippingDetails.email,
				// ✅ Ensure valid 10-digit Nepali number
				phone: shippingDetails.phone.replace(/\D/g, "").slice(-10),
			},
		};

		const response = await axios.post(KHALTI_INITIATE_URL, payload, {
			headers: {
				Authorization: `Key ${KHALTI_SECRET_KEY}`, // MUST be "Key <secret>"
				"Content-Type": "application/json",
			},
		});

		return res.json({
			success: true,
			paymentUrl: response.data.payment_url,
			pidx: response.data.pidx,
		});
	} catch (error) {
		console.error(
			"Khalti initiate error:",
			error.response?.data || error.message,
		);

		return res.status(500).json({
			success: false,
			message: "Failed to initiate Khalti payment",
			error: error.response?.data || error.message,
		});
	}
};

export const verifyKhaltiPayment = async (req, res) => {
	try {
		const { pidx } = req.body;

		if (!pidx) {
			return res.status(400).json({
				success: false,
				message: "pidx is required",
			});
		}

		// Get pending order from localStorage data sent? (optional - better to save in DB)
		const pendingOrder = req.body.pendingOrder || {}; // remove if not sending
		console.log("Pending order received:", JSON.stringify(pendingOrder));
		// 1. Verify with Khalti
		const response = await axios.post(
			KHALTI_LOOKUP_URL, // Must be: https://dev.khalti.com/api/v2/epayment/lookup/  (test) or production
			{ pidx },
			{
				headers: {
					Authorization: `Key ${KHALTI_SECRET_KEY}`,
					"Content-Type": "application/json",
				},
			},
		);

		const paymentInfo = response.data;

		if (paymentInfo.status !== "Completed") {
			return res.status(400).json({
				success: false,
				message: `Payment not completed. Status: ${paymentInfo.status}`,
			});
		}

		// 2. Create Order
		const orderData = {
			items:
				pendingOrder.cartItems?.map((item) => ({
					productId: item.productId,
					name: item.name,
					price: item.price,
					quantity: item.quantity,
					size: item.size || "One Size",
					image: item.image || "",
				})) || [],
			shippingDetails: pendingOrder.shippingDetails,
			paymentMethod: "khalti",
			totalAmount: pendingOrder.totalAmount,
			paymentStatus: "paid",
			transactionId: paymentInfo.transaction_id || paymentInfo.idx,
			user: pendingOrder.userId || req.user?._id, // optional
		};

		const newOrder = await Order.create(orderData);

		console.log(`✅ Order created! ID: ${newOrder._id}`);

		return res.json({
			success: true,
			message: "Payment verified and order placed successfully!",
			orderId: newOrder._id,
		});
	} catch (error) {
		console.error("Khalti verify error details:", {
			message: error.message,
			response: error.response?.data,
			status: error.response?.status,
		});

		return res.status(500).json({
			success: false,
			message:
				"Payment verification failed. Please try again or contact support.",
		});
	}
};
