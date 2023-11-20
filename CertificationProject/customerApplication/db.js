require('dotenv').config()
const mongoose = require('mongoose');

// mongpdb atlas database name : db_media
const mongodb_url = 'mongodb://127.0.0.1:27017/newsApplication';

mongoose.connect( mongodb_url, 
    { useNewUrlParser: true }).then(()=>{
        console.log("Database connection established")
    }).catch((err) => {
        console.log("Some error occured in connecting to database! ", err);
    })
