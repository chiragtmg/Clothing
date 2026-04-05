import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../Services/API";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(true);

	// Fetch cart from backend
	const fetchCart = async () => {
		try {
			setLoading(true);
			const res = await apiRequest.get("/cart");
			const items = res.data.cart || [];
			setCartItems(items);
		} catch (err) {
			console.error("Cart fetch error:", err);
			setCartItems([]);
		} finally {
			setLoading(false);
		}
	};

	// Initial fetch
	useEffect(() => {
		fetchCart();
	}, []);

	// Calculate total count
	const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

	const refreshCart = () => {
		fetchCart();
	};

	return (
		<CartContext.Provider
			value={{
				cartItems,
				cartCount,
				fetchCart,
				refreshCart,
				loading,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

// Custom hook
export const useCart = () => useContext(CartContext);
