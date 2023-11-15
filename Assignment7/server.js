const app = require('./app');
const express = require('express');

const port = 9900;

const bodyParser =  require('body-parser');
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

const session = require('express-session');
app.use(session({
  secret: 'tempKey',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');
app.set('views', './src/views');

let currentSession;


app.get('/',(req,res) => {
    currentSession=req.session;
    currentSession.email=" "

    res.render('login',
      { invalid: req.query.invalid?req.query.invalid:'',
        msg: req.query.msg?req.query.msg:''})
})


const server = app.listen(port, () => {
  console.log('Express server listening on port ' + port);
});