import { createContext, useEffect, useState } from "react";
import { apiRequest } from "../Services/API";

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(
		JSON.parse(localStorage.getItem("user")) || null
	);

	const [loading, setLoading] = useState(true);

	// Update user and save to localStorage
	const updateUser = (data) => {
		setCurrentUser(data);
		localStorage.setItem("user", JSON.stringify(data));
	};

	const logout = async () => {
		try {
			await apiRequest.post("/auth/logout");
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setCurrentUser(null);
			localStorage.removeItem("user");
		}
	};

	// Check if user is logged in on app start
	// useEffect(() => {
	// 	const checkAuth = async () => {
	// 		try {
	// 			if (currentUser) {
	// 				// Optional: Verify token with backend if needed
	// 				await apiRequest.get("/auth/me");   // You can create this endpoint later
	// 			}
	// 		} catch (err) {
	// 			// Token invalid or expired
	// 			setCurrentUser(null);
	// 			localStorage.removeItem("user");
	// 		} finally {
	// 			setLoading(false);
	// 		}
	// 	};

	// 	checkAuth();
	// }, []);
	useEffect(() => {
		localStorage.setItem("user", JSON.stringify(currentUser));
	}, [currentUser]);

	return (
		<AuthContext.Provider
			value={{
				currentUser,
				updateUser,
				logout,
				loading,
				isLoggedIn: !!currentUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};