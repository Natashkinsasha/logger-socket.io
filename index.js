const types = {
    0: 'CONNECT',
    1: 'DISCONNECT',
    2: 'EVENT',
    3: 'ACK',
    4: 'ERROR',
    5: 'BINARY_EVENT',
    6: 'BINARY_ACK',
};

module.exports = function (options) {
    options = options || {};
    const log = options.log || function (message) {
        console.log(message);
    };
    return function (socket, next) {
        const encode = socket.server.parser.Encoder.prototype.encode;
        socket.server.parser.Encoder.prototype.encode = function () {
            const messsage = deepCopy(arguments[0]);
            messsage.type = types[messsage.type];
            messsage.kind = 'encoded';
            log(messsage);
            return encode.apply(this, arguments);
        };

        const add = socket.server.parser.Decoder.prototype.add;
        socket.server.parser.Decoder.prototype.add = function () {
            const emit = this.emit;
            this.emit = function () {
                const messsage = deepCopy(arguments[1]);
                messsage.type = types[messsage.type];
                messsage.kind = 'decoded';
                log(messsage);
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