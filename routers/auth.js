const router= require('express').Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {SESSION_SECRET} = require("../utils/config")


router.post("/token",(req,res)=>{
    User.findOne({name:req.body.name}).then(user=>{
        if(user){
            bcrypt.compare(req.body.password, user.password, function(err, result) {
                if (result) {
                    const token = jwt.sign({name:req.body.name},SESSION_SECRET,{expiresIn:"1h"});

                    const tokenOptions = process.env.NODE_ENV === "production" ? {
                        httpOnly:true,
                        secure:true,
                        maxAge:1000000,
                        signed:true
                    } : {};

                    

                    res.cookie("token",token,tokenOptions)

                    res.json({auth:true})
                }
                else {
                    res.json({auth:false})
                }
            });
        }
        else{
            res.json({auth:false})
        }
    })
      
})

router.post("/auth",(req,res)=>{
    const token = req.cookies.token;

    try {
        if(token){
        const user = jwt.verify(token,SESSION_SECRET)
        return res.json({auth:true,name:user.name})
        }   
    } catch (error) {

    }

    res.json({auth:false})
    
})

router.post("/deltoken",(req,res)=>{
    res.clearCookie("token")
    res.json(true)
      
})

module.exports = router
