const { createProxyMiddleware } = require("http-proxy-middleware");
const pkg = require("../package.json");
const target = process.env.PROXY || pkg.proxy;
module.exports = (app) =>
  app.use("/api",
      createProxyMiddleware({ target: target,
        changeOrigin: true
      })
  );
