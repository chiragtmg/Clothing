import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../Services/API";
import { useCart } from "../context/CartContext";

const KhaltiSuccess = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { refreshCart } = useCart();

	const [status, setStatus] = useState("verifying");
	const [message, setMessage] = useState("Verifying your payment...");

	const pidx = searchParams.get("pidx");
	const hasVerified = useRef(false);

	useEffect(() => {
		if (!pidx) {
			setStatus("error");
			setMessage("Invalid payment session. No pidx found.");
			return;
		}

		if (hasVerified.current) return;
		hasVerified.current = true;

		verifyPayment();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pidx]);

	const verifyPayment = async () => {
		try {
			const pendingOrderStr = localStorage.getItem("pendingKhaltiOrder");
			const pendingOrder = pendingOrderStr ? JSON.parse(pendingOrderStr) : {};

			if (!pendingOrder.cartItems?.length) {
				throw new Error(
					"Order details missing. Please try again from checkout.",
				);
			}

			// ✅ Only send pidx (do NOT send cartItems etc.)
			const { data } = await apiRequest.post("/khalti/verify", {
				pidx,
				pendingOrder,
			});

			if (data.success) {
				setStatus("success");
				setMessage("✅ Payment successful! Order has been placed.");

				localStorage.removeItem("pendingKhaltiOrder");
				await apiRequest.delete("/cart/clear");
				refreshCart();
				setTimeout(() => {
					navigate("/myorders");
				}, 2500);
			} else {
				throw new Error(data.message || "Verification failed");
			}
		} catch (error) {
			console.error("Verify error:", error.response?.data || error.message);

			setStatus("error");
			setMessage(
				error.response?.data?.message ||
					error.message ||
					"Payment verification failed. Please try again or contact support.",
			);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
			<div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
				{status === "verifying" && (
					<>
						<div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
						<h2 className="text-xl font-semibold text-gray-800">
							Verifying Payment...
						</h2>
						<p className="text-gray-500 mt-2">{message}</p>
					</>
				)}

				{status === "success" && (
					<>
						<div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-5xl">
							✓
						</div>
						<h2 className="text-2xl font-bold text-green-600">
							Payment Successful!
						</h2>
						<p className="text-gray-600 mt-3">{message}</p>
						<p className="text-sm text-gray-500 mt-6">
							Redirecting to Orders page...
						</p>
					</>
				)}

				{status === "error" && (
					<>
						<div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-5xl">
							✕
						</div>
						<h2 className="text-2xl font-bold text-red-600">
							Verification Failed
						</h2>
						<p className="text-gray-600 mt-3">{message}</p>
						<button
							onClick={() => navigate("/checkout")}
							className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
						>
							Back to Checkout
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default KhaltiSuccess;
