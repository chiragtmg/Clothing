import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Collection from "./Pages/Collection";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import Login from "./Pages/Login";
import { ToastContainer } from "react-toastify";
import EditProfile from "./Pages/EditProfile";
import SignUp from "./Pages/SignUp";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AddItems from "./Pages/AddItems";
import ListItems from "./Pages/ListItems";
import EditProduct from "./Pages/EditProduct";
import Search from "./Pages/Search";
import Checkout from "./Pages/Checkout";
import MyOrders from "./Pages/MyOrders";
import PaymentSuccess from "./Pages/PaymentSuccess";
import KhaltiSuccess from "./Pages/KhaltiSuccess";
import AdminOrders from "./Pages/AdminOrders";
import AdminDashboard from "./Pages/AdminDashboard";
import MainLayout from "./Components/MainLayout";
import AdminLayout from "./Components/AdminLayout";

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

			<Routes>
				<Route element={<MainLayout />}>
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
					<Route path="/search" element={<Search />} />
				</Route>
				<Route element={<AdminLayout />}>
					<Route path="/admindashboard" element={<AdminDashboard />} />
					<Route path="/addItem" element={<AddItems />} />
					<Route path="/listItem" element={<ListItems />} />
					<Route path="/editProduct/:id" element={<EditProduct />} />
					<Route path="/adminorders" element={<AdminOrders />} />
				</Route>
			</Routes>
		</div>
	);
};

export default App;
