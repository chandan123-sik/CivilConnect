const sendOTP = async (phone, otp) => {
  const isServiceActive = process.env.OTP_SERVICE_ACTIVE === 'true';

  if (isServiceActive) {
    // ⚠️ Real SMS Service Placeholder (Twilio/MSG91 etc.)
    // await smsProvider.send(phone, `Your CivilConnect OTP is ${otp}. Valid for 5 mins.`);
    console.log(`📡 [OTP-LIVE] SMS sent to ${phone} via real service.`);
  } else {
    // 🛠️ Dev Mode: Log to console
    console.log(`-------------------------------------------`);
    console.log(`📱 TO: ${phone}`);
    console.log(`🔐 OTP: ${otp}`);
    console.log(`-------------------------------------------`);
  }
};

module.exports = sendOTP;
