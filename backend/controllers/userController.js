const ErrorHandler = require("../utils/errorhandler");
const catchAsycError = require("../middleware/catchAyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const { reset } = require("nodemon");
const { sendEmail } = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

//register our user 
exports.registerUser = catchAsycError(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale"
    });
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    });

    sendToken(user, 201, res);


});


//lgin user 
exports.loginUser = catchAsycError(async (req, res, next) => {
    const { email, password } = req.body;

    // checking if user is exiting or not  
    if (!email || !password) {
        return next(new ErrorHandler("pls enter email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invaild email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    // console.log(isPasswordMatched);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invaild email or password", 401));
    }

    sendToken(user, 200, res);
});

//logout 
exports.logout = catchAsycError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logout Successfully ! "
    });
});

// forget password 
exports.forgotPassword = catchAsycError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("user not found ! pls check details ", 404))
    }

    // get reset password token  
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
    )}/password/reset/${resetToken}`;

    const message = ` your password rest token is \n\n ${resetPasswordUrl} \n\n if you have not requested this email then ignore this `;

    try {
        await sendEmail({
            email: user.email,
            subject: `Ecom Web Site - Password Recovery  ! `,
            message
        });

        res.status(200).json({
            success: true,
            message: `Email is send to ${user.email} successfully ! `,

        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }

});


// reset pass word fun  
exports.resetPassword = catchAsycError(async (req, res, next) => {


    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.pasrms.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler("rest password token is invaild or token is expired !  ", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("password and confirm password did not match !  ", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

//get user details - loged user will get its own details 
exports.getUserDetails = catchAsycError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

// update password 
exports.updatePassword = catchAsycError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect ! ", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("new password and confirm pasword did not matched ! ", 400));
    }

    user.password = req.body.newPassword;
    user.save();
    sendToken(user, 200, res);
});

// update profile  
exports.updateProfile = catchAsycError(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,

    }

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale"
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }

    }


    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        // user
    });
});

// all users details  
exports.getAllUsers = catchAsycError(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
});

// admin fun - get single  user data  
exports.getSingleUser = catchAsycError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User not exist with Id: ${req.pasrms.id}`, 404));
    }

    res.status(200).json({
        success: true,
        user
    });
});


// updating the user role by admin user  
exports.updateUserRole = catchAsycError(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role

    }


    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    // console.log(user);

    res.status(200).json({
        success: true,
        // user
    });
});
// Delete User --Admin
exports.deleteUser = catchAsycError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
        );
    }

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.remove();

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
});