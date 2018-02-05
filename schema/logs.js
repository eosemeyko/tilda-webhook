const mongoose = require('mongoose'),
    Mixed = mongoose.Schema.Types.Mixed;

const Schema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    data: Mixed,
    status: String
});

module.exports = mongoose.model('Log', Schema);