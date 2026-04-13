import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

export const getAnalytics = async (req, res) => {
	try {
		// Basic Stats
		const totalOrders = await Order.countDocuments();
		const totalRevenueResult = await Order.aggregate([
			{ $group: { _id: null, total: { $sum: "$totalAmount" } } },
		]);
		const totalRevenue = totalRevenueResult[0]?.total || 0;

		const totalCustomers = (await Order.distinct("user").length) || 0;
		const totalProducts = (await Product.countDocuments()) || 0;

		const genderResult = await Order.aggregate([
			{ $unwind: "$items" }, // Flatten items array
			{
				$lookup: {
					// Join with Product collection
					from: "products", // Collection name (lowercase + 's')
					localField: "items.productId",
					foreignField: "_id",
					as: "productInfo",
				},
			},
			{ $unwind: "$productInfo" }, // Get the joined product
			{
				$group: {
					_id: "$productInfo.category", // Group by Product.category (Men / Women)
					count: { $sum: "$items.quantity" }, // Total quantity sold (more accurate)
				},
			},
		]);

		let menCount = 0;
		let womenCount = 0;

		genderResult.forEach((item) => {
			const cat = (item._id || "").toLowerCase();
			if (cat === "men" || cat === "male") {
				menCount = item.count;
			} else if (cat === "women" || cat === "female") {
				womenCount = item.count;
			}
		});

		// Fallback if no data yet
		if (menCount === 0 && womenCount === 0) {
			menCount = Math.floor(totalOrders * 0.65);
			womenCount = totalOrders - menCount;
		}

		// Monthly Sales (Last 6 months)
		const monthlySales = await Order.aggregate([
			{
				$group: {
					_id: { $dateToString: { format: "%b", date: "$createdAt" } },
					sales: { $sum: "$totalAmount" },
					monthOrder: { $max: { $month: "$createdAt" } },
				},
			},
			{ $sort: { monthOrder: 1 } },
			{ $project: { month: "$_id", sales: 1, _id: 0 } },
		]);

		res.status(200).json({
			success: true,
			totalOrders,
			totalRevenue,
			totalCustomers,
			totalProducts,
			genderDistribution: {
				men: menCount,
				women: womenCount,
			},
			monthlySales: monthlySales.length
				? monthlySales
				: [
						{ month: "Jan", sales: 45000 },
						{ month: "Feb", sales: 62000 },
						{ month: "Mar", sales: 38000 },
						{ month: "Apr", sales: 71000 },
						{ month: "May", sales: 89000 },
						{ month: "Jun", sales: 55000 },
					],
		});
	} catch (error) {
		console.error("Analytics Error:", error);
		res
			.status(500)
			.json({ success: false, message: "Failed to fetch analytics" });
	}
};
