import React, { useState } from "react";

const Login = () => {
	const [isLogin, setIsLogin] = useState("true");

	return (
		<>
			<div className="min-h-screen bg-linear-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center px-4">
				<div className="max-w-md w-full">
					{/* Card Container */}
					<div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
						{/* Header */}
						<div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 px-10 text-center">
							<h1 className="text-4xl font-bold mb-2">
								{isLogin ? "Welcome Back!" : "Join Us!"}
							</h1>
							<p className="text-purple-100">
								{isLogin
									? "Login to continue your journey"
									: "Create an account to get started"}
							</p>
						</div>

						{/* Form Container */}
						<div className="p-8">
							<form className="space-y-6">
								{!isLogin && (
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Full Name
										</label>
										<input
											type="text"
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
											placeholder="Selm*** Kh***"
										/>
									</div>
								)}

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Email Address
									</label>
									<input
										type="email"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
										placeholder="you@example.com"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Password
									</label>
									<input
										type="password"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
										placeholder="••••••••"
									/>
								</div>

								{isLogin && (
									<div className="flex items-center justify-between">
										<label className="flex items-center text-sm">
											<input
												type="checkbox"
												className="mr-2 rounded text-purple-600"
											/>
											<span className="text-gray-600">Remember me</span>
										</label>
										<a
											href="#"
											className="text-sm text-purple-600 hover:underline"
										>
											Forgot password?
										</a>
									</div>
								)}

								<button
									type="submit"
									className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition duration-200 shadow-lg"
								>
									{isLogin ? "Sign In" : "Create Account"}
								</button>
							</form>

							{/* Toggle Link */}
							<div className="mt-8 text-center">
								<p className="text-gray-600">
									{isLogin
										? "Don't have an account?"
										: "Already have an account?"}
									<button
										onClick={() => setIsLogin(!isLogin)}
										className="ml-2 text-purple-600 font-semibold hover:underline focus:outline-none"
									>
										{isLogin ? "Sign up" : "Log in"}
									</button>
								</p>
							</div>

							{/* Social Login Divider */}
							{isLogin && (
								<div className="mt-8">
									<div className="relative">
										<div className="absolute inset-0 flex items-center">
											<div className="w-full border-t border-gray-300"></div>
										</div>
										<div className="relative flex justify-center text-sm">
											<span className="px-4 bg-white text-gray-500">
												Or continue with
											</span>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
