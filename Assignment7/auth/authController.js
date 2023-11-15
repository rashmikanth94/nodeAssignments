const express = require('express');
const router = express.Router();

const app = express();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const config = require('../config');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');
app.set('views', './src/views');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/register', (req, res) => {
    console.log("/register : req.body ==> ", req.body)
    let htmlMsg;
    User.create({
        name: req.body.username,
        password: req.body.password,
        role: "normal"
    }, (err, user) => {
        if(err) return res.status(500).send('There was a problem registering user')
        htmlMsg = encodeURIComponent('Registered OK !');
        res.redirect('/?msg=' + htmlMsg)
    })
});


router.post('/login', (req, res) => {
    User.findOne({ name: req.body.username }, (err, user) => {
      if (err) return res.status(500).send('Error on the server.');
      let htmlMsg
      if (!user) { 
        htmlMsg = encodeURIComponent('User not found, try again ...');
        res.redirect('/?invalid=' + htmlMsg);
      }else{
        const passwordIsValid = req.body.password == user.password;
        if (!passwordIsValid) {
          return res.status(401).send({ auth: false, token: null });
        }

        var token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
      });
      localStorage.setItem('authtoken', token)

        if(user.role == 'admin'){
          res.redirect(`/admin/userDashboard`)
        }else{
          res.redirect(`/users/shoppingList`);
        }
      }
    });
});


module.exports = router
