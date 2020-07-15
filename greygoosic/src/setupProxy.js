const proxy = require("http-proxy-middleware");
const pkg = require("../package.json");
const target = process.env.PROXY || pkg.proxy;

module.exports = (app) =>
  target &&
  app.use((req, res, next) =>
    req.accepts("text/html") ? next() : proxy({ target })(req, res, next)
  );
