// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function(app) {
//   app.use(
//     '/api', 
//     createProxyMiddleware({
//       target: 'http://server:5000',
//       changeOrigin: true,
//     })
//   );
//   app.use(
//     '/socket.io', 
//     createProxyMiddleware({
//       target: 'http://server:3001',
//       changeOrigin: true,
//       ws: true
//     })
//   );
// };

