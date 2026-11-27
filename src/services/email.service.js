const { Resend } = require("resend");

const sendEmailOtp = async (email, otp) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: [email],
    subject: "MarketLink Verification Code",
    text: `Your MarketLink verification code is ${otp}. 
This code expires in ${process.env.OTP_EXPIRY_MINUTES || 5} minutes.
Do not share this code with anyone.`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

module.exports = { sendEmailOtp };
