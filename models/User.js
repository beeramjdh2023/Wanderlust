const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportlocalmongoose=require("passport-local-mongoose");
const UserSchema=new Schema({
    email:{
        type:String,
        required:true,
    }
});


UserSchema.plugin(passportlocalmongoose);
const User=mongoose.model("User",UserSchema);

module.exports=User;