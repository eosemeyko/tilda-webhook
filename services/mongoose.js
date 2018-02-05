const mongoose = require('mongoose'),
    util = require('util');

module.exports = {
    /**
     * Connect to MongoDb
     * @param {Object|string} options Connection options or Connection URI
     * @param {string} options.uri Connection URI
     * @returns {mongoose.connection}
     */
    connect: (options) => {
        if (util.isString(options)) options = {uri: options};
        mongoose.Promise = global.Promise;
        mongoose.connect(options.uri, {
            useMongoClient: true
        });
        const db = mongoose.connection;

        db.on('error', onConnectionError);
        db.once('open', onConnectionOpen);

        return db;
    }
};

/**
 * Connection open handler
 */
function onConnectionOpen() {
    console.log('Mongoose connection established');
}

/**
 * Connection error handler
 * @param {Error} err Error object
 * @param {string} err.message Error message
 */
function onConnectionError(err) {
    console.log('Mongoose connection error: ' + err.message);
}