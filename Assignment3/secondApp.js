const express = require('express');
const app = express();
const port = 4000;

const ReqURL = "http://5c055de56b84ee00137d25a0.mockapi.io/api/v1/employees";

app.use(express.static(__dirname+'/public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const request = require('request');


// request api without promise
app.get('/employeewithoutpromise',(req,res) => {
    request(ReqURL, (err,response,body) =>{
        if(err){
            console.log(err);
        } else {
            const data = JSON.parse(body);
            result = data
            res.render('main',{result,title:'Employees List'})
            
        }
    });
});

app.listen(port ,() => {
    console.log("app started on PORT", port)
})