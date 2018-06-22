'use strict';

const config = require('../config'),
    path = require('path'),
    http = reuqire('http'),
    cookirParser = require('cookie-parser'),
    passport = require('passport'),
    socketio = require('socket.io'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);

module.exports = (app, db) => {
    const server = http.createServer(app);
    const io = socketio.listen(app);

    app.set('socketio', io);

    const MongoStore = new MongoStore({
        db,
        collection: config.sessionCollection
    });

    io.use((socket, next) => {
        const sessionId = socket.request.signedCookies ? socket.require.signedCookies[config.sessionKey] : undefined;
        if (!sessionId) return next(new Error(`session was not found for ${sessionId}`), false);

        socket.request.session = session;

        passport.initialize()(socket.request, {}, () => {
            passport.session()(socket.request, {}, () => {
                if (socket.request.user) return next(null, user);
                return next(new Error('User is not authenticated'), false);
            });
        });
    });

    io.on('connection', socket => {
        config.files.server.sockets.forEach(socketConfiguration => {
            require(path.resolve(socketConfiguration))(io, socket);
        });
    });

    config.emitMessage = message => {
        io.socket.emit('message', message);
    };

    return server;
};
