import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { apiRequest } from "../Services/API";

const LatestCollections = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
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

		fetchProducts();
	}, []);

	return (
		<section className="py-16 px-6 md:px-12 bg-white">
			<div className="max-w-7xl mx-auto">
				<h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
					LATEST COLLECTIONS
				</h2>
				<div className="w-24 h-1 bg-teal-500 mx-auto mb-12 rounded"></div>

				<p className="text-center text-gray-600 mb-12 text-lg">
					Best clothing site for Nepal – Quality | Style | Affordable Prices
				</p>

				{loading ? (
					<p className="text-center text-lg text-gray-500 animate-pulse">
						Loading products...
					</p>
				) : error ? (
					<p className="text-center text-lg text-red-600">{error}</p>
				) : products.length === 0 ? (
					<p className="text-center text-lg text-gray-600">
						No products found.
					</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
						{products.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default LatestCollections;
