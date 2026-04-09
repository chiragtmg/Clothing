// AddProduct.jsx
import { useContext, useState } from "react";
import { apiRequest } from "../Services/API";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SideBar from "../Components/SideBar";
import { useEffect } from "react";

export default function AddItems() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const { currentUser } = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (!currentUser || !currentUser.isAdmin) {
			navigate("/"); // Redirect non-admins to home
		}
	}, [currentUser, navigate]);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		category: "Men",
		subCategory: "Top wear",
		price: "",
		variants: [],
		bestSeller: false,
	});

	const [selectedFiles, setSelectedFiles] = useState([]);
	const [previewUrls, setPreviewUrls] = useState([]);

	const categories = ["Men", "Women", "Kids"];
	const subCategories = {
		Men: ["Top wear", "Bottom wear", "Footwear", "Accessories"],
		Women: ["Top wear", "Bottom wear", "Footwear", "Accessories"],
		Kids: ["Top wear", "Bottom wear", "Footwear", "Accessories"],
	};
	const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];

	const toggleSize = (size) => {
		setFormData((prev) => {
			const exists = prev.variants.some((v) => v.size === size);
			if (exists) {
				// Remove completely
				return {
					...prev,
					variants: prev.variants.filter((v) => v.size !== size),
				};
			}
			// Add with default stock 0
			return {
				...prev,
				variants: [...prev.variants, { size, stock: 0 }],
			};
		});
	};

	const updateStock = (size, stockValue) => {
		const stockNum = stockValue === "" ? 0 : Number(stockValue);
		if (isNaN(stockNum) || stockNum < 0) return;

		setFormData((prev) => ({
			...prev,
			variants: prev.variants.map((v) =>
				v.size === size ? { ...v, stock: stockNum } : v,
			),
		}));
	};

	const getStockForSize = (size) => {
		const variant = formData.variants.find((v) => v.size === size);
		return variant !== undefined ? variant.stock : "";
	};

	const isSizeSelected = (size) =>
		formData.variants.some((v) => v.size === size);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleCategoryChange = (e) => {
		const newCategory = e.target.value;
		setFormData((prev) => ({
			...prev,
			category: newCategory,
			subCategory: subCategories[newCategory]?.[0] || "",
		}));
	};

	const handleImageChange = (e) => {
		const files = Array.from(e.target.files);

		if (files.length > 3) {
			setError("You can only upload up to 3 images");
			return;
		}

		const validFiles = files.filter((file) => {
			if (file.size > 5 * 1024 * 1024) {
				setError("Some files exceed 5MB limit");
				return false;
			}
			return true;
		});

		setSelectedFiles(validFiles);
		const urls = validFiles.map((file) => URL.createObjectURL(file));
		setPreviewUrls(urls);
		setError("");
	};

	const removeImage = (index) => {
		const newFiles = selectedFiles.filter((_, i) => i !== index);
		const newUrls = previewUrls.filter((_, i) => i !== index);
		URL.revokeObjectURL(previewUrls[index]);
		setSelectedFiles(newFiles);
		setPreviewUrls(newUrls);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		setSuccess("");

		// Basic validation
		if (selectedFiles.length === 0) {
			setError("Please upload at least one image");
			setIsLoading(false);
			return;
		}

		if (!formData.name || !formData.description || !formData.price) {
			setError("Please fill in all required fields");
			setIsLoading(false);
			return;
		}

		if (formData.variants.length === 0) {
			setError("Please select at least one size");
			setIsLoading(false);
			return;
		}

		try {
			const submitData = new FormData();

			submitData.append("name", formData.name);
			submitData.append("description", formData.description);
			submitData.append("category", formData.category);
			submitData.append("subCategory", formData.subCategory);
			submitData.append("price", formData.price);
			submitData.append("variants", JSON.stringify(formData.variants));
			submitData.append("bestSeller", formData.bestSeller);

			selectedFiles.forEach((file) => {
				submitData.append("images", file);
			});

			const res = await apiRequest.post("/product/create/product", submitData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${currentUser?.token}`,
				},
			});

			if (res.data.success) {
				setSuccess("Product added successfully!");

				// Reset form
				setFormData({
					name: "",
					description: "",
					category: "Men",
					subCategory: "Top wear",
					price: "",
					variants: [],
					bestSeller: false,
				});
				setSelectedFiles([]);
				setPreviewUrls([]);

				setTimeout(() => {
					navigate("/");
				}, 2000);
			}
		} catch (err) {
			setError(err.response?.data?.message || "Something went wrong");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
				{/* Sidebar */}
				<SideBar />

				{/* Main Content */}
				<main className="p-6 md:p-8">
					<div className="flex items-center justify-between mb-8">
						<h1 className="text-2xl md:text-3xl font-bold text-gray-900">
							Admin Panel
						</h1>
						<button className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition">
							Logout
						</button>
					</div>

					{/* Form Card */}
					<div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-3xl mx-auto">
						<h2 className="text-xl font-semibold text-gray-800 mb-6">
							Add New Product
						</h2>

						{/* Messages */}
						{error && (
							<div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
								{error}
							</div>
						)}
						{success && (
							<div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg">
								{success}
							</div>
						)}

						{/* Images */}
						<div className="mb-8">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Product Images (Max 3)
							</label>

							{previewUrls.length > 0 && (
								<div className="grid grid-cols-3 gap-4 mb-4">
									{previewUrls.map((url, index) => (
										<div key={index} className="relative group">
											<img
												src={url}
												alt={`Preview ${index + 1}`}
												className="w-full h-32 object-cover rounded-lg border border-gray-200"
											/>
											<button
												type="button"
												onClick={() => removeImage(index)}
												className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
											>
												×
											</button>
										</div>
									))}
								</div>
							)}

							<div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors cursor-pointer relative">
								<input
									type="file"
									multiple
									accept="image/*"
									onChange={handleImageChange}
									className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
								/>
								<div className="flex justify-center gap-6 mb-4 text-5xl text-gray-400">
									<span>☁️↑</span>
									<span>☁️↑</span>
									<span>☁️↑</span>
								</div>
								<p className="text-gray-600">
									{selectedFiles.length > 0
										? `${selectedFiles.length} image(s) selected`
										: "Click or drag images here (max 3)"}
								</p>
								<p className="text-sm text-gray-400 mt-2">
									PNG, JPG, GIF up to 5MB each
								</p>
							</div>
						</div>

						<form className="space-y-6" onSubmit={handleSubmit}>
							{/* Name */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1.5">
									Product name *
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									placeholder="e.g. Slim Fit Cotton T-Shirt"
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
									required
								/>
							</div>

							{/* Description */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1.5">
									Product Description *
								</label>
								<textarea
									name="description"
									value={formData.description}
									onChange={handleInputChange}
									rows={4}
									placeholder="Write a detailed description..."
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-y"
									required
								/>
							</div>

							{/* Category + Sub + Price */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">
										Product category *
									</label>
									<select
										name="category"
										value={formData.category}
										onChange={handleCategoryChange}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
										required
									>
										{categories.map((cat) => (
											<option key={cat} value={cat}>
												{cat}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">
										Sub category *
									</label>
									<select
										name="subCategory"
										value={formData.subCategory}
										onChange={handleInputChange}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
										required
									>
										{subCategories[formData.category]?.map((sub) => (
											<option key={sub} value={sub}>
												{sub}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">
										Product Price *
									</label>
									<input
										type="number"
										name="price"
										value={formData.price}
										onChange={handleInputChange}
										min={0}
										step="0.01"
										placeholder="0.00"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
										required
									/>
								</div>
							</div>

							{/* ─── SIZES & STOCK ──────────────────────────────────────── */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-3">
									Available Sizes & Stock *
								</label>

								<div className="flex flex-wrap gap-3">
									{sizeOptions.map((size) => {
										const selected = isSizeSelected(size);
										const stock = getStockForSize(size);

										return (
											<div
												key={size}
												className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-all min-w-[150px] ${
													selected
														? "border-indigo-500 bg-indigo-50/60"
														: "border-gray-300 hover:border-gray-400"
												}`}
											>
												<button
													type="button"
													onClick={() => toggleSize(size)}
													className={`w-10 h-10 flex items-center justify-center rounded font-semibold text-base ${
														selected
															? "bg-indigo-600 text-white"
															: "bg-gray-100 text-gray-700 hover:bg-gray-200"
													}`}
												>
													{size}
												</button>

												{selected && (
													<input
														type="number"
														min="0"
														placeholder="Stock"
														value={stock}
														onChange={(e) => updateStock(size, e.target.value)}
														className="w-20 px-2 py-1.5 text-center border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
													/>
												)}
											</div>
										);
									})}
								</div>

								{formData.variants.length === 0 && (
									<p className="text-sm text-gray-500 mt-3">
										Select at least one size and enter stock quantity
									</p>
								)}
							</div>

							{/* Bestseller */}
							<div className="flex items-center gap-3">
								<input
									type="checkbox"
									id="bestseller"
									name="bestSeller"
									checked={formData.bestSeller}
									onChange={handleInputChange}
									className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
								/>
								<label
									htmlFor="bestseller"
									className="text-sm font-medium text-gray-700"
								>
									Mark as bestseller
								</label>
							</div>

							{/* Submit */}
							<button
								type="submit"
								disabled={isLoading}
								className={`w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition mt-6 ${
									isLoading ? "opacity-50 cursor-not-allowed" : ""
								}`}
							>
								{isLoading ? "Adding Product..." : "ADD PRODUCT"}
							</button>
						</form>
					</div>
				</main>
			</div>
		</div>
	);
}
