const Footer = () => {
	return (
		<footer className="bg-gradient-to-r from-teal-700 to-teal-900 text-white">
			<div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
					{/* Brand / Logo Area */}
					<div>
						<h2 className="text-3xl font-bold mb-4">Clothing</h2>
						<p className="text-teal-100 mb-6">
							Your trusted online clothing store in Nepal. Quality fashion at
							affordable prices.
						</p>
						<p className="text-sm text-teal-200">
							© {new Date().getFullYear()} Clothing Nepal. All rights reserved.
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-xl font-semibold mb-6">Quick Links</h3>
						<ul className="space-y-3">
							<li>
								<a href="/" className="hover:text-teal-300 transition-colors">
									Home
								</a>
							</li>
							<li>
								<a
									href="/collection"
									className="hover:text-teal-300 transition-colors"
								>
									Collection
								</a>
							</li>
							<li>
								<a
									href="/about"
									className="hover:text-teal-300 transition-colors"
								>
									About
								</a>
							</li>
							<li>
								<a
									href="/contact"
									className="hover:text-teal-300 transition-colors"
								>
									Contact
								</a>
							</li>
							<li>
								<a
									href="/delivery"
									className="hover:text-teal-300 transition-colors"
								>
									Delivery Info
								</a>
							</li>
						</ul>
					</div>

					{/* Get In Touch */}
					<div>
						<h3 className="text-xl font-semibold mb-6">Get In Touch</h3>
						<ul className="space-y-4">
							<li className="flex items-center">
								<span className="mr-3">📞</span>
								<span>+977 98000000000</span>
							</li>
							<li className="flex items-center">
								<span className="mr-3">✉️</span>
								<span>company@gmail.com</span>
							</li>
							<li className="flex items-start">
								<span className="mr-3 mt-1">📍</span>
								<span>Kathmandu, Bagmati Province, Nepal</span>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-teal-600 mt-12 pt-8 text-center text-teal-200 text-sm">
					<p>Fast Delivery Across Nepal • Secure Payment • Easy Returns</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
