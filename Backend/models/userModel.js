import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String },
		avatar: { type: String, default: "" },
		role: { type: String, enum: ["customer", "admin"], default: "customer" },
		cartData: { type: Object, default: {} },
	},
	{ minimize: false },
	{
		timestamps: true, // helps to identify create and update time in mongo db
	},
); //using minimize false to create empty object of cartdata when user is created

const userModel = mongoose.model.user || mongoose.model("user", userSchema);

export default userModel;
