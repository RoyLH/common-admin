'use strict';

/**
 * Module dependencies.
 */
const config = require('../config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    favicon = require('serve-favicon'),
    responseTime = require('response-time'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),
    flash = require('connect-flash'),
    hbs = require('express-hbs'),
    expressValidator = require('express-validator'),
    path = require('path'),
    expressWinston = require('express-winston'),
    lusca = require('lusca'),
    authHelper = require(path.resolve('./config/lib/auth')),
    responseHandler = require(path.resolve('./config/lib/response'));

/**
 * Initialize local variables
 */
module.exports.initLocalVariables = function (app) {
    // Set environment
    app.set('env', config.env);

    // Setting application local variables
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    app.locals.keywords = config.app.keywords;
    app.locals.GTMTrackingID = config.app.GTMTrackingID;
    app.locals.jsLibFiles = config.files.client.lib.js;
    app.locals.cssLibFiles = config.files.client.lib.css;
    app.locals.jsAPPFiles = config.files.client.app.js;
    app.locals.cssAPPFiles = config.files.client.app.css;
    app.locals.livereload = config.livereload;
    app.locals.env = process.env.NODE_ENV;

    // Passing the request url to environment locals
    app.use((req, res, next) => {
        res.locals.host = req.protocol + '://' + req.hostname;
        res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
        next();
    });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
    // Initialize favicon middleware
    app.use(favicon(path.resolve(config.favicon)));

    // Showing response time
    app.use(responseTime());

    // Environment dependent middleware
    if (process.env.NODE_ENV === 'development') {
        config.info('================> Applying Development Configurations');
        // Disable views cache
        app.set('view cache', false);
    } else if (process.env.NODE_ENV === 'production') {
        config.info('================> Applying Production Configurations');
        app.locals.cache = 'memory';
    }
    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(expressValidator([]));
    app.use(methodOverride());
    app.use(cookieParser());
    // connect flash for flash messages
    app.use(flash());
};

/**
 * Configure view engine
 */
module.exports.initViewEngine = function (app) {
    app.engine('server.view.html', hbs.express4({
        extname: '.server.view.html'
    }));
    app.set('view engine', 'server.view.html');
    app.set('views', path.resolve('./'));
};

/**
 * Configure Express session
 */
module.exports.initSession = function (app, db) {
    // Express MongoDB session storage
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        cookie: {
            maxAge: config.sessionCookie.maxAge,
            httpOnly: config.sessionCookie.httpOnly,
            secure: config.sessionCookie.secure && config.secure.ssl
        },
        name: config.sessionKey,
        store: new MongoStore({
            db: db,
            collection: config.sessionCollection
        })
    }));

    // Add Lusca CSRF Middleware
    app.use(lusca(config.csrf));
};

/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = function (app, db) {
    config.files.server.configs.forEach((configPath) => {
        require(path.resolve(configPath))(app, db);
    });
};

/**
 * Configure Helmet headers configuration
 */
module.exports.initHelmetHeaders = function (app) {
    // six months expiration period specified in seconds
    const SIX_MONTHS = 15778476;
    app.use(helmet.frameguard());
    app.use(helmet.xssFilter());
    app.use(helmet.noSniff());
    app.use(helmet.ieNoOpen());
    app.use(helmet.hsts({
        maxAge: SIX_MONTHS,
        includeSubdomains: true,
        force: true
    }));
    app.disable('x-powered-by');
    app.use(helmet.hidePoweredBy({setTo: 'http://www.erealmsoft.com'}));
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function (app) {
    // Setting the app router and static folder
    app.use('/', express.static(path.resolve('./public'), {maxAge: 86400000}));
    app.use('/upload', express.static(path.resolve('./upload'), {maxAge: 86400000}));
    if (process.env.NODE_ENV === 'development') {
        app.use('/node_modules', express.static(path.resolve('./node_modules'), {maxAge: 86400000}));
    }

    // Globbing static routing
    config.folders.client.forEach((staticPath) => {
        app.use(staticPath, express.static(path.resolve('./' + staticPath)));
    });
};

/**
 * Configure the modules ACL policies
 */
module.exports.initModulesServerPolicies = function (app) {
    // Globbing policy files
    authHelper.init();
};


/**
 * Configure the public API routes
 */
module.exports.initPublicAPIRoutes = function (app) {

    // Globbing API routing
    config.files.server.APIRoutes.forEach((APIRoutePath) => {
        app.use('/api/base', require(path.resolve(APIRoutePath)));
    });

};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = function (app) {
    app.use((req, res, next) => {
        config.info('Request: ', req.originalUrl);
        next();
    });

    // Globbing routing files
    config.files.server.routes.forEach(function (routePath) {
        require(path.resolve(routePath))(app);
    });
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function (app) {
    // express-winston errorLogger makes sense AFTER the router.
    app.use(expressWinston.errorLogger(config.logger));

    // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use((err, req, res, next) => {

        // If the error object doesn't exists, treat as 404
        if (!err) {
            return next();
        }

        console.error(err.stack);
        if (typeof err === 'string') {
            return res.status(200).send(responseHandler.getResponseData({
                code: err
            }));
        }

        if (Number(err.code) >= 100000 && Number(err.code) <= 200000) {
            return res.status(200).send(responseHandler.getResponseData({
                code: err.code,
                messageInfo: err.messageInfo
            }));
        }

        if (req.xhr || req.isAPI || (config.env === 'test')) {
            if (err.name === 'MongoError') {
                return res.status(400).send(responseHandler.getMongoErrorMessage(err));
            } else if (err.name === 'APIError') {
                return res.status(err.status).send(responseHandler.getResponseData({
                    code: err.code,
                    messageInfo: err.messageInfo,
                    stack: err.stack
                }));
            } else {
                return res.status(500).send(responseHandler.getResponseData({code: '500', stack: err.stack}));
            }
        } else {
            // Error page
            return res.status(500).render('modules/core/server/views/500', {
                error: 'The server is currently unavailable.'
            });
        }
    });
};

/**
 * Configure Socket.io
 */
module.exports.configureSocketIO = function (app, db) {
    // Load the Socket.io configuration
    let server = require('./socket.io')(app, db);

    // Return server object
    return server;
};

/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
    // Initialize express app
    let app = express();

    // Initialize local variables
    this.initLocalVariables(app);

    // Initialize Express middleware
    this.initMiddleware(app);

    // Initialize Express view engine
    this.initViewEngine(app);

    // Initialize Express session
    this.initSession(app, db);

    // Initialize Modules configuration
    this.initModulesConfiguration(app);

    // Initialize Helmet security headers
    this.initHelmetHeaders(app);

    // Initialize modules static client routes
    this.initModulesClientRoutes(app);

    // Initialize modules server authorization policies
    this.initModulesServerPolicies(app);

    // Initialize public API routes
    this.initPublicAPIRoutes(app);

    // Initialize modules server routes
    this.initModulesServerRoutes(app);

    // Initialize error routes
    this.initErrorRoutes(app);
    // Configure Socket.io
    app = this.configureSocketIO(app, db);

    return app;
};
