const cookieParser = require("cookie-parser");
const express = require("express")
const errorMiddleware = require("./middleware/error");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
var cors = require('cors');
const dotenv = require("dotenv");
const path = require("path");


// require("dotenv").config({ path: "backend/config/config.env" });
const app = express();

const corsOrigin = {
    origin: 'http://localhost:3000', //or whatever port your frontend is using
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOrigin));
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
// route imports  
// var bodyParser = require('body-parser');

const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);


app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// middleware for error  
app.use(errorMiddleware);

module.exports = app 