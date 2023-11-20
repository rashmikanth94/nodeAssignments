const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newsModel = new Schema({
    title: {type:String},
    description: {type:String},
    imageUrl: {type:String}
})

// model name : newslist
// collection name : news_list
module.exports = mongoose.model('newslist', newsModel, 'news_list')