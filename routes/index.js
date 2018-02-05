const _ = require('lodash'),
    config = require('config'),
    express = require('express'),
    router = express.Router();

// Models
const Logs = require('../models/logs');

// Upload Project Files
const uploadFiles = require('../upload-files');

/*
* Upgrade project
* */
router.get('/upgrade', (req, res) => {
    const data = req.query;
    Logs.create(data, 'Input upgrade project')
        .catch(err => console.log(err));

    // Check Public Key
    if (data.publickey !== config.publicKey) {
        Logs.create(data, 'Check public key fail')
            .catch(err => console.log(err));
        return res.send(false);
    }

    // Check Project ID
    const project = _.find(config.projects, {id: data.projectid});
    if (project) {
        uploadFiles.save(project, data);
        return res.send('ok')
    }

    Logs.create(data, 'Check ProjectID fail')
        .catch(err => console.log(err));
    res.send(false);
});

/**
 * Post upgrade (test Webhook on https://tilda.cc/identity/apikeys/)
 */
router.post('/upgrade', (req, res) => res.send('ok'));

module.exports = router;