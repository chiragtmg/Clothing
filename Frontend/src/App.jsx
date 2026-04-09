import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Collection from "./Pages/Collection";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import Login from "./Pages/Login";
import Navbar from "./Components/Navbar";
import { ToastContainer } from "react-toastify";
import EditProfile from "./Pages/EditProfile";
import SignUp from "./Pages/SignUp";
import Footer from "./Components/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Dashboard from "./Pages/Dashboard";
import AddItems from "./Pages/AddItems";
import ListItems from "./Pages/ListItems";
import EditProduct from "./Pages/EditProduct";
import Search from "./Pages/Search";
import Checkout from "./Pages/Checkout";
import MyOrders from "./Pages/MyOrders";
import PaymentSuccess from "./Pages/PaymentSuccess";
import KhaltiSuccess from "./Pages/KhaltiSuccess";
import AdminOrders from "./Pages/AdminOrders";

const App = () => {
	const GoogleAuthWrapper = () => {
		return (
			<GoogleOAuthProvider clientId="845839277034-358drmar18k7deaes6i96glon4bfn6pr.apps.googleusercontent.com">
				<Login></Login>
			</GoogleOAuthProvider>
		);
	};

	return (
		<div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
			<ToastContainer />
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/collection" element={<Collection />} />
				<Route path="/about" element={<About />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/product/:id" element={<Product />} />
				<Route path="/cart" element={<Cart />} />
				<Route path="/checkout" element={<Checkout />} />
				<Route path="/login" element={<GoogleAuthWrapper />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/myorders" element={<MyOrders />} />
				<Route path="/payment/success" element={<PaymentSuccess />} />
				<Route path="/khalti-success" element={<KhaltiSuccess />} />
				<Route path="/editProfile" element={<EditProfile />} />
				<Route path="*" element={<Home />} />
				<Route path="/search" element={<Search />} />

				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/addItem" element={<AddItems />} />
				<Route path="/listItem" element={<ListItems />} />
				<Route path="/editProduct/:id" element={<EditProduct />} />
				<Route path="/adminorders" element={<AdminOrders />} />
			</Routes>

			<Footer />
		</div>
	);
};

export default App;
