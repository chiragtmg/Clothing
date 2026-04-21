// ListItems.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ← add this
import SideBar from "../Components/SideBar";
import { apiRequest, imgBaseURL } from "../Services/API";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function ListItems() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const { isLoggedIn, isAdmin, loading: authLoading } = useAuth();

	useEffect(() => {
		if (authLoading) return; 

		if (!isLoggedIn) {
			toast.error("Please login first");
			navigate("/login");
			return;
		}

		if (!isAdmin) {
			toast.error("Access denied. Admin only.");
			navigate("/");
			return;
		}
		fetchProducts();
	}, [isLoggedIn, isAdmin, authLoading, navigate]);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await apiRequest.get("/product/get/product");
			const productsArray = response.data?.data || [];

			setProducts(Array.isArray(productsArray) ? productsArray : []);
		} catch (err) {
			console.error("Failed to fetch products:", err);
			setError("Failed to load products. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	const getImageUrl = (product) => {
		if (product.images && product.images.length > 0) {
			return `${imgBaseURL}${product.images[0]}`;
		} else if (product.image) {
			return `${imgBaseURL}${product.image}`;
		}
		return `${imgBaseURL}/images/placeholder.jpg`;
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this product?")) {
			return;
		}

		try {
			await apiRequest.delete(`/product/delete/product/${id}`);
			setProducts((prev) => prev.filter((p) => p._id !== id));
			toast.success("Product deleted successfully");
		} catch (err) {
			console.error("Delete failed:", err);
			toast.success("Failed to delete product");
		}
	};

	const handleEdit = (id) => {
		navigate(`/editProduct/${id}`);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-lg text-gray-600">Loading products...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-red-600 text-lg">{error}</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
				<SideBar />

				<main className="p-6 md:p-8">
					<div className="flex items-center justify-between mb-8">
						<h1 className="text-2xl md:text-3xl font-bold text-gray-900">
							Admin Panel
						</h1>
						<button className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition">
							Logout
						</button>
					</div>

					<div className="bg-white rounded-xl shadow-lg overflow-hidden">
						<div className="px-6 py-5 border-b border-gray-200">
							<h2 className="text-xl font-semibold text-gray-800">
								All products
							</h2>
						</div>

						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-24">
											Image
										</th>
										<th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
											Name
										</th>
										<th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
											Category
										</th>
										<th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
											Price
										</th>
										<th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-32">
											Action
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{products.map((product) => (
										<tr
											key={product._id}
											className="hover:bg-gray-50 transition-colors"
										>
											<td className="px-6 py-4 whitespace-nowrap">
												<img
													src={getImageUrl(product)}
													alt={product.name}
													className="h-16 w-16 object-cover rounded-md border border-gray-200"
												/>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
												{product.name}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
												{product.category}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
												NPR {product.price?.toLocaleString() || "0"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm flex gap-3">
												<button
													onClick={() => handleEdit(product._id)}
													className="text-blue-600 hover:text-blue-800 font-medium transition"
												>
													Edit
												</button>
												<button
													onClick={() => handleDelete(product._id)}
													className="text-red-600 hover:text-red-800 font-medium transition"
												>
													Delete
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{products.length === 0 && (
							<div className="py-12 text-center text-gray-500">
								No products found. Add some items first.
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
