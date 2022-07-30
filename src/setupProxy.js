const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://socialsocialmedia.surge.sh/",
      changeOrigin: true,
    })
  );
};
