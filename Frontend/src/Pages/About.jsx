import React from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
	const navigate = useNavigate();
	return (
		<div className="bg-gray-50 text-gray-800">
			{/* Hero Section */}
			<div className="bg-gray-900 text-white py-16 text-center">
				<h1 className="text-4xl md:text-5xl font-bold mb-4">
					Ashishit Clothing
				</h1>
				<p className="text-gray-300 max-w-2xl mx-auto">
					Redefining fashion from Pokhara, Nepal with style, comfort, and
					confidence.
				</p>
			</div>

			{/* About Intro */}
			<div className="px-6 md:px-16 lg:px-24 py-12">
				<div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-4xl mx-auto">
					<h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
					<p className="text-gray-600 leading-relaxed">
						Ashishit Clothing is a modern fashion brand based in Pokhara, Nepal.
						We blend local creativity with global trends to create stylish,
						comfortable, and affordable clothing for everyone.
					</p>
				</div>
			</div>

			{/* Mission & Vision Cards */}
			<div className="px-6 md:px-16 lg:px-24 pb-12 grid md:grid-cols-2 gap-8">
				<div className="bg-white shadow-md hover:shadow-xl transition duration-300 rounded-2xl p-6">
					<h3 className="text-xl font-semibold mb-3">Our Mission</h3>
					<p className="text-gray-600">
						To deliver high-quality fashion that is accessible to everyone while
						ensuring comfort, durability, and modern style in every piece.
					</p>
				</div>

				<div className="bg-white shadow-md hover:shadow-xl transition duration-300 rounded-2xl p-6">
					<h3 className="text-xl font-semibold mb-3">Our Vision</h3>
					<p className="text-gray-600">
						To grow as a leading Nepali clothing brand and represent Nepal in
						the global fashion industry with authenticity and creativity.
					</p>
				</div>
			</div>

			{/* Features / Why Choose Us */}
			<div className="bg-white py-12 px-6 md:px-16 lg:px-24">
				<h2 className="text-2xl font-semibold text-center mb-10">
					Why Choose Us
				</h2>

				<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
					<div className="border rounded-xl p-6 text-center hover:bg-gray-100 transition">
						<h4 className="font-semibold mb-2">Trendy Designs</h4>
						<p className="text-gray-600 text-sm">
							Inspired by global fashion trends and local culture.
						</p>
					</div>

					<div className="border rounded-xl p-6 text-center hover:bg-gray-100 transition">
						<h4 className="font-semibold mb-2">Premium Quality</h4>
						<p className="text-gray-600 text-sm">
							Carefully selected fabrics for comfort and durability.
						</p>
					</div>

					<div className="border rounded-xl p-6 text-center hover:bg-gray-100 transition">
						<h4 className="font-semibold mb-2">Affordable Price</h4>
						<p className="text-gray-600 text-sm">
							Stylish clothing without breaking your budget.
						</p>
					</div>

					<div className="border rounded-xl p-6 text-center hover:bg-gray-100 transition">
						<h4 className="font-semibold mb-2">Customer First</h4>
						<p className="text-gray-600 text-sm">
							We prioritize customer satisfaction above everything.
						</p>
					</div>

					<div className="border rounded-xl p-6 text-center hover:bg-gray-100 transition">
						<h4 className="font-semibold mb-2">Local Brand</h4>
						<p className="text-gray-600 text-sm">
							Proudly representing Pokhara and Nepali creativity.
						</p>
					</div>

					<div className="border rounded-xl p-6 text-center hover:bg-gray-100 transition">
						<h4 className="font-semibold mb-2">Fast Delivery</h4>
						<p className="text-gray-600 text-sm">
							Reliable and quick delivery across Nepal.
						</p>
					</div>
				</div>
			</div>

			{/* Call to Action */}
			<div className="bg-gray-900 text-white text-center py-12 px-6">
				<h2 className="text-2xl font-semibold mb-4">Join Our Journey</h2>
				<p className="text-gray-300 mb-6">
					Be a part of Ashishit Clothing and express your unique style.
				</p>
				<button
					className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition"
					onClick={() => navigate("/collection")}
				>
					Explore Collection
				</button>
			</div>
		</div>
	);
};

export default About;
