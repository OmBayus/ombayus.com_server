const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
      title:String,
      href:String,
      status:Boolean
})

module.exports = mongoose.model('project', projectSchema)