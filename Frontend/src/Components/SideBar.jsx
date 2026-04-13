import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden md:flex md:flex-col bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Clothing</h2>
      </div>
      <nav className="flex-1 px-3 py-6 flex flex-col space-y-1">
        <Link
          to="/admindashboard"
          className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive("/admindashboard")
              ? "bg-indigo-600 text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          Admin Dashboard
        </Link>
        <Link
          to="/addItem"
          className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive("/addItem")
              ? "bg-indigo-600 text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          Add items
        </Link>

        <Link
          to="/listItem"
          className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive("/listItem")
              ? "bg-indigo-600 text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          List items
        </Link>

        <Link
          to="/adminorders"
          className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive("/order")
              ? "bg-indigo-600 text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          Orders
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;