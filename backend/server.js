const app = require("./app");
// const dotenv = ;
const cloudinary = require("cloudinary");
const connnectDatabase = require("./config/database");


//config  
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
}


//error 
process.on("uncaughtException", (err) => {

    console.log(`error : ${err}`);
    process.exit(1);

})

//connecting data 
connnectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const server = app.listen(process.env.PORT,
    () => {
        console.log(`server is working 0n http://localhost:${process.env.PORT}`);
    }
);


//unhandled error $
process.on("unhandledRejection", err => {

    console.log(`Error : ${err.message}`);
    console.log("Shutting down the error");

    server.close(() => {
        process.exit();
    });

})



// 11:13