import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiRequest } from "../Services/API";
import { AuthContext } from "./AuthContext";   // Import AuthContext

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(false);

	const { isLoggedIn } = useContext(AuthContext);     

	const fetchCart = useCallback(async () => {
		if (!isLoggedIn) {
			setCartItems([]);
			return;
		}

		try {
			setLoading(true);
			const res = await apiRequest.get("/cart");
			setCartItems(res.data.cart || res.data.items || []);
		} catch (err) {
			if (err.response?.status === 401) {
				setCartItems([]);
				return;
			}
			console.error("Cart fetch error:", err);
			setCartItems([]);
		} finally {
			setLoading(false);
		}
	}, [isLoggedIn]);

	useEffect(() => {
		fetchCart();
	}, [fetchCart]);

	const cartCount = cartItems.reduce((acc, item) => acc + (item?.quantity || 0), 0);

	const refreshCart = useCallback(() => {
		fetchCart();
	}, [fetchCart]);

	return (
		<CartContext.Provider
			value={{
				cartItems,
				cartCount,
				loading,
				refreshCart,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => useContext(CartContext);