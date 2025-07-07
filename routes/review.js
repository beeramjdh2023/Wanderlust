const express=require("express");
const router=express.Router({mergeParams:true});
const asyncwrap=require("../utils/asyncwrap.js");
const {isLoggedIn,validatereview, isauthor}=require("../middleware.js");
const { createReview,deleteReview } = require("../controllers/review.js");


// review route
router.post("/",isLoggedIn,validatereview,asyncwrap(createReview))

// delete review route
router.delete("/:reviewid",isLoggedIn,isauthor,asyncwrap(deleteReview));

module.exports=router;
