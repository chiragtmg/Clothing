// src/pages/Cart.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { imgBaseURL, apiRequest } from "../Services/API";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const Cart = () => {
	const [cartItems, setCartItems] = useState([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { refreshCart } = useCart();
	const navigate = useNavigate();
	const {currentUser} = useContext(AuthContext);

	// Fetch cart on mount
	useEffect(() => {
		const fetchCart = async () => {
			if (!currentUser) {
				navigate("/");
				return;
			}
			try {
				setLoading(true);
				const res = await apiRequest.get("/cart");
				const items = res.data.cart || [];
				setCartItems(items);

				const sum = items.reduce(
					(acc, item) => acc + item.price * item.quantity,
					0,
				);
				setTotal(sum);
			} catch (err) {
				console.error("Cart fetch error:", err);
				setError("Failed to load cart. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		fetchCart();
	}, []);
	const getImage = (item) => {
		if (item.images && item.images.length > 0) {
			return `${imgBaseURL}${item.images[0]}`;
		}
		if (item.image) {
			return `${imgBaseURL}${item.image}`;
		}
		return "/placeholder-product.jpg";
	};

	const updateQuantity = async (productId, newQuantity) => {
		if (newQuantity < 1) return; 
		try {
			await apiRequest.put("/cart/update", {
				productId,
				quantity: newQuantity,
			});

			setCartItems((prev) =>
				prev.map((item) =>
					item.productId === productId
						? { ...item, quantity: newQuantity }
						: item,
				),
			);

			setTotal(
				(prev) =>
					prev +
					(newQuantity -
						cartItems.find((i) => i.productId === productId).quantity) *
						cartItems.find((i) => i.productId === productId).price,
			);

			toast.success("Quantity updated");
		} catch (err) {
			toast.error("Failed to update quantity");
			console.error(err);
		}
	};

	const removeItem = async (productId) => {
		try {
			const res = await apiRequest.delete(`/cart/remove/${productId}`);
			refreshCart();
			console.log("DELETE RESPONSE:", res.data);

			const removedItem = cartItems.find(
				(item) => item.productId === productId,
			);
			setCartItems((prev) =>
				prev.filter((item) => item.productId !== productId),
			);

			setTotal((prev) => prev - removedItem.price * removedItem.quantity);

			toast.success("Item removed from cart");
		} catch (err) {
			toast.error("Failed to remove item");
			console.error(err);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-xl text-gray-600">Loading your cart...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<p className="text-red-600 text-xl mb-4">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">
					Your Shopping Cart
				</h1>

				{cartItems.length === 0 ? (
					<div className="bg-white rounded-xl shadow-sm p-10 text-center">
						<div className="text-6xl mb-6">🛒</div>
						<h2 className="text-2xl font-semibold text-gray-800 mb-4">
							Your cart is empty
						</h2>
						<p className="text-gray-600 mb-8">
							Looks like you haven't added anything yet.
						</p>
						<button
							onClick={() => navigate("/")}
							className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
						>
							Continue Shopping
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2">
							<div className="bg-white rounded-xl shadow-sm overflow-hidden">
								{cartItems.map((item) => (
									<div
										key={item.productId}
										className="flex flex-col sm:flex-row items-center border-b last:border-b-0 p-6 gap-6 hover:bg-gray-50 transition"
									>
										<div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
											<img
												src={getImage(item)}
												alt={item.name}
												className="w-full h-full object-cover"
												onError={(e) =>
													(e.target.src = "/placeholder-product.jpg")
												}
											/>
										</div>

										<div className="flex-1">
											<h3 className="text-lg font-semibold text-gray-900 mb-1">
												{item.name}
											</h3>
											<p className="text-indigo-600 font-medium mb-3">
												NPR {Number(item.price).toLocaleString()}
											</p>

											<div className="flex items-center gap-4">
												<button
													onClick={() =>
														updateQuantity(item.productId, item.quantity - 1)
													}
													className="w-10 h-10 flex items-center justify-center border rounded-md hover:bg-gray-100 disabled:opacity-50"
													disabled={item.quantity <= 1}
												>
													-
												</button>
												<span className="w-12 text-center font-medium">
													{item.quantity}
												</span>
												<button
													onClick={() =>
														updateQuantity(item.productId, item.quantity + 1)
													}
													className="w-10 h-10 flex items-center justify-center border rounded-md hover:bg-gray-100"
												>
													+
												</button>
											</div>
										</div>

										<div className="text-right min-w-[140px]">
											<p className="text-lg font-bold text-gray-900">
												NPR {(item.price * item.quantity).toLocaleString()}
											</p>
											<button
												onClick={() => removeItem(item.productId)}
												className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium"
											>
												Remove
											</button>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="lg:col-span-1">
							<div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
								<h2 className="text-xl font-bold text-gray-900 mb-6">
									Order Summary
								</h2>

								<div className="space-y-4 mb-8">
									<div className="flex justify-between text-gray-700">
										<span>Subtotal ({cartItems.length} items)</span>
										<span>NPR {Number(total).toLocaleString()}</span>
									</div>
									<div className="flex justify-between text-gray-700">
										<span>Shipping</span>
										<span className="text-green-600">
											Calculated at checkout
										</span>
									</div>
									<div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-900">
										<span>Total</span>
										<span>NPR {Number(total).toLocaleString()}</span>
									</div>
								</div>

								<button
									onClick={() => navigate("/checkout")} // or trigger checkout flow
									className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition mb-4"
								>
									Proceed to Checkout
								</button>

								<button
									onClick={() => navigate("/")}
									className="w-full py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition"
								>
									Continue Shopping
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Cart;
