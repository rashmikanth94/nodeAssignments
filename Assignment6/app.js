import express from 'express'
import bodyParser from 'body-parser'
import e from 'express';


const port  = 9000;
const app = express();

app.use(express.static(__dirname+'/public'))
app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient
const mongoUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'Assignment5';
const collection = 'listOfBugs';

var dataBase;

MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err,client)=>{
    if(err) {
        console.log(err);
        throw err
    }
    dataBase = client.db(databaseName);
    app.listen(port, ()=>{
        console.log('App started running on', port);
    })
})

const ObjectId = require('mongodb').ObjectID


// app.get('/',(req,res)=>{
//     res.render('index',{title:'Testing'})
//     // res.send('brooo');
// })

app.post('/postBug', (req, res)=> {
    var data = req.body;
    data['createDate']= Date.now();
    data["closeTime"] = '';

    console.log(    new Date(data.createDate).toLocaleString()
    , new Date(data.closeTime).toLocaleString());

    dataBase.collection(collection).insertOne(data)
    .then( result => {
        res.redirect("/")
    })
    .catch(err => {
        res.status(500).send(`Error Message : ${err}`)
    })
})

app.get('/closeBug/:id', (req, res)=> {
    const id = req.params.id
    console.log(id);

    dataBase.collection(collection).findOne( {_id: ObjectId(id)} )
        .then(result =>{
            dataBase.collection(collection)
                .findOneAndUpdate({_id: ObjectId(result._id)},{
                    $set:{
                        title : result.title,
                        assignee : result.assignee,
                        description : result.description,
                        createTime : result.createDate,
                        closeTime: Date.now(),
                    }
                },{
                    upsert: true
                }, (err,result)=>{
                    if(err) return res.send(err)
                    res.redirect('/')
                })
        })
        .catch( err => console.error(`Error : ${err}`))

})

app.get('/', (req, res)=> {
    dataBase.collection(collection).find().toArray().then((data)=> {
        if(data.length > 0) {
            for(let i=0; i< data.length; i++) {
                if(data[i]['closeTime'] == '') {
                    data[i]['closeTime'] = Number(data[i]['createDate'])+259200000;

                if(data[i]['closeTime']<Date.now()) {
                    data[i]['status']='Expired'
                } else {
                    data[i]['status']='Open'
                }
            }
                data[i]['createdDate']=new Date(data[i].createDate).toLocaleString().split(',')[0];
                data[i]['ExpiryDate']=new Date(data[i].closeTime).toLocaleString().split(',')[0];
            }
        }

        console.log(data);
        res.render('index',{title:'Testing', data:data});
    },
    (err)=>{
        console.log(err);
    }
    )
})