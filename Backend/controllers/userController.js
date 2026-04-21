import User from "../models/userModel.js";

export const updateUser = async (req, res) => {
	try {
		const { id } = req.params;

		const username = req.body?.username;
		const email = req.body?.email;

		let avatar = req.body?.avatar;

		if (req.file) {
			avatar = `/images/${req.file.filename}`;
		}

		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const existingUser = await User.findOne({
			$and: [
				{ _id: { $ne: id } },
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

		const updatedUser = await User.findByIdAndUpdate(
			id,
			{
				username,
				email,
				avatar,
			},
			{ new: true, runValidators: true }
		).select("-password");

		res.status(200).json({
			message: "User updated successfully",
			data: updatedUser,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};