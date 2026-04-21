import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getImageUrl } from "../utils/getImageUrl";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);
  const avatarUrl = getImageUrl(currentUser?.avatar);

  const [showDropdown, setShowDropdown] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200 min-h-screen shadow-sm">
      
      <div className="p-6 border-b border-gray-200 flex items-center gap-3 relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 focus:outline-none w-full"
        >
          {currentUser?.avatar ? (
            <img
              src={avatarUrl}
              className="w-10 h-10 rounded-full object-cover border"
              alt="Profile"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">
              {currentUser?.username || "Admin"}
            </p>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </button>

        {showDropdown && (
          <div className="absolute top-16 left-6 w-48 bg-white shadow-lg rounded-lg border border-gray-200 py-2 z-50">
            <Link
              to="/editProfile"
              className="block px-4 py-2 text-sm hover:bg-gray-50"
              onClick={() => setShowDropdown(false)}
            >
              My Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">

        <Link
          to="/admindashboard"
          className={`block px-4 py-3 rounded-lg font-medium transition ${
            isActive("/admindashboard")
              ? "bg-indigo-600 text-white shadow"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/addItem"
          className={`block px-4 py-3 rounded-lg font-medium transition ${
            isActive("/addItem")
              ? "bg-indigo-600 text-white shadow"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Add Items
        </Link>

        <Link
          to="/listItem"
          className={`block px-4 py-3 rounded-lg font-medium transition ${
            isActive("/listItem")
              ? "bg-indigo-600 text-white shadow"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          List Items
        </Link>

        <Link
          to="/adminorders"
          className={`block px-4 py-3 rounded-lg font-medium transition ${
            isActive("/adminorders")   // ✅ FIXED HERE
              ? "bg-indigo-600 text-white shadow"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Orders
        </Link>

      </nav>

      <div className="p-4 text-xs text-gray-400 border-t">
        © 2026 Clothing Admin
      </div>
    </aside>
  );
};

export default Sidebar;