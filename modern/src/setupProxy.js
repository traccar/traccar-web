const proxy = require("http-proxy-middleware");

/**
 * Fully customizable proxy used by react-scripts
 */
module.exports = function(app) {
  app.use(proxy("/api", { target: "http://localhost:8082/", ws: true }));
};
