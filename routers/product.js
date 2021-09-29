const router= require('express').Router()
const Product = require("../models/product")
const {authExactor} = require("../utils/middleware")

router.get("/getAll",(req,res)=>{
    Product.find({},(err,items)=>{
        if(!err){
              res.json(items)
        }
    })
})

router.use(authExactor)

router.post("/add",async(req,res)=>{
    
    const newProduct = new Product({
        title:req.body.title,
        price:req.body.price,
        description:req.body.description,
        perTime:req.body.perTime,
        features:req.body.features
    })

    newProduct.save((err)=>{
        if(err){
            return res.json({error:"error"})
        }
        res.json(newProduct)
        
    })
    
})


module.exports = router