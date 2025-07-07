const express=require("express");
const {Listing}=require("../models/listing.js");
const app=express();
const mongoose=require("mongoose");
const initdata=require("./data2.js");
app.listen(8080,()=>{
    console.log("server is listening on port 8080");
})
 
async function connect_to_db(){
   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

connect_to_db().then((res)=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
})


async function initdatabase() {
    await Listing.deleteMany({});
    initdata.data2=initdata.data2.map((obj)=>({
    ...obj,
    owner:'6863bfc838b7734a5594154e',
}))
    await Listing.insertMany(initdata.data2);
}

initdatabase()
.then((result)=>{
    console.log("database initialized");
})
.catch((err)=>{
    console.log(err);
})