import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		price: { type: Number, required: true },
		images: { type: [String], required: true },
		category: { type: String, required: true },
		subCategory: { type: String, required: true },
		variants: [
			{
				size: {
					type: String,
					required: true,
					enum: ["XS", "S", "M", "L", "XL", "XXL", "One Size"], // ← customize as needed
					trim: true,
				},
				stock: {
					type: Number,
					required: true,
					min: 0,
					default: 0,
				},
			},
		],
		bestSeller: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	},
);

export default mongoose.model("Product", productSchema);
