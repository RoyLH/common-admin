'use strict';

const config = require('../config'),
    path = require('path'),
    http = require('http'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    socketio = require('socket.io'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);

// Define the Socket.io configuration method
module.exports = function (app, db) {
    // Create a new HTTP server
    let server = http.createServer(app);
    // Create a new Socket.io server
    let io = socketio.listen(server);
    app.set('socketio', io);

    // Create a MongoDB storage object
    let mongoStore = new MongoStore({
        db: db,
        collection: config.sessionCollection
    });

    // Intercept Socket.io's handshake request
    io.use(function (socket, next) {
        // Use the 'cookie-parser' module to parse the request cookies
        cookieParser(config.sessionSecret)(socket.request, {}, function (err) {
            // Get the session id from the request cookies
            let sessionId = socket.request.signedCookies ? socket.request.signedCookies[config.sessionKey] : undefined;

            if (!sessionId) return next(new Error('sessionId was not found in socket.request'), false);

            // Use the mongoStorage instance to get the Express session information
            mongoStore.get(sessionId, function (err, session) {
                if (err) return next(err, false);
                if (!session) return next(new Error('session was not found for ' + sessionId), false);

                // Set the Socket.io session information
                socket.request.session = session;

                // Use Passport to populate the user details
                passport.initialize()(socket.request, {}, function () {
                    passport.session()(socket.request, {}, function () {
                        if (socket.request.user) {
                            next(null, true);
                        } else {
                            next(new Error('User is not authenticated'), false);
                        }
                    });
                });
            });
        });
    });

    // Add an event listener to the 'connection' event
    io.on('connection', function (socket) {
        config.files.server.sockets.forEach(function (socketConfiguration) {
            require(path.resolve(socketConfiguration))(io, socket);
        });
    });

    config.emitMessage = function(message) {
        io.sockets.emit('message', message)
    };

    return server;
};
