const express=require("express");
const asyncwrap = require("../utils/asyncwrap");
const router=express.Router();
const passport = require("passport");
const {saveRedirectedUrl}=require("../middleware.js");
const { signupForm, signup, loginForm, login, logout } = require("../controllers/user.js");
const { route } = require("./listing.js");


router.route("/signup") //signup route
.get(signupForm)  // get route for sign up
.post(asyncwrap(signup)) // post route for signup


router.route("/login")  //login route
.get(loginForm)          // get route for login
.post(saveRedirectedUrl,         // post route for login
    passport.authenticate("local", {failureRedirect:"/login",failureFlash:true} ),
    login)


//logout route 
router.get("/logout",logout);

module.exports=router;