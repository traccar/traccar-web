const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  const reactAppURLName = process.env.REACT_APP_URL_NAME || "localhost"
  app.use(createProxyMiddleware('/api/socket', { target: `ws://${reactAppURLName}`, ws: true }));
  app.use(createProxyMiddleware('/api', { target: `http://${reactAppURLName}` }));
};
