import { useEffect, useState } from "react";
import { apiRequest, imgBaseURL } from "../Services/API";
import { toast } from "react-toastify";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiRequest.get("/order/myorders");
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getImage = (item) => {
    if (!item) return "/placeholder-product.jpg";
    if (item.images?.length > 0) return `${imgBaseURL}${item.images[0]}`;
    if (item.image) return `${imgBaseURL}${item.image}`;
    return "/placeholder-product.jpg";
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading your orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">MY ORDERS</h1>

        {orders.length === 0 ? (
          <p className="text-center text-2xl text-gray-600 py-20">No orders found yet</p>
        ) : (
          <div className="space-y-10">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow p-8">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-semibold text-lg">{order.status}</p>
                    <p className="text-sm text-gray-500">Payment: {order.paymentMethod.toUpperCase()}</p>
                  </div>
                </div>

                {/* Show All Items in this Order */}
                <div className="space-y-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-6 items-center border-b last:border-b-0 pb-6 last:pb-0">
                      <img
                        src={getImage(item)}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl"
                        onError={(e) => (e.target.src = "/placeholder-product.jpg")}
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-gray-600">
                          NPR {item.price} × {item.quantity} = <span className="font-medium">NPR {item.price * item.quantity}</span>
                        </p>
                        {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">NPR {item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="flex justify-between items-center mt-6 pt-6 border-t">
                  <span className="text-xl font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold">NPR {order.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;