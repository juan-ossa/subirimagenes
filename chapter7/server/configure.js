var path = require('path'),
        routes = require('./routes'),
        exphbs = require('express3-handlebars'),
        express = require('express'),
        bodyParser = require('body-parser'),
        cookieParser = require('cookie-parser'),
        morgan = require('morgan'),
        methodOverride = require('method-override'),
        moment = require('moment'),
        multer = require('multer'),
        errorHandler = require('errorhandler');



module.exports = function (app) {
    app.engine('handlebars', exphbs.create({
        defaultLayout: 'main',
        layoutsDir: app.get('views') + '/layouts',
        partialsDir: [app.get('views') + '/partials'],
        helpers: {
            timeago: function (timestamp) {
                return moment(timestamp).startOf('minute').fromNow();
            }
        }
    }).engine);
    app.set('view engine', 'handlebars');


    app.use(morgan('dev'));

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());


//    app.use(bodyParser({uploadDir: path.join(__dirname, '../public/upload/temp')}));
    //app.use(multer({dest:'./uploads/'}).single(...));
    //app.use(multer({dest:'./uploads/'}).array(...));
    //app.use(multer({dest:'./uploads/'}).fields(...));

    app.use(multer({dest: path.join(__dirname, '../public/upload/temp')}).single('file'));



    // parse application/x-www-form-urlencoded 
//app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json 
//app.use(bodyParser.json())


    app.use(methodOverride());
    app.use(cookieParser('some-secret-value-here'));
    routes(app);//moving the routes to routes folder.

    app.use('/public/', express.static(path.join(__dirname, '../public')));
    if ('development' === app.get('env')) {
        app.use(errorHandler());
    }

    return app;
};
