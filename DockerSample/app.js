const express = require('express');

const axios = require('axios')
const app = express()

const PORT = '8080';
const HOST = '0.0.0.0';


const url = 'https://restcountries.com/v3.1/all';


app.get('/', (req, res)=> {
    axios.get(url).then((response)=> {
        // res.send(response.data);
        const responseJson = response.data
        res.status(200).json({source: 'Docker Microservice', ...responseJson});
    })
    .catch((err)=> {
        console.log(err);
    })
})

app.listen(PORT, HOST, ()=> {
    console.log('App started');
});