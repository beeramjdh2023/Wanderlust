const {Listing}=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });

module.exports.index=async(req,res)=>{
    let alllistings=await Listing.find({});
    res.render("listings/index.ejs",{alllistings});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}


module.exports.showListings=async(req,res)=>{
    let {id}=req.params;
    let place=await Listing.findById(id).populate({path:"review",
        populate:{
            path:"author",
        }
    }).populate("owner");
    // console.log(place);
    if(!place){
        req.flash("error","Listing that you want to access not exit");
        res.redirect("/listings");
    }else{
        res.render("listings/show.ejs",{place});
    }
    
}

module.exports.createListing=async(req,res,next)=>{

    let coordinates= await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit:1
})
.send();
    let cordinate=coordinates.body.features[0].geometry
   console.log(cordinate);
    let {filename}=req.file;
    let url=req.file.path;
    console.log(req.file);
    let {listing}=req.body;
    req.flash("success","New Listing is Added");
    let newplace=new Listing(listing);
    newplace.owner=req.user._id;
    newplace.image={filename,url};
    newplace.geometry=cordinate;
    await newplace.save(); 
    res.redirect("/listings");

}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let originalurl=listing.image.url;
    originalurl=originalurl.replace("upload","upload/w_200");
    if(!listing){
        req.flash("error","Listing you want to edit not exist");
        res.redirect("/listings");
    }else{
        res.render("listings/edit.ejs",{listing,originalurl});
    }
}

module.exports.updateListings=async(req,res)=>{
    let {id}=req.params;
    let {listing}=req.body;
    if(typeof req.file !=="undefined"){
            let url=req.file.path;
            let filename=req.file.filename;
            listing.image={url,filename};
    }
    if(!listing){
        throw new ExpressError(400,"Please Send correct data to Add");
     }
     req.flash("success","Listing is Updated");
    await Listing.findByIdAndUpdate(id,listing,{runValidators:true});
    res.redirect("/listings"); 
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is Deleted");
    res.redirect("/listings");
}