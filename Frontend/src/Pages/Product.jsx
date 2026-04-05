import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest, imgBaseURL } from "../Services/API";
import { toast } from "react-toastify"; // ← assuming you have react-toastify installed
import { useCart } from "../context/CartContext";

const Product = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [product, setProduct] = useState(null);
	const [mainImage, setMainImage] = useState("");
	const [selectedSize, setSelectedSize] = useState("");
	const [selectedVariant, setSelectedVariant] = useState(null);
	const [existingImages, setExistingImages] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [addingToCart, setAddingToCart] = useState(false); // ← new: button loading state
	const [error, setError] = useState("");
	const { refreshCart } = useCart();

	useEffect(() => {
		const fetchProduct = async () => {
			if (!id) return;

			try {
				setIsLoading(true);
				const res = await apiRequest.get(`/product/get/product/${id}`);
				const data = res.data.data || res.data;

				setProduct(data);

				let images = [];
				if (
					data.images &&
					Array.isArray(data.images) &&
					data.images.length > 0
				) {
					images = data.images.map((img) => `${imgBaseURL}${img}`);
				} else if (data.image) {
					images = [`${imgBaseURL}${data.image}`];
				}

				setExistingImages(images);
				setMainImage(images[0] || "");

				if (data.variants && data.variants.length > 0) {
					const firstWithStock =
						data.variants.find((v) => v.stock > 0) || data.variants[0];
					setSelectedSize(firstWithStock.size);
					setSelectedVariant(firstWithStock);
				}
			} catch (err) {
				console.error("Fetch product error:", err);
				setError("Failed to load product");
			} finally {
				setIsLoading(false);
			}
		};

		fetchProduct();
	}, [id]);

	// Auto-play thumbnails
	useEffect(() => {
		if (existingImages.length <= 1) return;

		const interval = setInterval(() => {
			setMainImage((prev) => {
				const currentIndex = existingImages.indexOf(prev);
				const nextIndex = (currentIndex + 1) % existingImages.length;
				return existingImages[nextIndex];
			});
		}, 4000);

		return () => clearInterval(interval);
	}, [existingImages]);

	const getStockStatus = (qty = 0) => {
		if (qty > 20) return { text: "In Stock", color: "text-green-600" };
		if (qty > 0) return { text: "Low Stock", color: "text-orange-600" };
		return { text: "Out of Stock", color: "text-red-600" };
	};

	const handleSizeSelect = (size) => {
		setSelectedSize(size);
		const variant = product?.variants?.find((v) => v.size === size);
		setSelectedVariant(variant || null);
	};

	const stock = selectedVariant?.stock ?? 0;
	const stockStatus = getStockStatus(stock);

	const handleAddToCart = async () => {
		if (stock === 0) return;

		setAddingToCart(true);

		try {
			const response = await apiRequest.post("/cart/add", {
				productId: id,
				quantity: 1, // you can make this dynamic later
			});

			if (response.data.success) {
				toast.success("Added to cart successfully!");
				refreshCart();
			}
		} catch (err) {
			console.error("Add to cart error:", err);
			const message = err.response?.data?.message || "Failed to add to cart";
			toast.error(message);
		} finally {
			setAddingToCart(false);
		}
	};

	if (isLoading) {
		return (
			<main className="container mx-auto px-4 py-12 text-center">
				<div className="text-lg text-gray-600">Loading product...</div>
			</main>
		);
	}

	if (error || !product) {
		return (
			<main className="container mx-auto px-4 py-12 text-center">
				<p className="text-red-600 text-xl">{error || "Product not found"}</p>
				<button
					onClick={() => navigate(-1)}
					className="mt-6 px-6 py-3 bg-gray-800 text-white rounded-lg"
				>
					Go Back
				</button>
			</main>
		);
	}

	return (
		<main className="container mx-auto px-4 py-8 max-w-6xl">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
				{/* LEFT - Thumbnails */}
				<div className="flex flex-row md:flex-col gap-3 md:gap-4 order-2 md:order-1">
					{existingImages.map((img, index) => (
						<div
							key={index}
							onClick={() => setMainImage(img)}
							className={`
                cursor-pointer border-2 rounded-md overflow-hidden transition-all duration-200 
                hover:scale-105 hover:border-blue-500 hover:shadow-md
                flex-shrink-0 w-40 md:w-55 lg:w-60
                aspect-[4/5] md:aspect-[3/4]   
                ${
									mainImage === img
										? "border-blue-600 shadow-lg ring-1 ring-blue-400"
										: "border-gray-300"
								}
              `}
						>
							<img
								src={img}
								alt={`Product view ${index + 1}`}
								className="w-full h-full object-contain bg-white"
								onError={(e) => {
									e.target.src = "/placeholder-image.jpg";
								}}
							/>
						</div>
					))}

					{existingImages.length === 0 && (
						<p className="text-gray-500 italic text-center w-full py-6">
							No additional images
						</p>
					)}
				</div>

				{/* RIGHT - Main content */}
				<div className="order-1 md:order-2 space-y-6">
					<div className="border-2 border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm aspect-[4/5] md:aspect-[3/4]">
						{mainImage ? (
							<img
								src={mainImage}
								alt={product.name}
								className="w-full h-full object-cover transition-opacity duration-300"
								onError={(e) => {
									e.target.src = "/placeholder-image.jpg";
								}}
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
								No image available
							</div>
						)}
					</div>

					<div className="space-y-5">
						<h1 className="text-3xl md:text-4xl font-bold tracking-tight">
							{product.name}
						</h1>

						<div className="flex items-center gap-3">
							<span className="text-yellow-500 text-2xl">★★★★★</span>
							<span className="text-gray-600 text-sm">(10 reviews)</span>
						</div>

						<p className="text-4xl font-semibold text-green-700">
							NPR {Number(product.price).toLocaleString()}
						</p>

						{/* Size selection */}
						<div className="space-y-3">
							<label className="block text-lg font-medium text-gray-900">
								Select Size
							</label>
							<div className="flex flex-wrap gap-3">
								{product.variants?.length > 0 ? (
									product.variants.map((variant) => (
										<button
											key={variant.size}
											type="button"
											onClick={() => handleSizeSelect(variant.size)}
											className={`
                        px-6 py-2.5 text-sm font-medium rounded-md border transition-all
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        ${
													selectedSize === variant.size
														? "bg-gray-900 text-white border-gray-900"
														: "border-gray-300 hover:border-gray-500 hover:bg-gray-50"
												}
                      `}
										>
											{variant.size}
										</button>
									))
								) : (
									<p className="text-gray-500">No sizes available</p>
								)}
							</div>
						</div>

						{/* Stock status */}
						{selectedVariant && (
							<p className={`font-medium ${stockStatus.color}`}>
								{stockStatus.text} ({stock} available)
							</p>
						)}

						{/* Add to Cart button */}
						<button
							onClick={handleAddToCart}
							disabled={stock === 0 || addingToCart}
							className={`
                w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2
                ${
									stock > 0
										? addingToCart
											? "bg-blue-400 cursor-wait"
											: "bg-blue-600 hover:bg-blue-700 text-white"
										: "bg-gray-400 cursor-not-allowed text-gray-700"
								}
              `}
						>
							{addingToCart ? (
								<>
									<svg
										className="animate-spin h-5 w-5 text-white"
										viewBox="0 0 24 24"
									>
										<circle
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
											fill="none"
										/>
									</svg>
									Adding...
								</>
							) : stock > 0 ? (
								"Add to Cart"
							) : (
								"Out of Stock"
							)}
						</button>

						{product.description && (
							<div className="pt-4 border-t">
								<h3 className="text-lg font-semibold mb-2">Description</h3>
								<p className="text-gray-700">{product.description}</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Related Products placeholder */}
			<section className="mt-16 pt-12 border-t border-gray-200">
				<h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
					Related Products
				</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
					{[
						{ name: "Men long T-shirt", price: 1200 },
						{ name: "Men Trouser", price: 2000 },
						{ name: "Kid Jacket", price: 2500 },
						{ name: "Women T-shirt", price: 1500 },
					].map((item, i) => (
						<div
							key={i}
							className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
						>
							<div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
								Image
							</div>
							<div className="p-4">
								<h3 className="font-medium text-gray-900 truncate">
									{item.name}
								</h3>
								<p className="mt-1 text-green-700 font-semibold">
									NPR {item.price}
								</p>
							</div>
						</div>
					))}
				</div>
			</section>
		</main>
	);
};

export default Product;
