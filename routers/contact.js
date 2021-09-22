const router= require('express').Router()
const Contact = require("../models/contact")
const SendMail = require("../utils/sendEmail")


router.get("/getAll",(req,res)=>{
    Contact.find({},(err,items)=>{
        if(!err){
              res.json(items)
        }
    })
})

router.post("/sendMsg",async(req,res)=>{
    
    const newMsg = new Contact({
        name:req.body.name,
        email:req.body.email,
        message:req.body.message
    })

    if(Date.now() > (req.session.sendMsg  || 0) + (1000*60*60)){
        newMsg.save((err)=>{
            if(err){
                return res.json({error:"error"})
            }
            SendMail("omerbayramcavus@gmail.com","ombayus.com Contact Message",newMsg)
            req.session.sendMsg = Date.now()
            res.json(newMsg)
            
        })
    }
    else{
        res.json({error:"You can send one message per hour."})
    }
    


})


module.exports = router