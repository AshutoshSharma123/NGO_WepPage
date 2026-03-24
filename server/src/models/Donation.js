import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    purpose: {
      type: String,
      required: true,
      trim: true
    },
    paymentMethod: {
      type: String,
      default: "Razorpay"
    },
    paymentStatus: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created"
    },
    razorpayOrderId: {
      type: String,
      trim: true
    },
    razorpayPaymentId: {
      type: String,
      trim: true
    },
    razorpaySignature: {
      type: String,
      trim: true
    },
    certificateNumber: {
      type: String,
      trim: true
    },
    donatedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const Donation = mongoose.model("Donation", donationSchema);
