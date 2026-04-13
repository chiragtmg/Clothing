import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import oauth2Client from "../utils/googleConfig.js";
import axios from "axios";

// Helper to create JWT with role
export const createToken = (user) => {
	return jwt.sign(
		{
			id: user._id,
			username: user.username,
			email: user.email,
			avatar: user.avatar,
			role: user.role,
		},
		process.env.JWT_SECRET_KEY,
		{ expiresIn: "7d" },
	);
};

export const googleAuth = async (req, res) => {
  try {
    const { code } = req.body;
    console.log("✅ Google Auth Started - Email will be:", req.body.email); // for safety

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      { headers: { Authorization: `Bearer ${tokens.access_token}` } }
    );

    const { email, name, picture } = userRes.data;
    console.log("📧 Google User Email:", email);

    let user = await userModel.findOne({ email });

    if (!user) {
      console.log("🆕 Creating new user...");
      user = await userModel.create({
        username: name,
        email,
        avatar: picture,
        role: email === "chiragtmg456@gmail.com" ? "admin" : "customer",
      });
    } else if (email === "chiragtmg456@gmail.com" && user.role !== "admin") {
      console.log("🔧 Upgrading user to admin...");
      user.role = "admin";
      await user.save();
    }

    console.log("👤 Final User Role before sending:", user.role);

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });

    const responseData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    };

    console.log("📤 Sending to frontend:", responseData);   // ← Most Important Log

    res.status(200).json(responseData);
  } catch (err) {
    console.error("❌ Google Auth Error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
};

export const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await userModel.findOne({ email });
		if (!user) {
			return res
				.status(401)
				.json({ success: false, message: "User does not exist" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid credentials" });
		}

		// Auto admin for your email
		if (email === "chiragtmg456@gmail.com" && user.role !== "admin") {
			user.role = "admin";
			await user.save();
		}

		const token = createToken(user);

		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 1000 * 60 * 60 * 24 * 7,
		});

		res.status(200).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			avatar: user.avatar,
			role: user.role,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

export const registerUser = async (req, res) => {
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
export const adminLogin = async (req, res) => {};
