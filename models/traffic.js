const mongoose = require('mongoose')

const trafficSchema = new mongoose.Schema({
    name:String,
    country:Object,
    logins:Object,
    lastLogins:Array
    
})

module.exports = mongoose.model('traffic', trafficSchema)