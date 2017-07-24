
module.exports = function (logger, options) {
    const level = options && options.level || 'info';
    const log = options && options.log || defaultLog;
    return function (socket, next) {
        const onevent = socket.onevent;
        const ack = socket.ack;
        const emit = socket.emit;
        const onclose = socket.onclose;

        socket.onevent = function (packet) {
            console.log(packet);
            onevent.call(socket, packet);
        };

        socket.ack = function (id) {
            console.log(id);
            return function () {
                console.log(arguments);
                ack.call(socket, id)([].slice.call(arguments));
            };
        };

        socket.emit = function () {
            console.log(arguments);
            emit.call(socket, [].slice.call(arguments));
        };

        socket.onclose = function () {
            onclose.call(socket);
        };

        next();

    };
};

function defaultLog() {

}

function logUp(packetEvent, id, payload) {

}

function logDown(packetEvent, id, time, ack) {

}

function logEmit(packetEvent, rooms, broadcaster, payload) {

}


function logError(packetEvent, id, time, message, stack) {

}

