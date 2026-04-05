import User from "../models/userModel.js";

export const updateUser = async (req, res) => {
	try {
		const { id } = req.params; // to get data from id
		const { username, email, avatar } = req.body;

		// Check if user exists
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check for duplicate username or email (excluding current user)
		const existingUser = await User.findOne({
			$and: [
				{ _id: { $ne: id } }, // Exclude current user
				{ $or: [{ email }, { username }] },
			],
		});

		if (existingUser) {
			if (existingUser.email === email) {
				return res.status(400).json({ message: "Email already exists" });
			}
			if (existingUser.username === username) {
				return res.status(400).json({ message: "Username already exists" });
			}
		}

		// Update user
		const updatedUser = await User.findByIdAndUpdate(
			id,
			{
				username,
				email,
				avatar,
			},
			{
				new: true, // Return the updated document
				runValidators: true, // Run schema validators
			},
		).select("-password"); // Exclude password from the response

		res.status(200).json({
			message: "User updated successfully",
			data: updatedUser,
		});
	} catch (error) {
		console.error("Error updating user:", error);

		if (error.name === "ValidationError") {
			const errors = Object.values(error.errors).map((err) => err.message);
			return res.status(400).json({ message: "Validation error", errors });
		}

		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		res.status(500).json({ message: "Internal server error" });
	}
};
