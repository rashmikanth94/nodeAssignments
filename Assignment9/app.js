import express from 'express'
import bodyParser from 'body-parser'

const app = express()
const port = 3800

const MongoClient = require('mongodb').MongoClient
const mongoUrl = 'mongodb://127.0.0.1:27017'
const db_name = 'userdata'
const collection_name = 'userlist'
let db 

MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err,client)=>{
    if(err) throw err
    
    db = client.db(db_name)
    app.listen(port, () => {
        console.log('Express API is running on port ' + port)
    })
})

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('App working')
})

app.post('/addUser', (req,res) => {
    if( req.body.name ){
      db.collection(collection_name).insertOne(req.body)
        .then( result => {
            res.send("Success")
        })
        .catch(err => console.error(`Error occured: ${err}`))
    }else{
        res.sendStatus(400)
    }
    
})

app.get('/getUser/:name', (req,res)=>{
    
        const name = req.params.name
        console.log("req.params.name : ", req.params.name)

        db.collection(collection_name)
            .find({"name": name}).toArray( (err,result)=>{
            if (err) throw err
            if ( result.length ) res.send(result)
            else res.sendStatus(404)
        })
        
})
