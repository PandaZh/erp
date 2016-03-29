var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var router = require('./src/api/router');
var app = express();
var env = require('./src/envConfig');

var sessionMiddleware = require('./src/common/sessionMiddleware');
app.set('port', env == 'production' ? 8899 : 10001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API接口路由
router(app);

// Handle 404
app.use(function (req, res) {
    res.render('404', {message: ' File Not Found'});
});
// Handle 500
app.use(function (error, req, res, next) {
    //res.send('500: Internal Server Error', 500);
    if (app.get('env') === 'development') {
        res.render('500', {message: ' Internal Server Error', error: error});
    } else {
        res.render('500', {message: ' Internal Server Error', error: {}});
    }
});

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


var server = require('http').createServer(app)
var ip = '0.0.0.0';
if (app.get('env') === 'production') {
    console.log('正式环境');
}

//console.log(ip + ',Express server listening on port ' + app.get('port'))

server.listen(app.get('port'), ip,
    function () {
        console.log(ip + ',Express server listening on port ' + app.get('port'));
    });

global.app = app;
//module.exports = app;