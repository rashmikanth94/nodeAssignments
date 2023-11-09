var mongoose = require('mongoose')
Schema = mongoose.Schema

var ordersModel = new Schema({
    name: {type:String},
    email: {type:String},
    address: {type:String},
    productName: {type:String},
    productPrice: {type:String},
    quantity: {type:String},
    date: {type:String}
})

// model name : orderlist
// collection name : orderlist
module.exports = mongoose.model('orderlist', ordersModel, 'orderlist')