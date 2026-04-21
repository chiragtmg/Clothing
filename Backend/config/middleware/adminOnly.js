import User from "../../models/userModel.js"; // Make sure path is correct
import { verifyToken } from "./verifyToken.js";

export const verifyTokenAndAdmin = async (req, res, next) => {
	verifyToken(req, res, async () => {
		try {
			const user = await User.findById(req.userId).select("role");

			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			if (user.role !== "admin") {
				return res.status(403).json({
					message: "Access denied. Admin only.",
				});
			}

			req.userRole = "admin"; 
			next();
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Internal server error" });
		}
	});
};
