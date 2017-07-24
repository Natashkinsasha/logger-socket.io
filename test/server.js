const server = require('http').createServer();
const io = require('socket.io')(server);
const router = require('socket.io-events')();
const tmp = require('../index');


io.of('/endpoint').use(tmp());

io.of('/endpoint').on('connection', function (socket) {
   socket.on('event', function (test, ack) {
       socket.emit('event', {test: 'test'});
       ack({test: 'test'});
   });
});

server.listen(3000);