if(process.env.NODE_ENV!="production"){
   require("dotenv").config();
}


const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const app=express();
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listingroute=require("./routes/listing.js");
const reviewroute=require("./routes/review.js");
const userroute=require("./routes/user.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport = require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/User.js");

let mongoatlasurl=process.env.ATLAS_URL;

const store=MongoStore.create({
    mongoUrl:mongoatlasurl,
    collectionName:"sessions",
    touchAfter:24*60*60,
    crypto:{
        secret:"mysecretkey",
    }
})

app.use(session({
    secret:"mysecretkey",
    store:store,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: new Date(Date.now()+7*24*60*60*1000),
        maxAge:7*24*60*60*1000, 
        httpOnly:true,
    }
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride("_method"));
let port=8080; 

app.listen(port,()=>{
    console.log(`app is listening on port ${port}`);
})

// let mongourl="mongodb://127.0.0.1:27017/wanderlust";



async function connection_to_db(){
   await mongoose.connect(mongoatlasurl);
}

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.use((req,res,next)=>{
     res.locals.success=req.flash("success");
     res.locals.error=req.flash("error");
     res.locals.currUser=req.user;
     next();
})

app.use("/listings",listingroute);
app.use("/listings/:id/review",reviewroute);
app.use("/",userroute);

connection_to_db()
.then((result)=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
})

// app.get("/",(req,res)=>{
//     res.send("root working");
// })

app.get("/demouser",async(req,res,next)=>{
    let fakeuser=new User({
        email:"fakeUser2@gmail.com",
        username:"fakeisalive2",

    });
    let responce=await User.register(fakeuser,"Beeram");
    res.send(responce);
})



const handlecasterror=(res)=>{
    res.status(400).send("Invalid input format. Please Check your data.")
}
// why not working?? find reason

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"page not found"));
// })

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!!!"));
})

app.use((err,req,res,next)=>{
    let {status=500,message="something wrong!"}=err;
    res.status(status).render("error.ejs",{message});
})