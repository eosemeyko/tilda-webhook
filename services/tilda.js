const config = require('config'),
    request = require('request'),
    urlJoin = require('url-join'),
    _ = require('lodash');

/**
 * REQUEST TO API
 * @returns {*}
 */
module.exports = {
    /**
     * List of project pages
     * @param projectID
     * @returns {Promise}
     */
    getPagesList: projectID => _sendRequest('GET', '/getpageslist', {projectid: projectID}),

    /**
     * Get information about the page + full html code
     * @param {String} pageID
     * @returns {Promise}
     */
    getPageFull: pageID => _sendRequest('GET', '/getpagefull', {pageid: pageID}),

    /**
     * Get information about the page to export + full page html-code
     * @param pageID
     * @returns {Promise}
     */
    getPageFullExport: pageID => _sendRequest('GET', '/getpagefullexport', {pageid: pageID})
};

/**
 * Create request uri from API host address and passed path
 * @param {string} path
 * @private
 */
function _createRequestUri(path) {
    return urlJoin(config.api, path ? path : '');
}

/**
 * Create request option
 * @param method
 * @param data
 * @private
 */
function _createRequestOptions(method, data = {}) {
    let result = {method: method};

    // identity
    data.publickey = config.publicKey;
    data.secretkey = config.secretKey;

    if (method === 'GET') result.qs = data;
    else result.form = data;

    return result;
}

/**
 * Send request to API server
 * @param {string} method Request method
 * @param {string} [path] Repository API path
 * @param {Object} [data] Request data
 * @private {Promise.<Object|Array,Error>} Response object (or array) if fulfilled or Error if rejected
 */
function _sendRequest(method, path, data) {
    const requestUri = _createRequestUri(path),
        requestOptions = _createRequestOptions(method, data);

    return new Promise((resolve, reject) => {
        let logData = _.extend({}, data);
        delete logData.publickey;
        delete logData.secretkey;
        console.log(requestUri + ' Method: ' + method + ', Data: ' + JSON.stringify(logData));

        return request(requestUri, requestOptions, (err, response, body) => {
            if (err) return reject(err);

            resolve(body)
        });
    });
}