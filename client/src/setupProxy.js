//const proxy = require("http-proxy-middleware");

// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://3.35.141.211:3000',
      changeOrigin: true,
    }),
  );
};
