const ErrorHandler = require("../utils/errorhandler")

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    if (err.name === "CastError") {
        const message = `Resources not found . Invaild  ${err.path}`;
        err = new ErrorHandler(message, 400);

    }
    //moongoose duplicate error 
    if (err.code === 11000) {
        const message = `Dupliacte ${Object.keys(err.keyValue)} Entered `;
        err = new ErrorHandler(message, 400);
    }

    // json web token error  
    if (err.name === "JsonWebTokenError") {
        const message = `JsonWebToken error : json web token is invaild ! 
         `;
        err = new ErrorHandler(message, 400);

    }

    //jwt expire error 
    if (err.name === "TokenExpiredError") {
        const message = `Json web token is expired ! `;
        err = new ErrorHandler(message, 400);

    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}