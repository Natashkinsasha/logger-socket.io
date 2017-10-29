const types = {
    0: 'CONNECT',
    1: 'DISCONNECT',
    2: 'EVENT',
    3: 'ACK',
    4: 'ERROR',
    5: 'BINARY_EVENT',
    6: 'BINARY_ACK'
};

module.exports = function (options) {
    options = options || {};
    const log = options.log || function (message) {
        console.log(message);
    };
    return function (socket, next) {
        socket.client.encoder.encode = function () {
            const message = deepCopy(arguments[0]);
            message.type = types[message.type];
            message.kind = 'encoded';
            message.socket = {
                id: socket.id,
                handshake: socket.handshake
            };
            log(message);
            return encode.apply(this, arguments);
        };

        const add = socket.client.decoder.add;
        socket.client.decoder.add = function () {
            const emit = this.emit;
            this.emit = function () {
                const message = deepCopy(arguments[1]);
                message.type = types[message.type];
                message.kind = 'decoded';
                message.socket = {
                    id: socket.id,
                    handshake: socket.handshake
                };
                log(message);
                emit.apply(this, arguments);
            };
            return add.apply(this, arguments);
        };

        next();
    }
};

const deepCopy = function (obj) {
    if (typeof obj != "object") {
        return obj;
    }

    var copy = obj.constructor();
    for (var key in obj) {
        if (typeof obj[key] == "object") {
            copy[key] = deepCopy(obj[key]);
        } else {
            copy[key] = obj[key];
        }
    }
    return copy;
};