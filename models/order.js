const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
        require:true
    },
    name:String,
    email:String,
    token:String,
    isPaid:Boolean
})

module.exports = mongoose.model('order', orderSchema)