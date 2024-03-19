// creating token and saving cookies
const sendToken = (user, statuscode, res) => {
  const token = user.getJWTToken();
  // options for cookies
  const options = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.COOCIE_EXPIRE * 24 * 60 * 60 * 100
    ),
    secure: true,
    sameSite: "none",
  };

  res.status(statuscode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
