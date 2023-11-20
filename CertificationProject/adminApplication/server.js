const app = require('./app')
const express = require('express')

const port = 9000;

const bodyParser =  require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())



app.use(express.static(__dirname+'/public'))
app.set('view engine', 'ejs')
app.set('views', './views')


app.get('/', (req, res)=> {
    res.render('signInPage',{message:req.query.message?req.query.message:''})
})

const server = app.listen(port, () => {
    console.log('Express server listening on port ' + port);
  });