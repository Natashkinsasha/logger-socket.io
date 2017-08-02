module.exports = function (logger, options) {
    const level = options && options.level || 'info';
    //const log = options && options.log || defaultLog;
    return function (socket, next) {
        const onevent = socket.onevent;
        const ack = socket.ack;
        const emit = socket.emit;
        const onclose = socket.onclose;

        socket.onevent = function (packet) {
            logger.log(level, logEvent(
                packet.type,
                packet.nsp,
                packet.id,
                packet.data.slice(0, 1)[0],
                packet.data.slice(1, packet.data.length),
                socket
                )
            );
            onevent.call(socket, packet);
        };

        socket.ack = function (id) {
            return function () {
                logger.log(level, logAck(id, toArray(arguments), socket));
                ack.call(socket, id)([].slice.call(arguments));
            };
        };

        socket.emit = function () {
            const arr = toArray(arguments);
            if (arguments[0] === 'disconnecting' || arguments[0] === 'disconnect') {
                logger.log(level, logDisconnect(arguments[0], arguments[1], socket));
            }
            else {
                logger.log(
                    level,
                    logEmit(
                        arr.slice(0, 1)[0],
                        arr.slice(1, arr.length),
                        socket
                    )
                );
            }

            emit.call(socket, [].slice.call(arguments));
        };

        socket.onclose = function () {
            logger.log(level, logClose(socket));
            onclose.call(socket);
        };

        next();

    };
};


function logEvent(type, nsp, id, name, data, socket) {
    return {
        event: {
            type: type,
            nsp: nsp,
            id: id,
            name: name,
            data: data,
        }
    };
}

function logDisconnect(name, reason, socket) {
    var tmp = {};
    tmp[name] = {
        reason: reason,
    };
    return tmp;
}

function logAck(id, data, socket) {
    return {
        ack: {
            id: id,
            data: data
        }
    };
}

function logEmit(name, data, socket) {
    return {
        emit: {
            name: name,
            data: data,
        }
    };
}

function logClose(socket) {
    return {
        close: {}
    }
}

function toArray(obj) {
    return Object
        .keys(obj)
        .map(function (key) {
            return obj[key];
        });
}


