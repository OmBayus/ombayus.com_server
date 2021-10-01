const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
      title:String,
      price:Number,
      description:String,
      perTime:String,
      features:Array,
      status:Boolean
      
})

module.exports = mongoose.model('product', productSchema)