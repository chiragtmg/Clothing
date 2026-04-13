import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { apiRequest, googleAuth } from "../Services/API";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const { updateUser, currentUser } = useContext(AuthContext);

	useEffect(() => {
	if (currentUser) {
		if (currentUser.role === "admin") {
			navigate("/admindashboard");
		} else {
			navigate("/");
		}
	}
}, [currentUser]);

	const responseGoogle = async (authResult) => {
		setIsLoading(true);
		try {
			if (!authResult.code) {
				throw new Error("Google authentication failed");
			}

			const result = await googleAuth(authResult.code);

			console.log("🔍 Google Response from Backend:", result.data); // ← Debug

			// FIXED: Include role properly
			const userObj = {
				_id: result.data._id,
				username: result.data.username,
				email: result.data.email,
				avatar: result.data.avatar,
				role: result.data.role || "customer", // ← This was missing
			};

			console.log("✅ Saving user with role:", userObj.role);

			updateUser(userObj);
			toast.success("Login successfully");

			// Redirect based on role
			if (userObj.role === "admin") {
				navigate("/admin/orders"); // or "/dashboard" if you prefer
			} else {
				navigate("/");
			}
		} catch (e) {
			console.error("Error while Google Login...", e);
			toast.error("Google login failed");
		} finally {
			setIsLoading(false);
		}
	};

	const googleLogin = useGoogleLogin({
		onSuccess: responseGoogle,
		onError: responseGoogle,
		flow: "auth-code",
	});

	const onSubmitHandler = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const response = await apiRequest.post(
				"/auth/login",
				{ email, password },
				{ withCredentials: true }, // IMPORTANT
			);

			
			toast.success("Login successfully");
			const user = response.data.user || response.data;
			updateUser(response.data);
			if (user.role === "admin") {
				navigate("/admindashboard");
			} else {
				navigate("/");
			}
		} catch (error) {
			console.log(error);
			setError("Invalid credentials");
			toast.error("Login failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-white flex items-center justify-center px-6 -mt-20">
			<div className="w-full max-w-md bg-gradient-to-b from-gray-200 to-gray-400 rounded-3xl shadow-2xl p-10">
				<h2 className="text-4xl font-bold text-center mb-10 underline decoration-gray-600">
					Login
				</h2>

				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
						{error}
					</div>
				)}

				<form onSubmit={onSubmitHandler} className="space-y-8">
					<input
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						type="email"
						placeholder="Email"
						className="w-full px-6 py-4 bg-white rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
						required
					/>

					<input
						onChange={(e) => setPassword(e.target.value)}
						value={password}
						type="password"
						placeholder="Password"
						className="w-full px-6 py-4 bg-white rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
						required
					/>

					<div className="flex justify-between text-sm text-gray-700">
						<Link to="" className="hover:underline">
							Forgot your password?
						</Link>

						<Link to="/signup" className="hover:underline">
							Create account
						</Link>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xl py-4 rounded-full shadow-lg transition"
					>
						{isLoading ? "Logging In..." : "Sign in"}
					</button>
				</form>

				<button
					onClick={googleLogin}
					disabled={isLoading}
					className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold text-xl py-4 rounded-full shadow-lg transition"
				>
					{isLoading ? "Logging In..." : "Login with Google"}
				</button>
			</div>
		</div>
	);
};

export default Login;
