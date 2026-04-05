const HeroBanner = () => {
	return (
		<section className="relative">
			<div className="grid grid-cols-1 md:grid-cols-2 h-[500px] md:h-[600px]">
				{/* Left part - Man with hat and headphones */}
				<div className="relative bg-blue-500 overflow-hidden">
					<img
						src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
						alt="Man with hat and headphones"
						className="w-full h-full object-cover brightness-90"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end pb-12 px-8 md:px-16">
						<div className="text-white">
							<h2 className="text-3xl md:text-5xl font-bold">Best Seller</h2>
							<p className="text-xl md:text-3xl mt-2">Latest Arrivals</p>
						</div>
					</div>
				</div>

				{/* Right part - Clothes on hanger */}
				<div className="relative bg-gradient-to-br from-amber-50 to-amber-100 overflow-hidden">
					<img
						src="https://images.unsplash.com/photo-1604176354204-926873e2e2e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
						alt="Clothes on rack"
						className="w-full h-full object-cover brightness-95"
					/>
					<div className="absolute inset-0 flex items-center justify-center bg-black/10">
						<div className="text-center px-6">
							<h3 className="text-4xl md:text-6xl font-bold text-gray-800 drop-shadow-lg">
								New Season
							</h3>
							<p className="text-xl md:text-2xl text-gray-700 mt-4 drop-shadow">
								Discover Latest Collections
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroBanner;
