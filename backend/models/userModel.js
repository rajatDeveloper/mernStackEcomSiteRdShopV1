const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "pls enter your name "],
        maxLength: [30, "Name can not exced the 30 char "],
        minLenght: [3, "name should of min 3 char "]

    },
    email: {
        type: String,
        required: [true, "pls enter your email "],
        unique: true,
        validate: [validator.isEmail, "pls enter vaild email "]
    },
    password: {
        type: String,
        required: [true, "pls enter your password "],
        minLenght: [8, "password should be greater than 8 "],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// jwt token  
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE, });
};

// compare password 
userSchema.methods.comparePassword = async function (enteredpassword) {
    return bcrypt.compare(enteredpassword, this.password);
};

// reset password  - generatig reset token 
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hashing and adding user schema  
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");


    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;

};



module.exports = mongoose.model("User", userSchema);