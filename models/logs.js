const Log = require('../schema/logs');

module.exports = {
    /**
     * Create New log
     * Returns promise to be fulfilled when record created
     * @param {Object} data
     * @param {String} status
     * @returns {Promise}
     */
    create: (data, status) => {
        return new Promise((resolve, reject) => {
            if (!data) return reject('Invalid data');
            if (!status) return reject('Empty status');
            //noinspection JSUnresolvedFunction
            const newLog = new Log({data: data, status: status});
            newLog.save(err => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
};