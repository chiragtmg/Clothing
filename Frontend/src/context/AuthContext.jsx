import { createContext } from "react";
import { useEffect, useState } from "react";
import { apiRequest } from "../Services/API";

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
	//to get the current user from local storage
	const [currentUser, setCurrentUser] = useState(
		JSON.parse(localStorage.getItem("user")) || null,
	);

	// to update the user
	const updateUser = (data) => {
		setCurrentUser(data);
	};
	 

	// logout for removing token also
	const logout = async () => {
		try {
			await apiRequest.post("/auth/logout", {});
		} catch (error) {
			console.error("error while logging out", error);
		} finally {
			setCurrentUser(null);
			localStorage.removeItem("user");
		}
	};

	useEffect(() => {
		localStorage.setItem("user", JSON.stringify(currentUser));
	}, [currentUser]);

	return (
		<AuthContext.Provider value={{ currentUser, updateUser, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
