const express = require('express'),
    logger = require('morgan'),
    config = require('config'),
    bodyParser = require('body-parser');

/**
 * Services
 */
const mongoose = require('./services/mongoose');

/**
 * GLOBAL TYPE
 * @typedef {Function} express
 * @typedef {Function} express.use
 * @typedef {Function} express.engine
 * @typedef {Function} express.set
 * @typedef {Function} express.get
 * @type {express}
 */
const app = express();

/**
 * OPTIONS
 */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/**
 * Init Mongoose
 */
mongoose.connect({uri: config.db.uri});

/**
 * Routes
 */
app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(err.message);
});

module.exports = app;