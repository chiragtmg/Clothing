import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js"
import paymentRoutes from "./routes/payementRoutes.js"
import khaltiRoutes from "./routes/khaltiRoutes.js"
import analyticRoutes from "./routes/analyticRoutes.js"

import cookieParser from "cookie-parser";
import path from "path";

const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

app.use(express.json()); 
app.use(cookieParser()); 
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true, 
	}),
); 
app.use(
	"/images",
	express.static(path.join(process.cwd(), "public", "images")),
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api", paymentRoutes)
app.use("/api", khaltiRoutes)
app.use("/api", analyticRoutes)

app.get("/", (req, res) => {
	res.send("API WOrking");
});

app.listen(port, () => console.log("Server startrd on PORT: " + port));
