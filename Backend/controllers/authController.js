import { response } from "express";
import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import oauth2Client from "../utils/googleConfig.js";
import axios from "axios";

const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET);
};

const googleAuth = async (req, res) => {
	try {
		const { code } = req.body;

		if (!code) {
			return res.status(400).json({ message: "Code is required" });
		}

		// Exchange authorization code for tokens
		const { tokens } = await oauth2Client.getToken(code);
		oauth2Client.setCredentials(tokens);

		// Get user info from Google
		const userRes = await axios.get(
			"https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
			{
				headers: {
					Authorization: `Bearer ${tokens.access_token}`,
				},
			},
		);

		const { email, name, picture } = userRes.data;

		// Find or create user
		let user = await userModel.findOne({ email });

		if (!user) {
			user = await userModel.create({
				username: name,
				email,
				avatar: picture,
			});
		}

		// Generate JWT
		const age = 1000 * 60 * 60 * 24 * 7; // 7 days

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username,
				avatar: user.avatar,
				isAdmin: false,
			},
			process.env.JWT_SECRET_KEY,
			{ expiresIn: "7d" },
		);

		// Set cookie (IMPORTANT FIX)
		res
			.cookie("token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: age,
			})
			.status(200)
			.json({
				_id: user._id,
				username: user.username,
				email: user.email,
				avatar: user.avatar,
			});
	} catch (err) {
		console.error("Google Auth Error:", err);
		res.status(500).json({
			message: "Google login failed",
			error: err.message,
		});
	}
};

// Route for the user login
const loginUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await userModel.findOne({ email });

		if (!user) {
			return res
				.status(401)
				.json({ success: false, message: "User doesnot exist" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ msg: "Invalid credentials" });
		}
		// Generate JWT token
		const age = 1000 * 60 * 60 * 24 * 7; // 1 week

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username,
				avatar: user.avatar,
				isAdmin: false,
			},
			process.env.JWT_SECRET_KEY,
			{ expiresIn: age },
		);

		// Create user info object
		const userInfo = {
			_id: user._id,
			username: user.username,
			email: user.email,
			avatar: user.avatar,
			role: user.role, 
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};

		res
			.cookie("token", token, {
				httpOnly: true,
				// secure: true, // uncomment in production with HTTPS
				maxAge: age,
			})
			.status(200)
			.json(userInfo);
	} catch (error) {
		res.status(500).json({ msg: "Internal server error" });
		console.error(error);
	}
};

//route for the user registration
const registerUser = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		//for checking email exist or not
		const exists = await userModel.findOne({ email });

		if (exists) {
			return res.json({ success: false, message: "User already exist" });
		}

		//validating email and strong password
		if (!validator.isEmail(email)) {
			return res.json({ success: false, message: "Use valid email" });
		}
		if (password.length < 8) {
			return res.json({
				success: false,
				message: "Please enter a strong password",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await userModel.create({
			email,
			password: hashedPassword,
			username,
		});

		//Create user response object
		const userResponse = {
			_id: newUser._id,
			username: newUser.username,
			email: newUser.email,
			avatar: newUser.avatar,
			role: newUser.role,
			createdAt: newUser.createdAt,
			updatedAt: newUser.updatedAt,
		};

		res
			.status(201)
			.json({ message: "User registered successfully", userResponse });
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
		console.error(error);
	}
};

export const logoutUser = (req, res) => {
	res.clearCookie("token").status(200).json({ msg: "Logged out successfully" });
};

//route for admin login
const adminLogin = async (req, res) => {};

export { loginUser, registerUser, adminLogin, googleAuth };
