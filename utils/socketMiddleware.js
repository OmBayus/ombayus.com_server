const jwt = require("jsonwebtoken")
const {SESSION_SECRET} = require("./config")

const authExactor = (token)=>{

    var user

    try {
        if(token){
            user = jwt.verify(token,SESSION_SECRET)
            
            if(!user){
                user = {error:"You need to sign in"}
            }
            
        }
        else{
            user = {error:"You need to sign in"}
        }
    } catch (error) {
        user = {error:"You need to sign in"}
    }
    
    return user
}

module.exports = {authExactor}