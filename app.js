const URL = 'http://localhost'
const PORT = 8080


let http = require('http');
let fs = require('fs');



let server = http.createServer( (req, res) =>{
    fs.readFile('./index.html', 'utf-8', function (err, data) {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end(data);
    });
});

let io = require('socket.io').listen(server);

io.sockets.on('disconnect', function (socket) {
    console.log('user disconnected');
});
io.sockets.on('connect', function (socket) {
    socket.emit('new_con', 'Hello there');
    console.log('new user connected');
    socket.on('new_user', nick => {
        socket.username = nick
        socket.broadcast.emit("user_join", nick)
    })
    socket.on('client_msg', function (message) {
        message = message.toString()
        let usr = "anon"
        if (socket.username !== null) {
            usr = socket.username

        }
        socket.broadcast.emit("sent_msg", {
            from: usr, content: message
        })
    });
});



server.listen(PORT);
console.log("server running at " + URL + ":" + PORT);
