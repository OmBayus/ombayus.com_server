const router= require('express').Router()
const Project = require("../models/project")


router.get("/getAll",(req,res)=>{
    Project.find({},(err,items)=>{
        if(!err){
              res.json(items)
        }
    })
})

router.post("/add",async(req,res)=>{
    
    const newProject = new Project({
        title:req.body.title,
        href:req.body.href
    })

    newProject.save((err)=>{
        if(err){
            return res.json({error:"error"})
        }
        res.json(newProject)
        
    })
    


})


module.exports = router