require("dotenv").config();

const mongoose = require("mongoose");
const Otp = require("../src/models/Otp");

const { createOtp, verifyOtp } = require("../src/services/otp.service");

const testOtp = async () => {
  const identifier = `test-${Date.now()}@example.com`;

  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Otp.init();

    console.log("Database connected");

    const otp = await createOtp(identifier, "email");

    console.log("Generated test OTP:", otp);

    try {
      await createOtp(identifier, "email");
    } catch (error) {
      console.log("Resend test:", error.message);
    }

    try {
      await verifyOtp(identifier, "email", "000000");
    } catch (error) {
      console.log("Wrong OTP test:", error.message);
    }

    const verified = await verifyOtp(identifier, "email", otp);

    console.log("Correct OTP test:", verified);

    try {
      await verifyOtp(identifier, "email", otp);
    } catch (error) {
      console.log("Reuse test:", error.message);
    }
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState === 1) {
      await Otp.deleteMany({ identifier });
    }

    await mongoose.disconnect();
  }
};

testOtp();
