const app = require('./app')
const express = require('express')

const port = 9000;

const bodyParser =  require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

const session = require('express-session');
app.use(session({
  secret: 'tempKey',
  resave: false,
  saveUninitialized: true
}));


app.use(express.static(__dirname+'/public'))
app.set('view engine', 'ejs')
app.set('views', './views')

const Newslist = require('./model/newsModel')
const Contactuslist = require('./model/contactUsModel')


app.get('/', (req, res)=> {
    res.render('signInPage')
})

app.post('/register', (req, res)=> {
    console.log(req.body)
})
const server = app.listen(port, () => {
    console.log('Express server listening on port ' + port);
  });