const express = require( 'express');
const path = require( 'path');
const http = require('http');
const cors = require('cors');


const app = express();
app.set('port',9000);
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', (req, res)=> {
    res.render('index');
})

app.use(cors())

const server = http.createServer(app).listen(app.get('port'), () => {
    console.log("Express server listening on port " + app.get('port'));
  });
  
  const io = require('socket.io').listen(server);
  
  let users = []
  
  io.on('connection',  (socket) => {
  
    socket.on('connect', ()=>{
        console.log("New connection socket.id : ", socket.id)
    })
  
    socket.on('disconnect', ()=>{
        console.log("disconnect => nickname : ", socket.nickname)
        const updatedUsers = users.filter(user => user != socket.nickname)
        console.log("updatedUsers : ", updatedUsers)
        users = updatedUsers
        io.emit('userlist', users)
    })
  
    // nick event
    socket.on('nick', (nickname) => {
        console.log("nick => nickname : ", nickname)
        socket.nickname = nickname
        users.push(nickname)
  
        console.log("server : users : ", users)
        io.emit('userlist', users);
    });
  
    // chat event
    socket.on('chat', (data) => {
        console.log("chat => nickname : ", socket.nickname)
        const d = new Date()
        const ts = d.toLocaleString()
        console.log("ts : ", ts)
        const response = `${ts} : ${socket.nickname} : ${data.message}`
        console.log("rs : ", response)
        io.emit('chat', response)
    });
  });