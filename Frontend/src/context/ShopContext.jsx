// import React, { useState, createContext } from "react";

// export const ShopContext = createContext(); // can use anywhere

// const ShopContextProvider = (props) => {
// 	const backendUrl = import.meta.env.VITE_BACKEND_URL;
// 	const [token, setToken] = useState("");

// 	const value = {
// 		backendUrl,
// 		setToken,
// 		token,
// 	};

// 	return (
// 		// using children to wrap entire app or components with the context
// 		<ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
// 	);
// };

// export default ShopContextProvider;
