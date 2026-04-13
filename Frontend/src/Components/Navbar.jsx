import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AuthContext } from "../context/AuthContext";
import { CartContext, useCart } from "../context/CartContext";
import { getImageUrl } from "../utils/getImageUrl";

const Navbar = () => {
	const { currentUser, logout } = useContext(AuthContext);
	const navigate = useNavigate();
	const location = useLocation();
	const [showProfileDropdown, setShowProfileDropdown] = useState(false);
	const avatarUrl = getImageUrl(currentUser?.avatar);

	const { cartCount, refreshCart } = useCart();
	const isActive = (path) => location.pathname === path;

	const handleLogOut = () => {
		logout();
		navigate("/");
		setShowProfileDropdown(false);
	};

	return (
		<div className="flex items-center justify-between py-6 font-medium border-b border-gray-200">
			<Link to="/">
				<img src={assets.logo} className="w-36" alt="Logo" />
			</Link>

			<ul className="hidden sm:flex gap-8 text-sm text-gray-700">
				<li>
					<Link
						to="/"
						className="flex flex-col items-center gap-1 hover:text-black transition relative"
					>
						HOME
						<hr
							className={`w-2/4 border-none h-[1.5px] bg-gray-700 absolute bottom-[-6px] transition-all duration-300 ${
								isActive("/")
									? "opacity-100 scale-x-100"
									: "opacity-0 scale-x-0 hover:opacity-75 hover:scale-x-100"
							}`}
						/>
					</Link>
				</li>
				<li>
					<Link
						to="/collection"
						className="flex flex-col items-center gap-1 hover:text-black transition relative"
					>
						COLLECTION
						<hr
							className={`w-2/4 border-none h-[1.5px] bg-gray-700 absolute bottom-[-6px] transition-all duration-300 ${
								isActive("/collection")
									? "opacity-100 scale-x-100"
									: "opacity-0 scale-x-0 hover:opacity-75 hover:scale-x-100"
							}`}
						/>
					</Link>
				</li>
				<li>
					<Link
						to="/about"
						className="flex flex-col items-center gap-1 hover:text-black transition relative"
					>
						ABOUT
						<hr
							className={`w-2/4 border-none h-[1.5px] bg-gray-700 absolute bottom-[-6px] transition-all duration-300 ${
								isActive("/about")
									? "opacity-100 scale-x-100"
									: "opacity-0 scale-x-0 hover:opacity-75 hover:scale-x-100"
							}`}
						/>
					</Link>
				</li>
				<li>
					<Link
						to="/contact"
						className="flex flex-col items-center gap-1 hover:text-black transition relative"
					>
						CONTACT
						<hr
							className={`w-2/4 border-none h-[1.5px] bg-gray-700 absolute bottom-[-6px] transition-all duration-300 ${
								isActive("/contact")
									? "opacity-100 scale-x-100"
									: "opacity-0 scale-x-0 hover:opacity-75 hover:scale-x-100"
							}`}
						/>
					</Link>
				</li>
			</ul>

			{/* Right side icons */}
			<div className="flex items-center gap-8 sm:gap-10">
				{/* Search – always visible */}
				<Link to="/search" className="relative group">
					<img
						src={assets.search_icon}
						className="w-11 h-11 cursor-pointer"
						alt="Search"
					/>
					<span className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2.5 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
						Search
					</span>
				</Link>

				{currentUser ? (
					<div className="relative">
						<button
							onClick={() => setShowProfileDropdown(!showProfileDropdown)}
							className="focus:outline-none"
						>
							{currentUser?.avatar ? (
								<img
									src={avatarUrl}
									className="w-9 h-9 rounded-full object-cover cursor-pointer border"
									alt="Profile"
								/>
							) : (
								<div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
									{currentUser?.username?.charAt(0).toUpperCase()}
								</div>
							)}
						</button>

						{showProfileDropdown && (
							<div className="absolute right-0 mt-4 w-52 bg-white shadow-xl rounded-lg border border-gray-200 py-2 z-50">
								<Link
									to="/editProfile"
									className="block px-5 py-3 text-sm text-gray-800 hover:bg-gray-50"
									onClick={() => setShowProfileDropdown(false)}
								>
									My Profile
								</Link>
								<Link
									to="/myorders"
									className="block px-5 py-3 text-sm text-gray-800 hover:bg-gray-50"
									onClick={() => setShowProfileDropdown(false)}
								>
									Orders
								</Link>
								<hr className="my-1 border-gray-200" />
								<button
									className="block w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-gray-50"
									onClick={handleLogOut}
								>
									Logout
								</button>
							</div>
						)}
					</div>
				) : (
					<Link
						to="/login"
						className="px-7 py-3 text-sm border border-gray-600 rounded-full hover:bg-black hover:text-white transition-colors"
					>
						Log in
					</Link>
				)}

				{/* Cart – only visible when logged in */}
				{currentUser && (
					<Link to="/cart" className="relative group" onClick={refreshCart}>
						<img
							src={assets.cart}
							className="w-9 h-9 cursor-pointer"
							alt="Cart"
						/>
						{cartCount > 0 && (
							<span className="absolute -top-3 -right-3 bg-red-600 text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center border-2 border-white shadow-sm">
								{cartCount}
							</span>
						)}
						<span className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2.5 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
							Cart
						</span>
					</Link>
				)}

				{/* Mobile menu button (optional – you can hide/show based on currentUser too if desired) */}
				<button className="sm:hidden">
					<img src={assets.menu_icon} className="w-8 h-8" alt="Menu" />
				</button>
			</div>
		</div>
	);
};

export default Navbar;
