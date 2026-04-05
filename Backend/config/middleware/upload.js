import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uploadPath = path.join(process.cwd(), "public", "images");

		// Create directory if it doesn't exist
		if (!fs.existsSync(uploadPath)) {
			fs.mkdirSync(uploadPath, { recursive: true });
		}

		cb(null, uploadPath);
	},
	filename: function (req, file, cb) {
		// Generate unique filename
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		// Clean the original filename to remove spaces and special characters
		const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
		cb(null, "product-" + uniqueSuffix + path.extname(cleanName));
	},
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB limit
	},
	fileFilter: function (req, file, cb) {
		// Check if file is an image
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Only image files are allowed"), false);
		}
	},
});

export { upload };
