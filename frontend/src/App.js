import "./App.css";
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import WebFont from "webfontloader";
import React, { useEffect, useState } from "react";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOption from "./component/layout/Header/UserOption.js";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import axios from "axios";
import Payment from "./component/Cart/Payment.js";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/User/OrderSuccess.js";
import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails.js";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct.js";
import UpdateProduct from "./component/Admin/UpdateProduct.js";
import OrderList from "./component/Admin/OrderList.js";
import ProcessOrder from "./component/Admin/ProcessOrder";
import UsersList from "./component/Admin/UserList";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";
import Contact from "./component/layout/Contact/Contact.js";
import About from "./component/layout/About/About.js";
import NotFound from "./component/layout/Not Found/NotFound.js";
function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");
  const urlMain = "https://9pq52n-4000.csb.app";
  async function getStripeApiKey() {
    const { data } = await axios.get(`${urlMain}/api/v1/stripeapikey`);
    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanks"],
      },
    });

    store.dispatch(loadUser());
    getStripeApiKey();
  }, []);

  window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      <div>
        <Header />
        {isAuthenticated && <UserOption user={user} />}
        {stripeApiKey && (
          <Elements stripe={loadStripe(stripeApiKey)}>
            <ProtectedRoute exact path="/process/payment" component={Payment} />

            {/* /admin/product */}
          </Elements>
        )}
        {isAuthenticated && <UserOption user={user} />}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/product/:id">
            <ProductDetails />
          </Route>

          <Route exact path="/products/:keyword">
            <Products />
          </Route>

          <Route exact path="/products">
            <Products />
          </Route>

          <Route exact path="/search">
            <Search />
          </Route>
          <Route exact path="/login">
            <LoginSignUp />
          </Route>
          <Route exact path="/about" component={About} />
          <Route exact path="/contact" component={Contact} />
          <ProtectedRoute exact path="/account" component={Profile} />

          <ProtectedRoute exact path="/me/update" component={UpdateProfile} />

          <ProtectedRoute
            exact
            path="/password/update"
            component={UpdatePassword}
          />

          <Route exact path="/password/forgot" component={ForgotPassword} />
          <Route
            exact
            path="/password/reset/:token"
            component={ResetPassword}
          />

          <Route exact path="/Cart" component={Cart} />

          <ProtectedRoute exact path="/shipping" component={Shipping} />
          <ProtectedRoute
            exact
            path="/order/confirm"
            component={ConfirmOrder}
          />
          <ProtectedRoute exact path="/success" component={OrderSuccess} />

          <ProtectedRoute exact path="/orders" component={MyOrders} />
          <ProtectedRoute exact path="/order/:id" component={OrderDetails} />

          <ProtectedRoute
            isAdmin={true}
            exact
            path="/admin/dashboard"
            component={Dashboard}
          />

          <ProtectedRoute
            isAdmin={true}
            exact
            path="/admin/products"
            component={ProductList}
          />

          <ProtectedRoute
            isAdmin={true}
            exact
            path="/admin/product"
            component={NewProduct}
          />

          <ProtectedRoute
            isAdmin={true}
            exact
            path="/admin/product/:id"
            component={UpdateProduct}
          />

          <ProtectedRoute
            isAdmin={true}
            exact
            path="/admin/orders"
            component={OrderList}
          />
          <ProtectedRoute
            isAdmin={true}
            exact
            path="/admin/order/:id"
            component={ProcessOrder}
          />

          <ProtectedRoute
            isAdmin={true}
            exact
            path="/admin/users"
            component={UsersList}
          />
          <ProtectedRoute
            isAdmin={true}
            exact
            path="/admin/user/:id"
            component={UpdateUser}
          />

          <ProtectedRoute
            isAdmin={true}
            exact
            path="/admin/reviews"
            component={ProductReviews}
          />

          <Route
            component={
              window.location.pathname === "/process/payment" ? null : NotFound
            }
          />

          {/* <Route exact path="/">
            <Home />
          </Route> */}
        </Switch>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
//15:16
