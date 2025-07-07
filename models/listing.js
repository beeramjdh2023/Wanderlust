const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const {Review}=require("./review.js");
const { string, required } = require("joi");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String,      
    },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
    },
    country:{
         type:String,
    },
    review:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true,
        },
        coordinates:{
            type:[Number],
            required:true,
        }
    },
    category:{
          type:String,
          enum:["Mountains","Farms","Rooms","Amazing Pools","Iconic Cities","Castles","Camping","Arctic"],
          required:true,
    }
});


listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing&&listing.review){
        let info=await Review.deleteMany({_id: {$in: listing.review }});
        console.log(info);
    }
    console.log("middleware running for review");    
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports={
                Listing:Listing,
                listingSchema:listingSchema,
            };       