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
        let htmlMsg
        const hashedPasword = bcrypt.hashSync(req.body.password, 8);
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPasword,
        }, (err, user) => {
            if(err) return res.status(500).send('There was a problem registering user')
            htmlMsg = encodeURIComponent('Registered OK !');
            res.redirect('/?msg=' + htmlMsg)
        }) 
})


router.post('/login', (req, res)=> {
    console.log(req.body);
    User.findOne({ email: req.body.email }, (err, user) => {
        if(user) {
            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) {
                return res.status(401).send({ auth: false, token: null });
            }
            res.redirect(`/admin/addNews`);
        }
    })
})

router.get('/addNews', (req, res) => {
    res.render('addNews');
})

router.post('/submitNewNews', (req, res)=> {
    console.log(req.body);
    const record = req.body
    
    News.create(record, (err, data)=> {
        if(err){
            const htmlMsg = encodeURIComponent('Error : ', error);
            res.redirect('/admin/addNews/?msg=' + htmlMsg)
        }else{
            const htmlMsg = encodeURIComponent('ContactUs Message Saved OK !');
            res.redirect('/admin/addNews/?msg=' + htmlMsg)
        }
    })
})

router.get('/editNews', (req, res)=> {
    News.find((err, data)=>{
        console.log(data);
        res.render('editNews', {newsData:data});
    })

})

router.get('/deleteNews/:id', (req,res)=>{
    const {id} = req.params

    console.log("/deleteNews : id : ", id)
    News.findOneAndDelete({_id: id}, (err,result)=>{
        if(err) return res.status(500).send(err)
        res.redirect('/admin/editNews')
        console.log(result)
    })
})
module.exports = router

