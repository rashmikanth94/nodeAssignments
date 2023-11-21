const express = require('express');
const app = express();
const port = 9999;
const axios = require('axios');

const API_URL = 'https://api.github.com/users/';



const bodyParser =  require('body-parser');
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');
app.set('views', './src/views');


app.post('/getDetails', (req, res)=> {
    // res.send('App');
    const username = req.body.username;
    axios.get(API_URL+username).then((response)=> {
        console.log(response.data);
        const responseJSON = response.data;
        const data = JSON.stringify({ source: 'Docker Microservice', ...responseJSON, })
        res.render('index',{data:data});

    })
    .catch((error)=> {
        console.log(error);
    })
})

app.get('/', (req, res)=> {
    res.render('index', {data:''});
})
app.listen(port, ()=> {
    console.log('App started on port', port);
})