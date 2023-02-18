import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route } from "react-router-dom"

const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {
  var data = useSelector((state => state.user));
  var loading = data.loading;
  var user = data.user;
  var isAuthenticated = data.isAuthenticated;
  return (
    <Fragment>
      {loading === false && (
        <Route
          {...rest}
          render={(props) => {
            if (isAuthenticated === false) {
              return <Redirect to="/login" />;
            }

            if (isAdmin === true && user.role !== "admin") {
              return <Redirect to="/login" />;
            }

            return <Component {...props} />;
          }}
        />
      )}
    </Fragment>
  )
}

export default ProtectedRoute