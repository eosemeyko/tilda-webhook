const fs = require('fs'),
    path = require('path'),
    async = require('async'),
    request = require('request');

// Services
const Logs = require('./models/logs'),
    api = require('./services/tilda');

module.exports = {
    /**
     * Export Code to File
     * @param {Object} project
     * @param {Object} params
     * @constructor
     */
    save: function (project, params) {
        const self = this;
        api.getPageFullExport(params.pageid)
            .then(data => {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    console.log('getPageFullExport: Error Parse Json');
                    Logs.create(params, 'getPageFullExport: Error Parse Json')
                        .catch(err => console.log(err));
                    return;
                }

                if (data.status === 'ERROR')
                    return Logs.create(params, 'getPageFullExport: ERROR - ' + JSON.stringify(data.message))
                        .catch(err => console.log(err));

                // Upload directory
                const UPLOAD_DIR = path.join(process.cwd(), 'upload');
                if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
                // Project directory
                const PROJECT_DIR = path.join(UPLOAD_DIR, project.name);
                if (!fs.existsSync(PROJECT_DIR)) fs.mkdirSync(PROJECT_DIR);

                // Page name
                const page_name = data.result.alias ? data.result.alias : 'index';

                // Save Static Files
                Promise.resolve()
                    .then(() => uploadMediaFiles(project.folders.images, PROJECT_DIR, data.result.images))
                    .then(() => uploadMediaFiles(project.folders.css, PROJECT_DIR, data.result.css))
                    .then(() => uploadMediaFiles(project.folders.js, PROJECT_DIR, data.result.js))
                    .then(() => {
                        console.log('All media upload done!');
                        // Save HTML File
                        fs.writeFile(path.join(PROJECT_DIR, page_name + '.html'), data.result.html, (err) => {
                            if (err) {
                                console.log(err);
                                Logs.create(params, 'Export page to file fail')
                                    .catch(err => console.log(err));
                            }

                            console.log('Project: ' + project.name + ' file ' + page_name + '.html Page has been saved!');
                        });

                    })
                    .catch(err => {
                        console.log('Media upload fail!');
                        console.log(err);
                        Logs.create(params, 'Media upload fail ' + err)
                            .catch(err => console.log(err));

                        // Retry the export
                        setTimeout(() => self.save(project, params), 60000);
                    });
            })
            .catch(err =>
                Logs.create(params, err).catch(err => console.log(err)));
    }
};

/**
 * Upload Media Files to dir
 * @param PROJECT_DIR
 * @param ROOT
 * @param data
 * @returns {Promise}
 */
function uploadMediaFiles(PROJECT_DIR, ROOT, data) {
    return new Promise((resolve, reject) => {
        const curr_dir = path.join(ROOT, PROJECT_DIR);
        if (!fs.existsSync(curr_dir)) fs.mkdirSync(curr_dir);

        // For array
        async.eachSeries(data, (file, callback) => {
            // get file
            request.get(file.from, {encoding: null}, (err, res, body) => {
                if (err) {
                    Logs.create(file, `uploadMediaFiles: File: ${file.to}, Error: ${err}`).catch(err => console.log(err));
                    return callback(null, `uploadMediaFiles: File: ${file.to}, Error: ${err}`)
                }

                // Request Status not good
                if (res.statusCode !== 200)
                    return callback(null, `uploadMediaFiles: Status ${res.statusCode}, File: ${file.to}, Body - ${body}`);

                // Save file
                fs.writeFile(path.join(ROOT, PROJECT_DIR, file.to), body, 'utf8', err => {
                    if (err) {
                        Logs.create(file, `uploadMediaFiles: writeFile ${file.to}, Error - ${err}`).catch(err => console.log(err));
                        return callback(null, `uploadMediaFiles: writeFile ${file.to}, Error - ${err}`)
                    }

                    // Success
                    callback();
                });
            });
        }, err => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve()
        })
    })
}