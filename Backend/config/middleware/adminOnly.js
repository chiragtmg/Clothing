import User from "../../models/userModel.js"; // Make sure path is correct
import { verifyToken } from "./verifyToken.js";

export const verifyTokenAndAdmin = async (req, res, next) => {
	// First verify the token using your existing function
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

			// If user is admin, proceed
			req.userRole = "admin"; // Optional: attach role for future use
			next();
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Internal server error" });
		}
	});
};
