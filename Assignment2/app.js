var express = require('express');
var fs = require('fs');
var app = express();
const PORT = 2000;

app.get('/getData',async (req, res)=>{
    fs.readFile('./movies.json',{encoding:'utf-8'}, (err, content)=> {
        if(err) throw err;
        res.send(content);
    })
})

app.listen(PORT, ()=>{
    console.log('App started running successfully on PORT:', PORT);
})