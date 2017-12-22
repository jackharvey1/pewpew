const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const morgan = require('morgan');
const path = require('path');
const logger = require('./common/logger');
const server = require('./lib/server');

app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/main.html'));
});

httpServer.listen(process.env.PORT || 3000, () => {
    logger.log('Listening');
});

server.init(io);
