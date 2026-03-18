const { errorRes } = require('../utils/apiResponse');

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorRes(res, 'No user context found', 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorRes(res, `Forbidden: ${req.user.role} role is not authorized`, 403);
    }

    next();
  };
};

module.exports = checkRole;
