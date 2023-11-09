const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

require('dotenv').config()
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const mongoose = require('mongoose')
// mongoose.set('useNewUrlParser', true) 
// mongoose.set('useFindAndModify', false)
// mongoose.set('useCreateIndex', true)

const database = mongoose.connect('mongodb://127.0.0.1:27017/Assignment5', { useNewUrlParser: true })
const orderslist = require('./model/ordersModel')

app.use(express.static(__dirname+'/public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.listen(port,()=>{
    console.log("app started on port", 4000);
})

app.get('/', (req, res)=>{
    res.render('orderform',{title:'Testing'})
})

app.post('/postOrder', (req, res)=>{
    console.log(req.body);
    const data = req.body;
    const date = Date.now();
    data['date'] = date;

    console.log(data);

    orderslist.create(data, (err, dataI)=> {
        if(err) {
            console.log(err)
        } else {
            console.log('Data inserted', dataI)
            res.send(`Data inserted Successfully ${dataI}`);
        }
    })

})


app.get('/dashboard', (req, res)=> {

    orderslist.find({},(err, data)=> {
        if(err)res.status(500).send(err);
        else {
            // console.log(data);
            const date = Date.now();
            var status;
            for(let i=0; i<data.length; i++) {
                const diff = (data[i].date - date)/1000;
                if (diff<86400) {
                    status = "In Progess"
                } 
                else if (diff>172800) {
                     status = "Delivered"
                }
                else{
                    status = "Dispatched" 
                }   
                data[i]['status']=status                 
            }
            res.render('status', {data: data})
        }
    })
})

app.get('/sendEmail/:email', (req,res)=>{
    const email = req.params.email
    orderslist.find({}, (err,data)=>{
        if(err) res.status(500).send(err)
        else{
            console.log(data);
            let status
            const date = Date.now();

            for(let i=0; i<data.length; i++) {
                const diff = (data[i].date - date)/1000;
                if (diff<86400) {
                    status = "In Progess"
                } 
                else if (diff>172800) {
                     status = "Delivered"
                }
                else{
                    status = "Dispatched" 
                }   
                data[i]['status']=status
                data[i]['orderDate']= new Date(Number(data.date)).toLocaleDateString()                 
            }
            const content = JSON.stringify(data, null, 4)
            const HTML = "<div><h3>" + content + "</h3></div>"
            const msg = {
                to: email,
                from: 'rashmikanth94@ie-sd.com',
                subject: 'Your Order Status',
                text: content,
                html: HTML,
            };
            sgMail.send(msg);
            res.send("Email sent to " + email)
        }
    })
})