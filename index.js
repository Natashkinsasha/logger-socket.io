module.exports = function (logger, options) {
    const level = options && options.level || 'info';
    return function (socket, next) {
        const encode = socket.server.parser.Encoder.prototype.encode;
        socket.server.parser.Encoder.prototype.encode = function () {
            console.log(arguments[0])
            logger.log(level, arguments[0]);
            return encode.apply(this, arguments);
        };
        const add = socket.server.parser.Decoder.prototype.add;
        socket.server.parser.Decoder.prototype.add = function () {
            const emit = this.emit;
            this.emit = function () {
                console.log(arguments[1])
                logger.log(level, arguments[1]);
                emit.apply(this, arguments);
            };
            return add.apply(this, arguments);
        };

        next();
    }
}