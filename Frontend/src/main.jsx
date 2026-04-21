import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import { AuthContextProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<AuthContextProvider>
			<BrowserRouter>
				<CartProvider>
					<App />
				</CartProvider>
			</BrowserRouter>
		</AuthContextProvider>
	</StrictMode>,
);
