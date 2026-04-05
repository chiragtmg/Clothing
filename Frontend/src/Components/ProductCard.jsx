import { useState, useEffect } from "react";
import { imgBaseURL } from "../Services/API";
import { countryList } from "../Services/CountryCode.js";
import { useNavigate } from "react-router-dom";

const BASE_URL =
	"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const ProductCard = ({ product }) => {
	const [toCurrency, setToCurrency] = useState("USD");
	const [convertedPrice, setConvertedPrice] = useState(null);
	const [rate, setRate] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const getImageUrl = () => {
		if (product.images && product.images.length > 0) {
			return `${imgBaseURL}${product.images[0]}`;
		} else if (product.image) {
			return `${imgBaseURL}${product.image}`;
		}
		return `${imgBaseURL}/images/placeholder.jpg`;
	};

	useEffect(() => {
		const fetchRate = async () => {
			if (!product.price) return;

			setLoading(true);
			try {
				const url = `${BASE_URL}/npr.json`;
				const res = await fetch(url);
				if (!res.ok) throw new Error("Failed to fetch rate");

				const data = await res.json();
				const rateValue = data.npr?.[toCurrency.toLowerCase()];

				if (rateValue) {
					setRate(rateValue);
					setConvertedPrice((product.price * rateValue).toFixed(2));
				} else {
					setConvertedPrice(null);
				}
			} catch (err) {
				console.error("Currency fetch error:", err);
				setConvertedPrice(null);
			} finally {
				setLoading(false);
			}
		};

		fetchRate();
	}, [toCurrency, product.price]);

	const countryCode = countryList[toCurrency];

	return (
		<div
			
			className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
		>
			<div className="relative h-80 overflow-hidden bg-gray-100">
				<img
					onClick={() => navigate(`/product/${product._id}`)}
					src={getImageUrl()}
					alt={product.name}
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					onError={(e) => {
						e.target.onerror = null;
						e.target.src = `${imgBaseURL}/images/placeholder.jpg`;
					}}
				/>
			</div>

			<div className="p-5">
				<h3 className="text-lg font-semibold text-gray-800 mb-2">
					{product.name}
				</h3>
				<p className="text-xl font-bold text-teal-600 mb-3">
					NPR {product.price?.toLocaleString() ?? "—"}
				</p>

				<div className="mt-4 pt-4 border-t border-gray-200">
					<div className="flex items-center justify-between mb-2">
						<label className="block text-sm font-medium text-gray-700">
							Exchange Price
						</label>

						<div className="flex items-center gap-2">
							{countryCode && (
								<img
									src={`https://flagsapi.com/${countryCode}/flat/64.png`}
									alt={toCurrency}
									className="w-6 h-6 rounded-full object-cover"
									onError={(e) => {
										e.target.src = "https://flagsapi.com/XX/flat/64.png";
									}}
								/>
							)}

							<select
								value={toCurrency}
								onChange={(e) => setToCurrency(e.target.value)}
								className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
							>
								{Object.keys(countryList)
									.filter((code) => code !== "NPR")
									.map((code) => (
										<option key={code} value={code}>
											{code}
										</option>
									))}
							</select>
						</div>
					</div>

					<div className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800 font-medium text-center">
						{loading
							? "Fetching rate..."
							: convertedPrice !== null
							? ` ${convertedPrice} ${toCurrency}`
							: "~ ??"}
					</div>

					<p className="text-xs text-gray-500 mt-1 text-center">
						1 NPR ≈ {rate ? rate.toFixed(4) : "?"} {toCurrency}
					</p>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
