const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


const User = require('../model/userModel');
const News = require('../model/newsModel');


const app = express();
app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');
app.set('views', './views');


//authentication

const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const secretKey = 'NewsKeySecret'
router.use(session({secret: 'newsApplicationSecretKey', resave: false, saveUninitialized: true}));


router.post('/register', (req,res) => {  
        let message
        const hashedPasword = bcrypt.hashSync(req.body.password, 8);
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPasword,
        }, (err, user) => {
            if(err) return res.status(500).send('Error occured')
            message = encodeURIComponent('User Registered Succesfully');
            res.redirect('/?message=' + message)
        }) 
})


router.post('/login', (req, res)=> {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
 
        if(user) {
            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) {
                const message = encodeURIComponent('Please provide valid credentials');
                return res.status(401).redirect('/?message=' + message)
            }
            var token = jwt.sign({ id: user._id }, secretKey, {
                expiresIn: 86400 // expires in 24 hours
            });
            localStorage.setItem('authtoken', token)
            res.redirect(`/admin/addNews`);
        } else {
            const message = encodeURIComponent('Please provide valid credentials');
            res.redirect('/?message=' + message)
        }
    })
})

router.get('/logout', (req,res) => {
    localStorage.removeItem('authtoken');
    res.redirect('/');
})


router.get('/addNews', (req, res) => {
    const token = localStorage.getItem('authtoken')

    jwt.verify(token, secretKey, (err, decoded)=>{
        if (err) { res.redirect('/') }
        else {
            User.findById(decoded.id, { password: 0}, (err,user)=>{
                if (err) {res.redirect('/')}
                if (!user) {res.redirect('/')} 
                console.log('userDetails', user);
                res.render('addNews',{message:req.query.message?req.query.message:'', user:user});
            });
        }
    });

})

router.post('/submitNewNews', (req, res)=> {
    const record = req.body

    const token = localStorage.getItem('authtoken')

    jwt.verify(token, secretKey, (err, decoded)=>{
        if (err) { res.redirect('/') }
        else {
            News.create(record, (err, data)=> {
                if(err){
                    const message = encodeURIComponent('Error : ', error);
                    res.redirect('/admin/addNews/?message=' + message)
                }else{
                    const message = encodeURIComponent('News Added Successfully!');
                    res.redirect('/admin/addNews/?message=' + message)
                }
            })
        }});
})

router.get('/editNews', (req, res)=> {
    const token = localStorage.getItem('authtoken')

    jwt.verify(token, secretKey, (err, decoded)=>{
        if (err) { res.redirect('/') }
        else {
            News.find((err, data)=>{
                console.log(data);
                res.render('editNews', {newsData:data, message:req.query.message?req.query.message:''});
            })
        }})

})

router.get('/deleteNews/:id', (req,res)=>{
    const {id} = req.params
    const token = localStorage.getItem('authtoken')

    jwt.verify(token, secretKey, (err, decoded)=>{
        if (err) { res.redirect('/') }
        else {
            News.findOneAndDelete({_id: id}, (err,result)=>{
                if(err) return res.status(500).send(err)
                const message = encodeURIComponent('News Deleted Successfully');
                res.redirect('/admin/editNews?message='+ message)
            })
        }})
})



router.post('/updateNews', (req,res)=>{
    const data = req.body
    const id = data.id;

    const token = localStorage.getItem('authtoken')

    jwt.verify(token, secretKey, (err, decoded)=>{
        if (err) { res.redirect('/') }
        else {
            News.findOneAndUpdate({_id: id},{
                $set:{
                    title: req.body.title,
                    description: req.body.description,
                    imageUrl: req.body.imageUrl,
                }
            },{
                upsert: true
            }, (err,result)=>{
                if(err) return res.send(err)
                const message = encodeURIComponent('News Edited Successfully');
                res.redirect('/admin/editNews?message='+ message)
            }) 
        }});
})


router.post('/find', (req,res)=>{
    const id = req.body.id

    const token = localStorage.getItem('authtoken')

    jwt.verify(token, secretKey, (err, decoded)=>{
        if (err) { res.redirect('/') }
        else {
            News.find({_id: id}, (err,data)=>{
                if(err) res.status(500).send(err)
                else{
                    res.send(data)
                }
            })
        }});
})
module.exports = router

