const ErrorHandler = require("../utils/errorhandler");
const catchAyncError = require("./catchAyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAyncError(async (req, res, next) => {
  console.log(req.cookies, "teh cookies are");
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("pls login to access the details ", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);
  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role : ${req.user.role} is not allowed to access the data`,
          403
        )
      );
    }
    next();
  };
};
