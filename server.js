const app = require('express')();
const server = require('http').createServer(app);
const mongoose = require('mongoose');
const Msg = require('./models/messages');

const io = require('socket.io')(server)

const mongoDB = 'mongodb://localhost:27017';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('mongoDB connected')
}).catch(err => console.log(err))


io.on('connection', (socket) => {
    Msg.find().then(result => {
        socket.emit('output-messages', result)
    })
    console.log('a user connected');
    socket.emit('message', 'Hello world');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chatmessage', msg => {
        const message = new Msg({ msg });
        message.save().then(() => {
            io.emit('message', msg)
        })


    })
});


io.on('connection', () => { 
    console.log("socket connected");
});
server.listen(3000);

























// const mongo = require('mongodb').MongoClient;
// const client = require('socket.io').listen(4000).sockets;


// mongo.connect('mongodb://127.0.0.1/mongochat', function(err, db){
//     if(err){
//         throw err;
//     }

//     console.log('MongoDB connected...');

//     client.on('connection', function(socket){
//         let chat = db.collection('chats');
//         sendStatus = function(s){
//             socket.emit('status', s);
//         }

//         chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
//             if(err){
//                 throw err;
//             }

//             socket.emit('output', res);
//         });

//         socket.on('input', function(data){
//             let name = data.name;
//             let message = data.message;


//             if(name == '' || message == ''){
//                 sendStatus('Please enter a name and message');
//             } else {
//                 chat.insert({name: name, message: message}, function(){
//                     client.emit('output', [data]);
//                     sendStatus({
//                         message: 'Message sent',
//                         clear: true
//                     });
//                 });
//             }
//         });
//         socket.on('clear', function(data){
//             chat.remove({}, function(){
//                 socket.emit('cleared');
//             });
//         });
//     });
// });