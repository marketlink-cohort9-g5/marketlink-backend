const Otp = require("../models/Otp");

const { generateOtp, hashOtp, compareOtp } = require("../utils/otp");

const OTP_EXPIRY = Number(process.env.OTP_EXPIRY_MINUTES || 5);

const MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);

const RESEND_COOLDOWN = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 60);

// Create and store an OTP
const createOtp = async (identifier, channel, purpose = "signup") => {
  const now = new Date();

  const otp = generateOtp();

  const otpHash = hashOtp(otp, identifier, purpose);

  const expiresAt = new Date(now.getTime() + OTP_EXPIRY * 60 * 1000);

  const cooldownBefore = new Date(now.getTime() - RESEND_COOLDOWN * 1000);

  try {
    await Otp.findOneAndUpdate(
      {
        identifier,
        channel,
        purpose,
        lastSentAt: {
          $lte: cooldownBefore,
        },
      },
      {
        $set: {
          otpHash,
          expiresAt,
          attempts: 0,
          isUsed: false,
          lastSentAt: now,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      },
    );
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Please wait before requesting another OTP");
    }

    throw error;
  }

  return otp;
};

// Verify a submitted OTP
const verifyOtp = async (
  identifier,
  channel,
  submittedOtp,
  purpose = "signup",
) => {
  const record = await Otp.findOne({
    identifier,
    channel,
    purpose,
  }).select("+otpHash");

  if (!record || record.isUsed) {
    throw new Error("Invalid or already used OTP");
  }

  if (record.expiresAt <= new Date()) {
    throw new Error("OTP has expired");
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    throw new Error("Maximum verification attempts exceeded");
  }

  const isCorrect = compareOtp(
    submittedOtp,
    identifier,
    record.otpHash,
    purpose,
  );

  // Ensure the OTP is still valid and unchanged
  const filter = {
    _id: record._id,
    otpHash: record.otpHash,
    lastSentAt: record.lastSentAt,
    isUsed: false,
    expiresAt: { $gt: new Date() },
    attempts: { $lt: MAX_ATTEMPTS },
  };

  if (!isCorrect) {
    await Otp.updateOne(filter, { $inc: { attempts: 1 } });

    throw new Error("Incorrect OTP");
  }

  const result = await Otp.updateOne(filter, { $set: { isUsed: true } });

  if (result.modifiedCount !== 1) {
    throw new Error("OTP is no longer valid");
  }

  return true;
};

module.exports = {
  createOtp,
  verifyOtp,
};
