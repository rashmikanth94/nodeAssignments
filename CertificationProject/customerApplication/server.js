const app = require('./app');
const express = require('express');
const request = require('request');
const axios = require('axios');



const port = 4000;
const url = 'https://api.openweathermap.org/data/2.5/weather?lat=17.38&lon=78.48&appid=52184e83b46f4e6cdaff3d729f23365e';

const bodyParser =  require('body-parser');
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');
app.set('views', './src/views');

const server = app.listen(port, () => {
  console.log('Express server listening on port ' + port);
});

require('./db')
const News = require('./models/newsModel')
const Contactuslist = require('./models/contactUsModel')


app.get("/", (req, res)=> {
  request(url, (err, response, body)=> {
      if(err){
          console.log(err);
      } else {
          output = JSON.parse(body);
          const weather = {
            description: output.weather[0].main,
            icon: "http://openweathermap.org/img/w/" + output.weather[0].icon + ".png",
            temperature: output.main.temp,
            temp_min: output.main.temp_min,
            temp_max: output.main.temp_max,
            city: output.name
        }

        News.find({}).limit(3).sort( {insertTime: -1} ).exec( (err,data)=>{
          const news = data
          console.log("news : ", news)
          res.render('landing', {
              weather,
              news
          })
  })
          // res.render("landing", {weather:weather});
      }
  })


  app.get('/aboutUs', (req,res)=> {
    res.render("aboutUs")
  })

  app.get('/contactUs', (req, res)=> {
    res.render("contactUs");
  })

  app.get('/sports', (req,res)=>{

    const d = new Date().toISOString()
    const today = d.substring(0,10)
    console.log("today : ", today)

    const apiUrl = 'https://newsapi.org/v2/top-headlines' 
    axios.get(apiUrl, {
            params: {
                sources: 'espn, nfl-news, the-sport-bible',
                from: today,
                sortBy: 'popularity',
                language: 'en',
                apiKey: '98129a2a05e845ef84fec4963493b12e'
            }
        })
        .then( (response)=>{
            const data = response.data.articles
            console.log("/sports : data => ", data)
            res.render('sports', {data})
        })
        .catch(function (error) {
            console.log(error);
        })
})

  app.post('/submitForm', (req, res)=> {
    console.log(req.body);
    
    const record = req.body
    Contactuslist.create(record  , (err, data) => {
            if(err){
                const htmlMsg = encodeURIComponent('Error : ', error);
                res.redirect('/contactUs/?msg=' + htmlMsg)
            }else{
                const htmlMsg = encodeURIComponent('ContactUs Message Saved OK !');
                res.redirect('/contactUs/?msg=' + htmlMsg)
            }
            
        }) 
    // res.render("contactUs");
  })
})