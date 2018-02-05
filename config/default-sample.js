/*
* !!! Copy this file to default.js !!!
* Edit options
* */
module.exports = {
    // App options
    server: {
        port: 3003
    },

    // DB options
    db: {
        uri: "mongodb://localhost/tilda"
    },

    // http://help-ru.tilda.ws/api
    api: 'http://api.tildacdn.info/v1/',

    // https://tilda.cc/identity/apikeys/
    publicKey: 'PUBLIC_KEY',
    secretKey: 'SECRET_KEY',

    // List projects
    // http://help-ru.tilda.ws/api#getpageslist
    projects: [
        {
            id: 'PROJECT_ID',
            name: 'PROJECT_NAME',
            folders: {
                images: 'IMAGES_FOLDER',
                css: 'CSS_FOLDER',
                js: 'JS_FOLDER'
            }
        }
    ]
};