require("dotenv").config();

const { sendSmsOtp } = require("../src/services/sms.service");
const { generateOtp } = require("../src/utils/otp");

const testSms = async () => {
  try {
    const otp = generateOtp();

    const result = await sendSmsOtp("+2348012345678", otp);

    console.log("SMS test result:", result);
  } catch (error) {
    console.error("SMS test failed:", error.message);
    process.exitCode = 1;
  }
};

testSms();
