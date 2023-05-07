// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function(app) {
//   app.use(
//     '/api', 
//     createProxyMiddleware({
//       target: 'http://dejawo.go.ro:5000',
//       changeOrigin: true,
//     })
//   );
//   app.use(
//     '/ws', 
//     createProxyMiddleware({
//       target: 'http://localhost:3001',
//       changeOrigin: true,
//     })
//   );
// };