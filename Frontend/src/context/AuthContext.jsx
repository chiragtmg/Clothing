import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../Services/API";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthContextProvider");
  }
  return context;
};

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log("🔄 Loaded user from localStorage:", user);   
        setCurrentUser(user);
      } catch (e) {
        console.error("Failed to parse user from localStorage");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const updateUser = (data) => {
    console.log("💾 updateUser called with:", data);   

    if (!data) return;

    const userData = {
      _id: data._id,
      username: data.username,
      email: data.email,
      avatar: data.avatar,
      role: data.role || "customer",        
    };

    console.log("✅ Saving to localStorage with role:", userData.role);

    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await apiRequest.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        updateUser,
        logout,
        loading,
        isLoggedIn: !!currentUser,
        isAdmin: currentUser?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};