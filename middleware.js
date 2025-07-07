const { Listing } =require("./models/listing");
const { Review } = require("./models/review.js");
const {reviewSchema,listingSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");


// check user is login or not middleware
module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.originalUrl);

     if(!req.isAuthenticated()){
         if(req.method==="GET"){
           req.session.redirectingUrl=req.originalUrl;
         }
        req.flash("error","You need to login first!!");
       return res.redirect("/login");
     }
     next();
} 

// save redirect url middleware
module.exports.saveRedirectedUrl=(req,res,next)=>{
    if(req.session.redirectingUrl){
      res.locals.urltoredirect=req.session.redirectingUrl;
    }
    next();
}

// check user is owner or not middleware
module.exports.isowner=async(req,res,next)=>{
   let {id}=req.params;
   let listing=await Listing.findById(id);
   if(!res.locals.currUser._id.equals(listing.owner._id)){
      req.flash("error","you are not the owner of this listing!!");
      return res.redirect(`/listings/${id}`);
   }
   next();
}


// validate review
module.exports.validatereview=(req,res,next)=>{
     const {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join();
        console.log(errmsg);
        throw new ExpressError(400,errmsg);
    }else{
         next();
    }
}

// validate listing
module.exports.validateSchema=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
     if(error){
        // console.log(error.details[0].message);
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
     }else{
        next();
     }
}

module.exports.isauthor=async(req,res,next)=>{
   let {id,reviewid}=req.params;
   let review=await Review.findById(reviewid);
   if(!res.locals.currUser._id.equals(review.author._id)){
       req.flash("error","you are not the author of this review");
       return res.redirect(`/listings/${id}`);
   }
   next();
}