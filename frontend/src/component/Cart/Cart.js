import React, { Fragment } from "react";
import "./Cart.css";
import CartItemCard from "./CartItemCard";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart, removeItemsToCart } from "../../actions/cartAction";
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link, useHistory } from "react-router-dom";
import MetaData from "../layout/MetaData";

const Cart = () => {
    const dispatch = useDispatch();
    var data = useSelector((state) => state.cart);
    var data2 = useSelector((state) => state.user);
    var isAuthenticated = data2.isAuthenticated || false;
    var cartItems = data.cartItems;
    var histroy = useHistory();
    const increaseQuantity = (id, quantity, stock) => {
        const newQty = quantity + 1;
        if (stock <= quantity) {
            return;
        }
        dispatch(addItemsToCart(id, newQty));
    }

    const decreaseQuantity = (id, quantity) => {
        const newQty = quantity - 1;
        if (1 >= quantity) {
            return;
        }
        dispatch(addItemsToCart(id, newQty));
    }

    const deleteCartItems = (id) => {
        dispatch(removeItemsToCart(id));
        // alert.
    }


    const checkoutHandler = () => {
        if (isAuthenticated) {
            histroy.push("/shipping")
        } else {
            histroy.push("/login")
        }

    }
    return (

        <Fragment>
            <MetaData title="Cart" />
            {
                cartItems.length === 0 ? (
                    <div className="emptyCart">
                        <RemoveShoppingCartIcon />
                        <Typography> No Product in Your Cart ! </Typography>
                        <Link to="/products">View Products </Link>
                    </div>
                ) :
                    <Fragment>
                        {
                            console.log(cartItems.lenght)
                        }
                        <div className="cartPage">
                            <div className="cartHeader">
                                <p>Product</p>
                                <p>Quantity</p>
                                <p>Subtotal</p>
                            </div>

                            {cartItems &&
                                cartItems.map((item) => (
                                    <div className="cartContainer" key={item.product}>
                                        <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                                        <div className="cartInput">
                                            <button
                                                onClick={() =>
                                                    decreaseQuantity(item.product, item.quantity)
                                                }
                                            >
                                                -
                                            </button>
                                            <input
                                                // style={{ width: '5vmax' }}
                                                type="number" value={item.quantity} readOnly />
                                            <button
                                                onClick={() =>
                                                    increaseQuantity(
                                                        item.product,
                                                        item.quantity,
                                                        item.stock
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="cartSubtotal">{`₹${item.price * item.quantity
                                            }`}</p>
                                    </div>
                                ))
                            }

                            <div className="cartGrossProfit">
                                <div></div>
                                <div className="cartGrossProfitBox">
                                    <p>Gross Total</p>
                                    <p>{`₹${cartItems.reduce(
                                        (acc, item) => acc + item.quantity * item.price,
                                        0
                                    )}`}</p>
                                </div>
                                <div></div>
                                <div className="checkOutBtn">
                                    <button
                                        onClick={checkoutHandler}
                                    >Check Out</button>
                                </div>
                            </div>
                        </div>
                    </Fragment>
            }
        </Fragment>


    )
}

export default Cart