import React, { useEffect, useState, useMemo } from "react";
import { apiRequest } from "../Services/API";
import ProductCard from "../Components/ProductCard";

const Collection = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Filter states
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [selectedTypes, setSelectedTypes] = useState([]);

	// Sort state
	const [sortOption, setSortOption] = useState("Relevance");

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

	const filteredAndSortedProducts = useMemo(() => {
		let result = [...products];

		// 1. Category filter
		if (selectedCategories.length > 0) {
			result = result.filter((p) => selectedCategories.includes(p.category));
		}

		// 2. Type (subCategory) filter
		if (selectedTypes.length > 0) {
			result = result.filter((p) => selectedTypes.includes(p.subCategory));
		}

		// 3. Sorting
		switch (sortOption) {
			case "Price: Low to High":
				result.sort((a, b) => a.price - b.price);
				break;

			case "Price: High to Low":
				result.sort((a, b) => b.price - a.price);
				break;

			case "Newest First":
				result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
				break;

			case "Popularity":
				result.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
				break;

			case "Relevance":
			default:
				// keep original order from DB (or you can add your own relevance logic)
				break;
		}

		return result;
	}, [products, selectedCategories, selectedTypes, sortOption]);

	const handleCategoryChange = (e) => {
		const value = e.target.value;
		setSelectedCategories((prev) =>
			e.target.checked ? [...prev, value] : prev.filter((cat) => cat !== value),
		);
	};

	const handleTypeChange = (e) => {
		const value = e.target.value;
		setSelectedTypes((prev) =>
			e.target.checked ? [...prev, value] : prev.filter((t) => t !== value),
		);
	};

	if (loading) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<p className="text-xl text-gray-600">Loading products...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<p className="text-xl text-red-600">{error}</p>
			</div>
		);
	}

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
			<div className="flex flex-col lg:flex-row gap-8 xl:gap-10">
				{/* Sidebar Filters */}
				<aside className="w-full lg:w-72 xl:w-80 flex-shrink-0">
					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-20">
						<h2 className="text-2xl font-bold text-gray-900 mb-8">FILTERS</h2>

						{/* Categories */}
						<div className="mb-10">
							<h3 className="text-lg font-semibold text-gray-800 mb-4">
								CATEGORIES
							</h3>
							<div className="space-y-3">
								{["Men", "Women", "Kids"].map((cat) => (
									<label key={cat} className="flex items-center">
										<input
											type="checkbox"
											value={cat}
											checked={selectedCategories.includes(cat)}
											onChange={handleCategoryChange}
											className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
										/>
										<span className="ml-3 text-gray-700">{cat}</span>
									</label>
								))}
							</div>
						</div>

						{/* Type */}
						<div className="mb-10">
							<h3 className="text-lg font-semibold text-gray-800 mb-4">TYPE</h3>
							<div className="space-y-3">
								{["Top wear", "Bottom wear", "Accessories"].map((type) => (
									<label key={type} className="flex items-center">
										<input
											type="checkbox"
											value={type}
											checked={selectedTypes.includes(type)}
											onChange={handleTypeChange}
											className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
										/>
										<span className="ml-3 text-gray-700">{type}</span>
									</label>
								))}
							</div>
						</div>
					</div>
				</aside>

				{/* Products Section */}
				<div className="flex-1">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
							ALL COLLECTIONS
							<span className="ml-3 text-lg font-normal text-gray-500">
								({filteredAndSortedProducts.length})
							</span>
						</h1>

						<div className="flex items-center gap-4">
							<label className="text-gray-700 font-medium">Sort by:</label>
							<select
								value={sortOption}
								onChange={(e) => setSortOption(e.target.value)}
								className="block w-44 rounded-lg border-gray-300 py-2.5 px-4 text-gray-700 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
							>
								<option>Relevance</option>
								<option>Price: Low to High</option>
								<option>Price: High to Low</option>
								<option>Newest First</option>
								<option>Popularity</option>
							</select>
						</div>
					</div>

					{/* Product Grid */}
					{filteredAndSortedProducts.length > 0 ? (
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
							{filteredAndSortedProducts.map((product) => (
								<ProductCard
									key={product._id || product.id}
									product={product}
								/>
							))}
						</div>
					) : (
						<div className="col-span-full py-16 text-center">
							<p className="text-xl text-gray-500">
								No products match the selected filters.
							</p>
							<p className="mt-2 text-gray-400">
								Try changing or removing some filters.
							</p>
						</div>
					)}
				</div>
			</div>
		</main>
	);
};

export default Collection;
