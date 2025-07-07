const {Listing}=require("../models/listing.js");
const {Review}=require("../models/review.js");


module.exports.createReview=async(req,res)=>{
      let {id}=req.params;
      let newreview=new Review(req.body.review);
      newreview.author=req.user._id;
    //   console.log(newreview);
      let place= await Listing.findById(id);
      place.review.push(newreview);
      await newreview.save();
      await place.save();
      console.log("review Submited");
      req.flash("success","Review is Added");
      res.redirect(`/listings/${id}`);
}

module.exports.deleteReview=async(req,res)=>{
       let{id,reviewid}=req.params;
       await Listing.findByIdAndUpdate(id,{$pull :{review:reviewid}});
       await Review.findByIdAndDelete(reviewid);
       console.log("review deleted");
       req.flash("success","Review is Deleted");
       res.redirect(`/listings/${id}`);
}