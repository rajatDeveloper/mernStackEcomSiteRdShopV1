import React, { Fragment, useEffect } from 'react'
import { CgMouse } from "react-icons/cg"
import "./Home.css"

import MetaData from '../layout/MetaData'
import { clearErrors, getProduct } from '../../actions/productAction'
import { useSelector, useDispatch } from "react-redux"
import Loader from '../layout/Loader/Loader'
import { useAlert } from "react-alert";
import ProductCard from './ProductCard.js'




export const Home = () => {
    const alert = useAlert();
    const dispatch = useDispatch();



    var data = useSelector(
        (state) => state.product,
    );

    var products = data.products;
    var loading = data.loading;
    var error = data.error;
    // var productsCount = data.productsCount;


    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct());
    }, [dispatch, error, alert]);

    return (
        <Fragment>
            {loading ? <Loader /> : <Fragment>
                <MetaData title="Home -  Rd Shop" />
                <div className='banner'>
                    <p>Welcome to Rd Shop ! </p>
                    <h1>FIND AMAZING PRODUCT BELOW ! </h1>
                    <a href="#container">
                        <button href="#container">
                            Scroll <CgMouse />
                        </button>
                    </a>
                </div>
                <h2 className='homeHeading'>Featured Products </h2>

                <div className='container' id='container'>


                    {
                        products && products.map(
                            (product) => (
                                <ProductCard key={product._id} product={product} />
                            ))


                    }



                </div>
            </Fragment>}
        </Fragment>
    )
}

export default Home;