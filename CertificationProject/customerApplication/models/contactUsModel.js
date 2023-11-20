const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contactusModel = new Schema({
    name: {type:String},
    email: {type:String},
    query: {type:String},
})

module.exports = mongoose.model('contactus', contactusModel, 'contactus_list')