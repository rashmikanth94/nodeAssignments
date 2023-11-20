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
        if(user) {
            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) {
                return res.status(401).send({ auth: false, token: null });
            }
            res.redirect(`/admin/addNews`);
        } else {
            res.redirect('/')
        }
    })
})

router.get('/addNews', (req, res) => {
    res.render('addNews',{message:req.query.message?req.query.message:''});
})

router.post('/submitNewNews', (req, res)=> {
    const record = req.body
    
    News.create(record, (err, data)=> {
        if(err){
            const message = encodeURIComponent('Error : ', error);
            res.redirect('/admin/addNews/?message=' + message)
        }else{
            const message = encodeURIComponent('News Added Successfully!');
            res.redirect('/admin/addNews/?message=' + message)
        }
    })
})

router.get('/editNews', (req, res)=> {
    News.find((err, data)=>{
        console.log(data);
        res.render('editNews', {newsData:data, message:req.query.message?req.query.message:''});
    })

})

router.get('/deleteNews/:id', (req,res)=>{
    const {id} = req.params

    News.findOneAndDelete({_id: id}, (err,result)=>{
        if(err) return res.status(500).send(err)
        const message = encodeURIComponent('News Deleted Successfully');
        res.redirect('/admin/editNews?message='+ message)
    })
})



router.post('/updateNews', (req,res)=>{
    const data = req.body
    const id = data.id;
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
})


router.post('/find', (req,res)=>{
    const id = req.body.id

    News.find({_id: id}, (err,data)=>{
        if(err) res.status(500).send(err)
        else{
            res.send(data)
        }
    })
})
module.exports = router

