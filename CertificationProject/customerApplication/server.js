const app = require('./app');
const express = require('express');
const request = require('request');
const axios = require('axios');
import path from 'path'
import http from 'http'
import cors from 'cors'

const port = 4000;
const url = 'https://api.openweathermap.org/data/2.5/weather?lat=17.38&lon=78.48&appid=52184e83b46f4e6cdaff3d729f23365e';

const bodyParser =  require('body-parser');
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.set('port', port);


require('./db')
const News = require('./models/newsModel')
const Contactuslist = require('./models/contactUsModel')

app.use(cors())

app.get("/", (req, res)=> {
  request(url, (err, response, body)=> {
      if(err){
          console.log(err);
      } else {
          const output = JSON.parse(body);
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
      }
  })


  app.get('/aboutUs', (req,res)=> {
    res.render("aboutUs")
  })

  app.get('/contactUs', (req, res)=> {
    res.render("contactUs",{message:req.query.message?req.query.message:''})
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
            res.render('sports', {data})
        })
        .catch(function (error) {
            console.log(error);
        })
})

  app.post('/submitForm', (req, res)=> {
    
    const record = req.body
    Contactuslist.create(record  , (err, data) => {
            if(err){
                const message = encodeURIComponent('Error : ', error);
                res.redirect('/contactUs/?message=' + message)
            }else{
                const message = encodeURIComponent('Query Submitted Succesfully!');
                res.redirect('/contactUs/?message=' + message)
            }
            
        }) 
  })
})

const server = http.createServer(app).listen(app.get('port'), () => {
  console.log("Express server listening on port " + app.get('port'));
});

const io = require('socket.io').listen(server);

let users = []

io.on('connection',  (socket) => {

  socket.on('connect', ()=>{
      console.log("New connection socket.id : ", socket.id)
  })

  socket.on('disconnect', ()=>{
      console.log("disconnect => nickname : ", socket.nickname)
      const updatedUsers = users.filter(user => user != socket.nickname)
      console.log("updatedUsers : ", updatedUsers)
      users = updatedUsers
      io.emit('userlist', users)
  })

  // nick event
  socket.on('nick', (nickname) => {
      console.log("nick => nickname : ", nickname)
      socket.nickname = nickname
      users.push(nickname)

      console.log("server : users : ", users)
      io.emit('userlist', users);
  });

  // chat event
  socket.on('chat', (data) => {
      console.log("chat => nickname : ", socket.nickname)
      const d = new Date()
      const ts = d.toLocaleString()
      console.log("ts : ", ts)
      const response = `${ts} : ${socket.nickname} : ${data.message}`
      console.log("rs : ", response)
      io.emit('chat', response)
  });
});