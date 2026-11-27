require("dotenv").config();

const { sendEmailOtp } = require("../src/services/email.service");
const { generateOtp } = require("../src/utils/otp");

const testEmail = async () => {
  try {
    const otp = generateOtp();

    const result = await sendEmailOtp("adeniyiadeife12@gmail.com", otp);

    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("Email failed:", error.message);
    process.exitCode = 1;
  }
};

testEmail();
