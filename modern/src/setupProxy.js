const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(proxy('/api/socket', { target: 'ws://' + process.env.REACT_APP_URL_NAME, ws: true }));
    app.use(proxy('/api', { target: 'http://' + process.env.REACT_APP_URL_NAME }));
};
