# logger-socket.io

Simple logger middleware for [socket.io](https://socket.io/).

# Installation

Npm
```javascript
npm install logger-socket.io
```

Yarn
```javascript
yarn add logger-socket.io
```

# Support

This library is quite fresh, and maybe has bugs. Write me an **email** to *natashkinsash@gmail.com* and I will fix the bug in a few working days.


# Quick start

```javascript
var Logger = require('logger-socket.io');
const options = {};
options.log = function (message) {
    console.log(message);
};
io.use(Logger(options));
```