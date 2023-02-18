const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsycError = require("../middleware/catchAyncError");
const ApiFeatures = require("../utils/apiFeature");
const cloudinary = require("cloudinary");
const { collection } = require("../models/productModel");
const catchAyncError = require("../middleware/catchAyncError");
//create product - admin 
exports.createProduct = catchAsycError(async (req, res, next) => {
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.images = imagesLinks;

    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    });
});

// get all product  
exports.getAllProducts = catchAsycError(async (req, res) => {
    // return next(new ErrorHandler("thhis is temp error !", 500));

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(
        Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
    // .pagination(resultPerPage);
    // let products = await apiFeature.query;
    // let filteredProductsCount = products.lenght;
    apiFeature.pagination(resultPerPage);

    const products = await apiFeature.query;

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        // filteredProductsCount
    })
});

// get all product  - Admin 
exports.getAdminProducts = catchAsycError(async (req, res) => {

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,

    })
});

// upadte fun admin 

exports.updateProduct = catchAyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }

    // Images Start Here
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if (images !== undefined) {
        // Deleting Images From Cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.images = imagesLinks;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        product,
    });
});

// delete product 
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        //deleteing images from clodunaery too ! 
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }


        await product.remove();
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        })
    } catch (error) {

        return next(new ErrorHandler("Product not found", 404));

    }

}


//getting a single product array
exports.getProductDetails = catchAsycError(async (req, res, next) => {

    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    return res.status(200).json({
        success: true,
        product
    })


})

// add review - by all user - sreview working 

exports.createProductReview = catchAsycError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());

    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev => rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating,
                    rev.comment = comment
            }

        });

    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.reviews.forEach(rev => {
        avg += rev.rating;
    });
    product.ratings = avg / product.reviews.length;

    await product.save({
        validateBeforeSave: false
    });

    res.status(200).json({
        success: true,

    });

});

//get all reviews of single product 
exports.getProductReview = catchAsycError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found !", 404));
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
});
// Delete Review
exports.deleteReview = catchAsycError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
    });
});