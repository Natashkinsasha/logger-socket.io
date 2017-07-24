const chai = require('chai');
const socketClient = require('socket.io-client');
const server = require('./server');
const expect = chai.expect;
describe('', function () {
    const socket = socketClient('http://localhost:3000/endpoint');
    describe('', function () {
        it('', function (done) {
            socket.emit('event', {test:'test'})
        });
    });
});

