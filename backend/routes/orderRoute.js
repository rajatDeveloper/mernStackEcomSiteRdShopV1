const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAdminSingleOrder, getAllOrder, updateOrder, deleteOrder } = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/admin/order/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getAdminSingleOrder);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrder);

router.route("/admin/order/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

    
module.exports = router 