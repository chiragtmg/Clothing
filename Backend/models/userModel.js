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
		timestamps: true, 
	},
); 
const userModel = mongoose.model.user || mongoose.model("user", userSchema);

export default userModel;
