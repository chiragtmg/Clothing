import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../Services/API";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

// This page is where Khalti sends the user back after payment
// URL will look like: /khalti-success?pidx=ABC123&status=Completed

const KhaltiSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshCart } = useCart();
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      const pidx = searchParams.get("pidx");
      const status = searchParams.get("status");

      if (!pidx || status !== "Completed") {
        setMessage("Payment was cancelled or failed.");
        setTimeout(() => navigate("/checkout"), 2000);
        return;
      }

      // Get saved cart and shipping details from localStorage
      // (we stored them before redirecting to Khalti)
      const cartItems = JSON.parse(localStorage.getItem("khalti_cart") || "[]");
      const shippingDetails = JSON.parse(localStorage.getItem("khalti_shipping") || "{}");
      const totalAmount = localStorage.getItem("khalti_total");

      try {
        const res = await apiRequest.post("/khalti/verify", {
          pidx,
          cartItems,
          shippingDetails,
          totalAmount: Number(totalAmount),
        });

        if (res.data.success) {
          // Clean up localStorage
          localStorage.removeItem("khalti_cart");
          localStorage.removeItem("khalti_shipping");
          localStorage.removeItem("khalti_total");

          // Clear cart
          await apiRequest.delete("/cart/clear");
          refreshCart();

          setMessage("Payment successful! Order placed 🎉");
          toast.success("Order placed successfully!");
          setTimeout(() => navigate("/myorders"), 2000);
        }
      } catch (err) {
        setMessage("Payment verification failed. Contact support.");
        toast.error("Verification failed");
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
        <p className="text-2xl font-semibold text-gray-800">{message}</p>
      </div>
    </div>
  );
};

export default KhaltiSuccess;