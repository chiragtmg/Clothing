import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../Services/API";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

const Checkout = () => {
	const navigate = useNavigate();
	const { refreshCart } = useCart();

	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const [isProcessingEsewa, setIsProcessingEsewa] = useState(false);

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		street: "",
		city: "",
		state: "",
		zipcode: "",
		country: "Nepal",
		phone: "",
	});

	const [paymentMethod, setPaymentMethod] = useState("cod");

	useEffect(() => {
		const fetchCart = async () => {
			try {
				const res = await apiRequest.get("/cart");
				setCartItems(res.data.cart || []);
			} catch (err) {
				console.error(err);
				toast.error("Failed to load cart");
			}
		};
		fetchCart();
	}, []);

	const subTotal = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);
	const shippingCharge = 100;
	const total = subTotal + shippingCharge;

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const validateForm = () => {
		if (
			!formData.firstName ||
			!formData.email ||
			!formData.phone ||
			!formData.street
		) {
			toast.error("Please fill all required fields (marked with *)");
			return false;
		}
		return true;
	};

	const handleCOD = async () => {
		if (!validateForm()) return;
		setLoading(true);

		try {
			const orderData = {
				items: cartItems.map((item) => ({
					productId: item.productId,
					name: item.name,
					price: item.price,
					quantity: item.quantity,
					size: item.size || "One Size",
					image: item.image || "",
				})),
				shippingDetails: formData,
				paymentMethod: "cod",
				totalAmount: total,
				paymentStatus: "pending",
			};

			const res = await apiRequest.post("/order/create", orderData);

			if (res.data.success) {
				toast.success("Order placed successfully! 🎉");
				await apiRequest.delete("/cart/clear");
				refreshCart();
				setTimeout(() => navigate("/myorders"), 1500);
			}
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to place order");
		} finally {
			setLoading(false);
		}
	};

	const handleEsewaPayment = async () => {
		if (!validateForm()) return;

		setIsProcessingEsewa(true);

		try {
			const res = await apiRequest.post("/esewa/initiate", {
				amount: subTotal,
				tax_amount: 0,
				product_service_charge: 0,
				product_delivery_charge: shippingCharge,
			});

			if (res.data.success) {
				const { esewaUrl, paymentData } = res.data;

				const form = document.createElement("form");
				form.method = "POST";
				form.action = esewaUrl;

				Object.keys(paymentData).forEach((key) => {
					const input = document.createElement("input");
					input.type = "hidden";
					input.name = key;
					input.value = paymentData[key];
					form.appendChild(input);
				});

				document.body.appendChild(form);
				form.submit();
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to start eSewa payment");
		} finally {
			setIsProcessingEsewa(false);
		}
	};

	const handlePlaceOrder = () => {
		if (paymentMethod === "cod") {
			handleCOD();
		} else if (paymentMethod === "esewa") {
			handleEsewaPayment();
		} else if (paymentMethod === "khalti") {
			toast.info("Khalti payment coming soon...");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
					{/* Shipping Details */}
					<div className="bg-[#8bc6b3] rounded-3xl p-12">
						<h2 className="text-4xl font-bold text-gray-900 mb-10">
							SHIPPING DETAILS
						</h2>

						<div className="space-y-6">
							<div className="grid grid-cols-2 gap-6">
								<input
									type="text"
									name="firstName"
									placeholder="First name *"
									value={formData.firstName}
									onChange={handleChange}
									className="w-full px-6 py-5 text-lg rounded-2xl bg-white focus:outline-none"
									required
								/>
								<input
									type="text"
									name="lastName"
									placeholder="Last name"
									value={formData.lastName}
									onChange={handleChange}
									className="w-full px-6 py-5 text-lg rounded-2xl bg-white focus:outline-none"
								/>
							</div>

							<input
								type="email"
								name="email"
								placeholder="Email address *"
								value={formData.email}
								onChange={handleChange}
								className="w-full px-6 py-5 text-lg rounded-2xl bg-white focus:outline-none"
								required
							/>

							<input
								type="text"
								name="street"
								placeholder="Street Address *"
								value={formData.street}
								onChange={handleChange}
								className="w-full px-6 py-5 text-lg rounded-2xl bg-white focus:outline-none"
								required
							/>

							<div className="grid grid-cols-2 gap-6">
								<input
									type="text"
									name="city"
									placeholder="City"
									value={formData.city}
									onChange={handleChange}
									className="w-full px-6 py-5 text-lg rounded-2xl bg-white focus:outline-none"
								/>
								<input
									type="text"
									name="state"
									placeholder="State"
									value={formData.state}
									onChange={handleChange}
									className="w-full px-6 py-5 text-lg rounded-2xl bg-white focus:outline-none"
								/>
							</div>

							<div className="grid grid-cols-2 gap-6">
								<input
									type="text"
									name="zipcode"
									placeholder="Zipcode"
									value={formData.zipcode}
									onChange={handleChange}
									className="w-full px-6 py-5 text-lg rounded-2xl bg-white focus:outline-none"
								/>
								<input
									type="text"
									name="country"
									placeholder="Country"
									value={formData.country}
									onChange={handleChange}
									className="w-full px-6 py-5 text-lg rounded-2xl bg-white focus:outline-none"
								/>
							</div>

							<input
								type="tel"
								name="phone"
								placeholder="Phone Number *"
								value={formData.phone}
								onChange={handleChange}
								className="w-full px-6 py-5 text-lg rounded-2xl bg-white focus:outline-none"
								required
							/>
						</div>
					</div>

					{/* Cart Totals & Payment Methods */}
					<div className="bg-[#8bc6b3] rounded-3xl p-12 h-fit">
						<h2 className="text-4xl font-bold text-gray-900 mb-10">
							CART TOTALS
						</h2>

						<div className="space-y-6 text-xl">
							<div className="flex justify-between">
								<span>Sub total</span>
								<span>NPR {subTotal}</span>
							</div>
							<div className="flex justify-between">
								<span>Shipping charge</span>
								<span>NPR {shippingCharge}</span>
							</div>
							<div className="flex justify-between text-3xl font-bold border-t pt-6">
								<span>Total</span>
								<span>NPR {total}</span>
							</div>
						</div>

						<div className="mt-12">
							<h3 className="text-2xl font-semibold mb-6">Payment Method</h3>
							<div className="flex flex-col gap-4">
								<button
									onClick={() => setPaymentMethod("cod")}
									className={`py-5 text-lg font-medium rounded-2xl transition-all ${
										paymentMethod === "cod"
											? "bg-gray-900 text-white"
											: "bg-white hover:bg-gray-100"
									}`}
								>
									Cash on Delivery (COD)
								</button>

								<button
									onClick={() => setPaymentMethod("esewa")}
									className={`py-5 text-lg font-medium rounded-2xl transition-all ${
										paymentMethod === "esewa"
											? "bg-[#3EB14A] text-white"
											: "bg-white hover:bg-gray-100"
									}`}
								>
									Pay with eSewa
								</button>

								<button
									onClick={() => setPaymentMethod("khalti")}
									className={`py-5 text-lg font-medium rounded-2xl transition-all ${
										paymentMethod === "khalti"
											? "bg-purple-600 text-white"
											: "bg-white hover:bg-gray-100"
									}`}
								>
									Pay with Khalti
								</button>
							</div>
						</div>

						<button
							onClick={handlePlaceOrder}
							disabled={loading || isProcessingEsewa}
							className="w-full mt-12 py-6 bg-gray-900 text-white text-xl font-semibold rounded-2xl hover:bg-black transition disabled:opacity-70"
						>
							{isProcessingEsewa
								? "Redirecting to eSewa..."
								: loading
								? "Processing Order..."
								: paymentMethod === "esewa"
								? "Pay with eSewa"
								: "Place Order"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
