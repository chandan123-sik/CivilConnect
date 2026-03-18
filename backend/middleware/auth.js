const jwt = require('jsonwebtoken');
const { errorRes } = require('../utils/apiResponse');

const auth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token || token === 'null' || token === 'undefined') {
    return errorRes(res, 'No authentication token found. Please login.', 401);
  }

  try {
    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return errorRes(res, 'Session expired. Please login again.', 401);
    }
    return errorRes(res, 'Invalid authentication token.', 401);
  }
};

module.exports = auth;
