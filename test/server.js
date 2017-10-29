const server = require('http').createServer();
const Server = require('socket.io');
const winston = require('winston');
const router = require('socket.io-events')();
const tmp = require('../index');
const winstonJsonevent = require('winston-jsonevent');

const io = new Server({
});
const encode = io.encoder.encode;


const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: function () {
                return new Date();
            },
            formatter: winstonJsonevent
        })
    ],
});

io.of('/endpoint').use(tmp(logger));

io.of('/endpoint').on('connection', function (client) {
    client.on('fox', function (tiger, ack) {
        console.log('sdfgdgh')
        ack && ack(tiger, 'ddg');
    });

    client.on('stork', function (bear) {
        io.of('/endpoint').emit('frog', {bear: bear});
    });

    client.on('disconnecting', function (reason) {
        console.log('34456576')
    });
});

io.listen(3000);