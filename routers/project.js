const router= require('express').Router()
const Project = require("../models/project")
const {authExactor} = require("../utils/middleware")

router.get("/getAll",(req,res)=>{
    if(req.query.status){
        Project.find({status:req.query.status},(err,items)=>{
            if(!err){
                  res.json(items)
            }
        })
        return
    }
    Project.find({},(err,items)=>{
        if(!err){
              res.json(items)
        }
    })
})

router.get("/getLength",async(req,res)=>{
    var len = await Project.count();
    res.json({len})
})

router.use(authExactor)

router.post("/add",async(req,res)=>{
    
    const newProject = new Project({
        title:req.body.title,
        href:req.body.href,
        status:req.body.status
    })

    newProject.save((err)=>{
        if(err){
            return res.json({error:"error"})
        }
        res.json(newProject)
        
    })

})


router.post("/update",(req,res)=>{
    Project.findOneAndUpdate({_id:req.body._id},{...req.body},{new:true})
    .then(updatedPost=>{
        if(!updatedPost){
            res.json({error:"error"})
            return
        }
        res.json(updatedPost)
    })
    .catch(err=> res.json({error:err.message}))
})




router.post("/del",async(req,res)=>{

    Project.findOneAndDelete({_id:req.body._id})
    .then(item=>{
        if(!item){
            res.json({error:"The project has already been deleted."})
            return
        }
        res.json(item)
    })
    .catch(err=>res.json({error:err.message}))

})

router.post("/delMany",(req,res)=>{

    Project.deleteMany({_id:{$in:req.body.projects}}).then(item=>{
        res.json(item)
    })
    .catch(err=>res.json({error:err.message}))
})




module.exports = router