import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

export const createOrder = async (req, res) => {
  try {
    const { items, shippingDetails, paymentMethod, totalAmount } = req.body;
    const userId = req.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    // Stock Deduction with better matching
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `Product not found: ${item.name}` 
        });
      }

      // Improved size matching logic
      let variant = null;

      // 1. Try exact size match
      if (item.size) {
        variant = product.variants.find(v => v.size === item.size);
      }

      // 2. Try "One Size" as fallback
      if (!variant) {
        variant = product.variants.find(v => v.size === "One Size");
      }

      // 3. If still not found, take the first available variant (last resort)
      if (!variant && product.variants.length > 0) {
        variant = product.variants[0];
      }

      if (!variant) {
        return res.status(400).json({
          success: false,
          message: `No size available for ${item.name}`,
        });
      }

      // Check stock
      if (variant.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${item.name} (${variant.size}) - Available: ${variant.stock}`,
        });
      }

      // Deduct stock
      variant.stock -= item.quantity;
      await product.save();
    }

    // Create Order
    const newOrder = await Order.create({
      user: userId,
      items,
      shippingDetails,
      paymentMethod,
      totalAmount,
    });

    // Clear Cart
    await User.findByIdAndUpdate(userId, { cartData: {} });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to place order" 
    });
  }
};

// Get My Orders
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};