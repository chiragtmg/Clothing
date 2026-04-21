import axios from "axios";
import { createOrder } from "./orderController.js";

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;

const KHALTI_INITIATE_URL = "https://dev.khalti.com/api/v2/epayment/initiate/";
const KHALTI_LOOKUP_URL = "https://dev.khalti.com/api/v2/epayment/lookup/";

export const initiateKhaltiPayment = async (req, res) => {
	try {
		const { amount, shippingDetails } = req.body;

		const amountInPaisa = Math.round(amount * 100);

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
				phone: shippingDetails.phone.replace(/\D/g, "").slice(-10),
			},
		};

		const response = await axios.post(KHALTI_INITIATE_URL, payload, {
			headers: {
				Authorization: `Key ${KHALTI_SECRET_KEY}`,
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
		});
	}
};

export const verifyKhaltiPayment = async (req, res) => {
	try {
		const { pidx, pendingOrder } = req.body;

		if (!pidx) {
			return res.status(400).json({
				success: false,
				message: "pidx is required",
			});
		}

		if (!pendingOrder || !pendingOrder.cartItems) {
			return res.status(400).json({
				success: false,
				message: "Invalid order data",
			});
		}

		const response = await axios.post(
			KHALTI_LOOKUP_URL,
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

		req.body = {
			items: pendingOrder.cartItems.map((item) => ({
				productId: item.productId,
				name: item.name,
				price: item.price,
				quantity: item.quantity,
				size: item.size || "One Size",
				image: item.image || "",
			})),
			shippingDetails: pendingOrder.shippingDetails,
			paymentMethod: "khalti",
			totalAmount: pendingOrder.totalAmount,
		};

		req.userId = pendingOrder.userId;

		console.log("✅ Khalti verified, creating order...");

		return await createOrder(req, res);
	} catch (error) {
		console.error("Khalti verify error:", {
			message: error.message,
			response: error.response?.data,
		});

		return res.status(500).json({
			success: false,
			message: "Payment verification failed",
		});
	}
};
