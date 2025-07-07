const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewSchema=new Schema({
    comment:String,
    review:{
        type:Number,
        min :1,
        max:5,
    },
    CreatedAt:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});


const Review=mongoose.model("Review",reviewSchema);
module.exports={Review,reviewSchema};