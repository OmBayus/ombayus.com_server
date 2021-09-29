const router= require('express').Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")
const {authExactor} = require("../utils/middleware")

router.use(authExactor)

router.get("/getAll",(req,res)=>{
    User.find({},(err,items)=>{
        if(!err){
              res.json(items)
        }
    })
})

// router.post("/add",async(req,res)=>{

//     bcrypt.hash(req.body.password, 10, function(err, hash) {
//         const newUser = new User({
//             name:req.body.name,
//             password:hash
//         })
//         newUser.save((err)=>{
//             if(err){
//                 return res.json({error:"error"})
//             }
//             res.json(newUser)
            
//         })
//       })
    
// })


module.exports = router