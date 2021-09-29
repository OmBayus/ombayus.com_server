const router= require('express').Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")


router.post("/token",(req,res)=>{
    User.findOne({name:req.body.name}).then(user=>{
        if(user){
            bcrypt.compare(req.body.password, user.password, function(err, result) {
                if (result) {
                    req.session.userid = user.id
                    req.session.name = user.name
                    req.session.password = user.password
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
    if(req.session.name){
        res.json({auth:true,name:String(req.session.name)})
    }
    else{
        res.json({auth:false})
    }
    
})

router.post("/deltoken",(req,res)=>{
      req.session.userid = null
      req.session.name = null
      req.session.pass = null
      res.json(true)
})

module.exports = router