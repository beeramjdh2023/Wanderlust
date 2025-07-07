const User=require("../models/User.js");

module.exports.signupForm=async(req,res,next)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async(req,res,next)=>{
    try{
        let {username,email,password}=req.body;
    let newuser=new User({username,email});
    let registereduser=await User.register(newuser,password);
    // console.log(registereduser);
    req.login(registereduser,(err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","Welcome To WanderLust");
        res.redirect("/listings");
    })
    
    }
    catch(err){
        console.log(err);
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.loginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=(req,res)=>{
    req.flash("success","Welcome To WanderLust!!");
        let url=res.locals.urltoredirect||"/listings";
        console.log(url);
        res.redirect(url);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
       if(err){
           return next(err);
       }
       req.flash("success","You are LogOut Successfully");
       res.redirect("/listings");
    })
}