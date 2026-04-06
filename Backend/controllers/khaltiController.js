import axios from "axios";
import Order from "../models/orderModel.js";

// ---------------------------------------------------
// ✅ IMPORTANT CONFIG
// ---------------------------------------------------

// 🔑 Use SECRET KEY from: https://test-admin.khalti.com
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;

// ✅ SANDBOX URLs (TEST MODE)
const KHALTI_INITIATE_URL = "https://dev.khalti.com/api/v2/epayment/initiate/";
const KHALTI_LOOKUP_URL = "https://dev.khalti.com/api/v2/epayment/lookup/";

// Debug (remove in production)
console.log("Khalti Key:", KHALTI_SECRET_KEY);
console.log("Khalti URL:", KHALTI_INITIATE_URL);

// ---------------------------------------------------
// STEP 1: Initiate Payment
// ---------------------------------------------------
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

// ---------------------------------------------------
// STEP 2: Verify Payment
// ---------------------------------------------------
export const verifyKhaltiPayment = async (req, res) => {
	try {
		const { pidx, cartItems, shippingDetails, totalAmount } = req.body;

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

		// ✅ ONLY "Completed" = success (as per docs)
		if (paymentInfo.status === "Completed") {
			const orderData = {
				items: cartItems.map((item) => ({
					productId: item.productId,
					name: item.name,
					price: item.price,
					quantity: item.quantity,
					size: item.size || "One Size",
					image: item.image || "",
				})),
				shippingDetails,
				paymentMethod: "khalti",
				totalAmount,
				paymentStatus: "paid",
				transactionId: paymentInfo.transaction_id,
			};

			await Order.create(orderData);

			return res.json({
				success: true,
				message: "Payment verified and order placed!",
			});
		} else {
			return res.status(400).json({
				success: false,
				message: `Payment not completed. Status: ${paymentInfo.status}`,
			});
		}
	} catch (error) {
		console.error(
			"Khalti verify error:",
			error.response?.data || error.message,
		);

		return res.status(500).json({
			success: false,
			message: "Payment verification failed",
		});
	}
};
