// pages/PaymentSuccess.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { apiRequest } from "../Services/API";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

const PaymentSuccess = () => {
	const { refreshCart } = useCart();
	const location = useLocation();

	useEffect(() => {
		const verify = async () => {
			try {
				const params = new URLSearchParams(location.search);
				const data = params.get("data");

				if (!data) {
					toast.error("No payment data found");
					return;
				}

				const res = await apiRequest.post("/esewa/verify", { data });

				if (res.data.success) {
					await apiRequest.post("/order/create", {
						items: JSON.parse(localStorage.getItem("cartItems")),
						shippingDetails: JSON.parse(
							localStorage.getItem("shippingDetails"),
						),
						paymentMethod: "esewa",
						totalAmount: JSON.parse(localStorage.getItem("totalAmount")),
						paymentStatus: "paid",
					});

					// Clear cart
					await apiRequest.delete("/cart/clear");
					refreshCart();

					toast.success("Payment Successful 🎉");
				} else {
					toast.error(res.data.message);
				}
			} catch (err) {
				toast.error("Verification failed");
			}
		};

		verify();
	}, [location]);

	return <h1 className="text-center mt-20 text-3xl">Processing Payment...</h1>;
};

export default PaymentSuccess;
