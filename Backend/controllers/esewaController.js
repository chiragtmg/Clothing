// controllers/esewaController.js
import cryptoJs from "crypto-js";

const ESEWA_SECRET_KEY = "8gBm/:&EnhH.1/q";
const ESEWA_PRODUCT_CODE = "EPAYTEST";
const ESEWA_PAYMENT_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

// 🔐 Generate Signature (FIXED + DEBUG)
const generateSignature = (total_amount, transaction_uuid) => {
  const message =
    `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${ESEWA_PRODUCT_CODE}`.trim();

  // 🔍 DEBUG LOGS
  console.log("====== SIGNATURE DEBUG ======");
  console.log("Message (raw):", message);
  console.log("Message (JSON):", JSON.stringify(message)); // shows hidden chars
  console.log("Message Length:", message.length);

  const hash = cryptoJs.HmacSHA256(message, ESEWA_SECRET_KEY);
  const signature = cryptoJs.enc.Base64.stringify(hash);

  console.log("Generated Signature:", signature);
  console.log("============================");

  return signature;
};

// 🚀 Initiate Payment
export const initiatePayment = async (req, res) => {
  try {
    const {
      amount,
      tax_amount = 0,
      product_service_charge = 0,
      product_delivery_charge = 0,
    } = req.body;

    // ✅ SAFE UUID
    const transaction_uuid = `TXN-${Date.now()}`;

    // ✅ EXACT TOTAL (VERY IMPORTANT)
    const total_amount = String(
      Number(amount) +
        Number(tax_amount) +
        Number(product_service_charge) +
        Number(product_delivery_charge)
    );

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

    // 🔍 FINAL DEBUG BEFORE SENDING
    console.log("====== FINAL PAYMENT DATA ======");
    console.log(JSON.stringify(paymentData, null, 2));

    // 🔍 CHECK FOR UNDEFINED VALUES
    Object.entries(paymentData).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        console.error(`❌ Missing value for: ${key}`);
      }
    });

    console.log("================================");

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

// ✅ Verify Payment (FIXED + DEBUG)
export const verifyPayment = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ success: false, message: "No data" });
    }

    // Decode Base64
    const decodedStr = Buffer.from(data, "base64").toString("utf-8");
    const decoded = JSON.parse(decodedStr);

    console.log("====== VERIFY DEBUG ======");
    console.log("Decoded Response:", decoded);

    const { status, signature, signed_field_names } = decoded;

    if (status !== "COMPLETE") {
      console.log("Payment not complete:", status);
      return res.json({ success: false, message: `Payment ${status}` });
    }

    // 🔥 CORRECT SIGNATURE VERIFICATION
    const message = signed_field_names
      .split(",")
      .map((field) => `${field}=${decoded[field]}`)
      .join(",")
      .trim();

    console.log("Verify Message:", message);
    console.log("Verify Message JSON:", JSON.stringify(message));
    console.log("Verify Message Length:", message.length);

    const hash = cryptoJs.HmacSHA256(message, ESEWA_SECRET_KEY);
    const expectedSignature = cryptoJs.enc.Base64.stringify(hash);

    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", signature);

    if (expectedSignature !== signature) {
      console.error("❌ Signature mismatch!");
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    console.log("✅ Payment Verified Successfully");
    console.log("===============================");

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