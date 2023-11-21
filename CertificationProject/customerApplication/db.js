require('dotenv').config()
const mongoose = require('mongoose');

const mongodb_url = 'mongodb+srv://rashmikanth94:F66nSTn5YwARAv8V@cluster0.rrpksui.mongodb.net/newsApplication?authSource=admin';

mongoose.connect( mongodb_url, 
    { useNewUrlParser: true }).then(()=>{
        console.log("Database connection established")
    }).catch((err) => {
        console.log("Some error occured in connecting to database! ", err);
    })
