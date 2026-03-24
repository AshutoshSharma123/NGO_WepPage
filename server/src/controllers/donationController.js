import crypto from "crypto";
import { getRazorpayClient } from "../config/razorpay.js";
import { Donation } from "../models/Donation.js";

function buildCertificateNumber(id) {
  return `SRCT-${String(id).slice(-6).toUpperCase()}`;
}

function getServerBaseUrl(req) {
  return process.env.SERVER_PUBLIC_URL || `${req.protocol}://${req.get("host")}`;
}

export async function createDonationOrder(req, res) {
  try {
    const { donorName, email, amount, purpose } = req.body;

    if (!donorName || !email || !amount || !purpose) {
      return res.status(400).json({ message: "All donation fields are required" });
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount < 1) {
      return res.status(400).json({ message: "Donation amount must be valid" });
    }

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: numericAmount * 100,
      currency: "INR",
      receipt: `donation_${Date.now()}`,
      notes: {
        donorName,
        email,
        purpose
      }
    });

    const donation = await Donation.create({
      donorName,
      email,
      amount: numericAmount,
      purpose,
      paymentMethod: "Razorpay",
      paymentStatus: "created",
      razorpayOrderId: order.id
    });

    return res.status(201).json({
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      donationId: donation._id
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function verifyDonationPayment(req, res) {
  try {
    const {
      donationId,
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature
    } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature !== signature) {
      await Donation.findByIdAndUpdate(donationId, { paymentStatus: "failed" });
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const donation = await Donation.findByIdAndUpdate(
      donationId,
      {
        paymentStatus: "paid",
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        donatedAt: new Date(),
        certificateNumber: buildCertificateNumber(donationId)
      },
      { new: true }
    );

    return res.json({
      message: "Donation payment verified successfully",
      certificateUrl: `${getServerBaseUrl(req)}/certificates/${donation._id}`
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function getDonations(req, res) {
  const donations = await Donation.find().sort({ createdAt: -1 });
  res.json(donations);
}
