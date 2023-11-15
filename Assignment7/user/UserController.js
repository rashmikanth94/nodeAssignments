const express = require('express');
const router = express.Router();

const app = express();
const LocalStorage = require('node-localstorage').LocalStorage;
const config = require('../config.js');
const jwt = require('jsonwebtoken');
const localStorage = new LocalStorage('./scratch');
const User = require('../models/userModel');
const Orderlist = require('../models/orderModel')


app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');
app.set('views', './src/views');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
let currentSession;
router.get('/shoppingList',(req,res) => {
  var token = localStorage.getItem('authtoken')
  console.log("token>>>",token)
  if (!token) {
      res.redirect('/')
  } else {
    jwt.verify(token, config.secret, (err, decoded) => {
      console.log("decoded ==> ", decoded)
      if (err) {
          res.redirect('/')
      }
      User.findById(decoded.id, { password: 0 }, function (err, user) {
        if (err) {res.redirect('/')}
        if (!user) {res.redirect('/')}

        console.log("user ==> ", user)

        Orderlist.find((err,data)=>{
          if(err) res.status(500).send(err)
          else{
                  console.log("data ==> ", data)
       
                  res.render('shoppingList',
                  { invalid: req.query.invalid?req.query.invalid:'',
                    msg: req.query.msg?req.query.msg:''})
              }
          })

      });
    }
    );
  }
})

module.exports = router