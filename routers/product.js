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

router.get("/getLength",async(req,res)=>{
    var len = await Product.count();
    res.json({len})
})

router.use(authExactor)


router.post("/add",async(req,res)=>{
    
    const newProduct = new Product({
        title:req.body.title,
        price:req.body.price,
        description:req.body.description,
        perTime:req.body.perTime,
        features:req.body.features,
        status:req.body.status
    })

    newProduct.save((err)=>{
        if(err){
            return res.json({error:"error"})
        }
        res.json(newProduct)
        
    })
    
})

router.post("/update",(req,res)=>{
    Product.findOneAndUpdate({_id:req.body._id},{...req.body},{new:true})
    .then(updatedProduct=>{
        if(!updatedProduct){
            res.json({error:"error"})
            return
        }
        res.json(updatedProduct)
    })
    .catch(err=> res.json({error:err.message}))
})

router.post("/del",async(req,res)=>{

    Product.findOneAndDelete({_id:req.body._id})
    .then(item=>{
        if(!item){
            res.json({error:"The product has already been deleted."})
            return
        }
        res.json(item)
    })
    .catch(err=>res.json({error:err.message}))

})

router.post("/delMany",(req,res)=>{

    Product.deleteMany({_id:{$in:req.body}}).then(item=>{
        res.json(item)
    })
    .catch(err=>res.json({error:err.message}))
})


module.exports = router