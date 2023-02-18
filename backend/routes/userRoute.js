const express = require("express");
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userController");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")
// register user  
router.route("/register").post(registerUser);
// login user  
router.route("/login").post(loginUser);
// forget password  
router.route("/password/forget").post(forgotPassword);
//logout route 
router.route("/logout").get(logout);
//rest password route 
router.route("/password/reset/:token").put(resetPassword);
//get user details 
router.route("/me").get(isAuthenticatedUser, getUserDetails);

//update password ! 
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

// upadte profilie 
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

//get all users data route 
router.route("/admin/users")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);


// get single user - admin 
router.route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);




module.exports = router; 