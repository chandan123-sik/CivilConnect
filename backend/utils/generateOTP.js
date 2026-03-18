const otpMap = new Map();

const generateOTP = (phone) => {
  // 6-digit random number
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store with expiry (5 minutes)
  const expiry = Date.now() + 5 * 60 * 1000;
  otpMap.set(phone, { otp, expiry });
  
  return otp;
};

const verifyOTP = (phone, otp) => {
  const entry = otpMap.get(phone);
  
  if (!entry) return false;
  if (Date.now() > entry.expiry) {
    otpMap.delete(phone);
    return false;
  }
  
  if (entry.otp === otp) {
    otpMap.delete(phone); // Clear after use
    return true;
  }
  
  return false;
};

module.exports = { generateOTP, verifyOTP };
