import React, { Fragment, useEffect, useState } from 'react'
import "./Products.css"
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, getProduct } from '../../actions/productAction';
import Loader from '../layout/Loader/Loader';
import ProductCard from "../Home/ProductCard";
import { useParams } from "react-router-dom"
import Pagination from "react-js-pagination"
import Slider from "@material-ui/core/Slider";
import { useAlert } from "react-alert";
import Typography from "@material-ui/core/Typography";
const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
    "Food" ,
    "Medicine"
];


const Products = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 25000]);
    const [category, setCategory] = useState("");

    const [ratings, setRatings] = useState(0);

    var data = useSelector(
        (state) => state.product,
    );

    var products = data.products;
    var loading = data.loading;
    var error = data.error;
    var productsCount = data.productsCount;
    var resultPerPage = data.resultPerPage;
    // var filteredProductsCount = data.filteredProductsCount;
    var { keyword } = useParams();

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    }

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);

    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct(keyword, currentPage, price, category, ratings));
    }, [dispatch, keyword, currentPage, price, category, ratings, alert, error])
    // let count = filteredProductsCount;
    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <h2 className='productsHeading'>Products</h2>
                    <div className='products'>
                        {
                            products && products.map(
                                (product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))


                        }

                    </div>

                    <div className='filterBox'>
                        <Typography>Price</Typography>
                        <Slider
                            value={price}
                            onChange={priceHandler}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            min={0}
                            max={25000}
                        />
                        <Typography>Categories</Typography>
                        <ul className="categoryBox">
                            {categories.map((category) => (
                                <li
                                    className="category-link"
                                    key={category}
                                    onClick={() => setCategory(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>
                        <fieldset>
                            <Typography component="legend">Ratings Above</Typography>
                            <Slider
                                value={ratings}
                                onChange={(e, newRating) => {
                                    setRatings(newRating);
                                }}
                                aria-labelledby="continuous-slider"
                                valueLabelDisplay="auto"
                                min={0}
                                max={5}
                            />
                        </fieldset>

                    </div>

                    {resultPerPage < productsCount && <div className='paginationBox'>
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={resultPerPage}
                            totalItemsCount={productsCount}
                            onChange={setCurrentPageNo}
                            nextPageText="Next"
                            prevPageText="Prev"
                            lastPageText="Last"
                            itemClass="page-item"
                            linkClass='page-link'
                            activeClass='pageItemActive'
                            activeLinkClass='pageLinkActive'
                        />
                    </div>}
                </Fragment>}
        </Fragment>
    )
}

export default Products