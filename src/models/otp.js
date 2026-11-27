const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      trim: true,
    },
    channel: {
      type: String,
      enum: ["email", "phone"],
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
      select: false,
    },
    purpose: {
      type: String,
      enum: ["signup", "login", "reset_pin"],
      default: "signup",
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    lastSentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

//Automatically remove expired OTP records
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
//To Prevent duplicate OTP records for the same pupose
otpSchema.index({ identifier: 1, channel: 1, purpose: 1 }, { unique: true });

module.exports = mongoose.model("otp", otpSchema);
