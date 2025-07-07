const express=require("express");
const router=express.Router();
const asyncwrap=require("../utils/asyncwrap.js");
const {isLoggedIn, isowner,validateSchema}=require("../middleware.js");
const listingControler=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const { Listing } = require("../models/listing.js");
const upload=multer({storage});


router.route("/")        // index route
.get(asyncwrap(listingControler.index))         // index route for showing all listings
.post(validateSchema,
    upload.single("listing[image]"),
    asyncwrap(listingControler.createListing));   // post route for new listing




// get route for new listing 
router.get("/new",
    isLoggedIn ,
    listingControler.renderNewForm);

router.route("/:id")                  
.get(asyncwrap(listingControler.showListings))          //get route for show listing
.delete(isLoggedIn,
    isowner,
    asyncwrap(listingControler.destroyListing));   // delete route for listing

router.route("/:id/edit")
.get(isLoggedIn,
    isowner,
    validateSchema,
    asyncwrap(listingControler.renderEditForm))   //get route for edit listing
.put(isLoggedIn,
    isowner,
    upload.single("listing[image]"),
    validateSchema,
    asyncwrap(listingControler.updateListings));  //put route for edit listing

router.get("/category/:categoryname",async(req,res,next)=>{
    let {categoryname}=req.params;
    console.log(categoryname);
    let alllistings=await Listing.find({});
    res.render("listings/category.ejs",{categoryname,alllistings});
    // res.send("rooms");
})


module.exports=router;