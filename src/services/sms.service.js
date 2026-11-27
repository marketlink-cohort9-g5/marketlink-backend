const sendSmsOtp = async (phoneNumber, otp) => {
  const provider = process.env.SMS_PROVIDER;

  // Mock SMS is restricted to local development
  if (provider === "mock" && process.env.NODE_ENV === "development") {
    console.log("\n--- MOCK SMS ---");
    console.log(`To: ${phoneNumber}`);
    console.log(`Your MarketLink verification code is ${otp}`);
    console.log("----------------\n");

    return {
      success: true,
      provider: "mock",
    };
  }

  throw new Error("SMS provider is not configured");
};

module.exports = { sendSmsOtp };
