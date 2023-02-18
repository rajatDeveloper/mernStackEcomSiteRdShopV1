// const { default: mongoose } = require("mongoose");
const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        requied: [true, "Please enter product name "],
        trim: true
    },
    description: {
        type: String,
        requied: [true, "Please enter product description "]
    },
    price: {
        type: Number,
        required: true,
        default: 0,
        maxlength: [8, "price can not exceed 8 characters"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "please enter product category "],
        default: "none"
    },
    Stock: {
        type: Number,
        required: [true, "please enter product stock "],
        maxlength: [4, "stock cannot exceed 4 char "],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true,

            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model("Product", productSchema)