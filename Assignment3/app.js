const e = require('express');
const express = require('express');
const fs = require('fs');
var app = express();
const PORT = 3000;
const request = require('request');

app.use(bodyParser.json())

app.listen(PORT, (err, data)=> {
    if(err) throw err;
    console.log('App started on PORT:', PORT);
})

app.get('/employee/:id', (req, res)=> {
    const {id} = req.params;
    fs.readFile('./data/employee.json',{encoding:'utf-8'}, (err, data)=> {
        if(err) throw err;
        data = JSON.parse(data);
        var result = null;
        for(let i=0; i<data.length; i++) {
            if(data[i].id == id) {
                result = data[i];
                break;
            }
        }
        if(result) {
            res.send(result);
        } else {
            res.status(404).send({error:'Not found'});
        }
    })
})

app.get('/project/:id', (req, res)=> {
    const {id} = req.params;
    fs.readFile('./data/project.json',{encoding:'utf-8'}, (err, data)=> {
        if(err) throw err;
        data = JSON.parse(data);
        var result = null;
        for(let i=0; i<data.length; i++) {
            if(data[i].projectId == id) {
                result = data[i];
                break;
            }
        }
        if(result) {
            res.send(result);
        } else {
            res.status(404).send({error:'Not found'});
        }
    })})



app.get('/getemployeedetails/:id', async (req, res)=> {
    const {id} = req.params;
    const url = 'http://localhost:3000/employee/'+id;
    console.log(url);
    // console.log(request(url));
    // request(url,{json:true},(err, response)=> {
    //     if(err) {
    //         console.log(err);
    //     }
    //     console.log(response);
    // })
    // res.send(url);
    try {
        const response = await fetch(url);
        const employee = await response.json();
        console.log(employee);

        const Url  = "http://localhost:3000/project/" + employee.projectId;
        const empresponse = await fetch(Url);
        const projectData = await empresponse.json();

        const endRes = {
            ...employee,
            ...projectData,
        }

        res.send(endRes);
    } catch {
        console.log("getData: ",error);
    }
})
