require('dotenv').config()
const mongoose = require('mongoose');

const mongodb_url = 'mongodb://127.0.0.1:27017/newsApplication';

mongoose.connect( mongodb_url, 
    { useNewUrlParser: true }).then(()=>{
        console.log("Connected to Database")
    }).catch((err) => {
        console.log("Not Connected to Database ERROR! ", err);
    })
