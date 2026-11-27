const crypto = require("crypto");

//To Generate a secure 6-digit OTP
const generateOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

//To Protect the OTP before storing it
const hashOtp = (otp, identifier, purpose = "signup") => {
  const secret = process.env.OTP_SECRET;

  if (!secret) {
    throw new Error("OTP_SECRET is not configured");
  }
  return crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify({ identifier, purpose, otp }))
    .digest("hex");
};

//Compare the submitted OTP with the stored hash
const compareOtp = (otp, identifier, storedHash, purpose = "signup") => {
  const generatedHash = hashOtp(otp, identifier, purpose);
  const first = Buffer.from(generatedHash, "hex");
  const second = Buffer.from(storedHash, "hex");

  if (first.length !== second.length) {
    return false;
  }
  return crypto.timingSafeEqual(first, second);
};

module.exports = {
  generateOtp,
  hashOtp,
  compareOtp,
};
