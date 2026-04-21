import crypto from "crypto";

const ESEWA_SECRET_KEY = "8gBm/:&EnhH.1/q";
const ESEWA_PRODUCT_CODE = "EPAYTEST";
const ESEWA_PAYMENT_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

const generateSignature = (total_amount, transaction_uuid) => {
	const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${ESEWA_PRODUCT_CODE}`;
	const signature = crypto
		.createHmac("sha256", ESEWA_SECRET_KEY)
		.update(message)
		.digest("base64");
	console.log("SIGNATURE");
	console.log("Message:", message);
	console.log("Generated Signature:", signature);
	return signature;
};

export const initiatePayment = async (req, res) => {
	try {
		const {
			amount,
			tax_amount = 0,
			product_service_charge = 0,
			product_delivery_charge = 0,
		} = req.body;

		const transaction_uuid = `TXN-${Date.now()}`;

		const total_amount = (
			Number(amount) +
			Number(tax_amount) +
			Number(product_service_charge) +
			Number(product_delivery_charge)
		).toFixed(2);

		const signature = generateSignature(total_amount, transaction_uuid);

		const FRONTEND_URL = "http://localhost:5173";

		const paymentData = {
			amount: String(amount),
			tax_amount: String(tax_amount),
			product_service_charge: String(product_service_charge),
			product_delivery_charge: String(product_delivery_charge),
			total_amount: String(total_amount),
			transaction_uuid: String(transaction_uuid),
			product_code: ESEWA_PRODUCT_CODE,
			success_url: `${FRONTEND_URL}/payment/success`,
			failure_url: `${FRONTEND_URL}/payment/failure`,
			signed_field_names: "total_amount,transaction_uuid,product_code",
			signature: String(signature),
		};

		console.log("FINAL PAYMENT DATA");
		console.log(JSON.stringify(paymentData, null, 2));

		res.json({
			success: true,
			esewaUrl: ESEWA_PAYMENT_URL,
			paymentData,
		});
	} catch (error) {
		console.error("Initiate Error:", error);
		res.status(500).json({ success: false, message: error.message });
	}
};

export const verifyPayment = async (req, res) => {
	try {
		const { data } = req.body;

		if (!data) {
			return res
				.status(400)
				.json({ success: false, message: "No data provided" });
		}

		const decodedStr = Buffer.from(data, "base64").toString("utf-8");
		const decoded = JSON.parse(decodedStr);

		console.log("Decoded Response:", decoded);

		const { status, signature, signed_field_names } = decoded;

		if (status !== "COMPLETE") {
			console.log("Payment not complete:", status);
			return res.json({ success: false, message: `Payment ${status}` });
		}

		const message = signed_field_names
			.split(",")
			.map((field) => `${field}=${decoded[field]}`)
			.join(",");

		const expectedSignature = crypto
			.createHmac("sha256", ESEWA_SECRET_KEY)
			.update(message)
			.digest("base64");

		console.log("Verify Message:", message);
		console.log("Expected Signature:", expectedSignature);
		console.log("Received Signature:", signature);

		if (expectedSignature !== signature) {
			console.error("❌ Signature mismatch!");
			return res
				.status(400)
				.json({ success: false, message: "Invalid signature" });
		}

		console.log("✅ Payment Verified Successfully");

		res.json({
			success: true,
			message: "Payment Verified Successfully",
			transaction_uuid: decoded.transaction_uuid,
		});
	} catch (error) {
		console.error("Verify Error:", error);
		res.status(500).json({ success: false, message: "Verification failed" });
	}
};
