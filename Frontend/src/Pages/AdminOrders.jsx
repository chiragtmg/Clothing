import { useEffect, useState } from "react";
import { apiRequest, imgBaseURL } from "../Services/API";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AdminOrders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalOrders, setTotalOrders] = useState(0);
	const [updatingId, setUpdatingId] = useState(null);
	const navigate = useNavigate();
	const currentUser = useContext(AuthContext);

	const limit = 10;

	useEffect(() => {
		if (!currentUser || !currentUser.isAdmin) {
			navigate("/");
			return;
		}
		fetchOrders(currentPage);
	}, [currentUser, currentPage]);

	const fetchOrders = async (page) => {
		try {
			setLoading(true);
			const res = await apiRequest.get(
				`/order/adminorders?page=${page}&limit=${limit}`,
			);

			setOrders(res.data.orders || []);
			setTotalPages(res.data.totalPages || 1);
			setTotalOrders(res.data.totalOrders || 0);
		} catch (err) {
			if (err.response?.status === 401) {
				toast.error("Admin access required");
				navigate("/");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleStatusChange = async (orderId, newStatus) => {
		setUpdatingId(orderId);
		try {
			await apiRequest.put(`/order/orders/${orderId}/status`, {
				status: newStatus,
			});

			setOrders((prev) =>
				prev.map((order) =>
					order._id === orderId ? { ...order, status: newStatus } : order,
				),
			);

			toast.success(`Status updated to ${newStatus}`);
		} catch (err) {
			toast.error("Failed to update status");
		} finally {
			setUpdatingId(null);
		}
	};

	// ✅ Correct getImage for your schema
	const getImage = (item) => {
		if (!item) return "/placeholder-product.jpg";

		// 1. Use image saved directly in order item (most reliable)
		if (item.image) {
			return `${imgBaseURL}${item.image}`;
		}

		// 2. Fallback: Try populated product
		if (item.productId) {
			if (item.productId.images?.length > 0) {
				return `${imgBaseURL}${item.productId.images[0]}`;
			}
			if (item.productId.image) {
				return `${imgBaseURL}${item.productId.image}`;
			}
		}

		return "/placeholder-product.jpg";
	};

	const statusOptions = [
		"Pending",
		"Processing",
		"Shipped",
		"Delivered",
		"Cancelled",
	];

	const statusColors = {
		Pending: "bg-yellow-100 text-yellow-700",
		Processing: "bg-blue-100 text-blue-700",
		Shipped: "bg-purple-100 text-purple-700",
		Delivered: "bg-green-100 text-green-700",
		Cancelled: "bg-red-100 text-red-700",
	};

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-4xl font-bold">All Customer Orders</h1>
					<p className="text-gray-600">
						Total Orders: <span className="font-semibold">{totalOrders}</span>
					</p>
				</div>

				{loading && orders.length === 0 ? (
					<div className="text-center py-20 text-xl">Loading orders...</div>
				) : (
					<>
						<div className="bg-white rounded-2xl shadow overflow-hidden">
							{orders.map((order) => (
								<div
									key={order._id}
									className="p-6 border-b last:border-b-0 hover:bg-gray-50"
								>
									<div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
										<div>
											<p className="text-sm text-gray-500">
												Order ID: {order._id}
											</p>
											<p className="font-medium mt-1">
												{new Date(order.createdAt).toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</p>
											{order.user && (
												<p className="text-sm text-gray-600 mt-1">
													Customer: {order.user.name || order.user.email}
												</p>
											)}
										</div>

										<select
											value={order.status}
											onChange={(e) =>
												handleStatusChange(order._id, e.target.value)
											}
											disabled={updatingId === order._id}
											className={`px-5 py-3 rounded-2xl text-sm font-semibold border-0 focus:ring-2 focus:ring-black ${
												statusColors[order.status]
											}`}
										>
											{statusOptions.map((s) => (
												<option key={s} value={s}>
													{s}
												</option>
											))}
										</select>
									</div>

									{/* Items */}
									<div className="space-y-5">
										{order.items.map((item, index) => (
											<div key={index} className="flex gap-6 items-center">
												<img
													src={getImage(item)}
													alt={item.name}
													className="w-20 h-20 object-cover rounded-xl border"
													onError={(e) => {
														e.target.onerror = null;
														e.target.src = "/placeholder-product.jpg";
													}}
												/>
												<div className="flex-1">
													<h4 className="font-semibold text-lg">{item.name}</h4>
													<p className="text-gray-600">
														NPR {item.price} × {item.quantity}
													</p>
													{item.size && item.size !== "N/A" && (
														<p className="text-sm text-gray-500">
															Size: {item.size}
														</p>
													)}
												</div>
												<div className="font-semibold text-right">
													NPR {(item.price * item.quantity).toFixed(0)}
												</div>
											</div>
										))}
									</div>

									{/* Total */}
									<div className="mt-8 pt-6 border-t flex justify-between text-xl font-bold">
										<span>Total Amount</span>
										<span>NPR {order.totalAmount}</span>
									</div>
								</div>
							))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex justify-center gap-4 mt-12">
								<button
									onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
									disabled={currentPage === 1}
									className="px-6 py-3 bg-white border rounded-xl hover:bg-gray-50 disabled:opacity-50"
								>
									← Previous
								</button>

								{Array.from({ length: totalPages }, (_, i) => i + 1).map(
									(page) => (
										<button
											key={page}
											onClick={() => setCurrentPage(page)}
											className={`w-12 h-12 rounded-2xl font-medium ${
												currentPage === page
													? "bg-black text-white"
													: "bg-white border hover:bg-gray-50"
											}`}
										>
											{page}
										</button>
									),
								)}

								<button
									onClick={() =>
										setCurrentPage((p) => Math.min(totalPages, p + 1))
									}
									disabled={currentPage === totalPages}
									className="px-6 py-3 bg-white border rounded-xl hover:bg-gray-50 disabled:opacity-50"
								>
									Next →
								</button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default AdminOrders;
