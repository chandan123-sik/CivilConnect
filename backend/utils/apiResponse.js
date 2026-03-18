const successRes = (res, data, message = 'Success', code = 200) => {
  return res.status(code).json({
    success: true,
    message,
    data
  });
};

const errorRes = (res, message = 'Error', code = 400) => {
  return res.status(code).json({
    success: false,
    message
  });
};

module.exports = { successRes, errorRes };
