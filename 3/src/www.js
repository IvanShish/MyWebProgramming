/**
 * Module dependencies.
 */

var app = require('./app');
var https = require('https');
var fs = require('fs');

var key = fs.readFileSync('C:/Users/Ivan/PhpstormProjects/keys/example.key', 'utf8');
var crt = fs.readFileSync('C:/Users/Ivan/PhpstormProjects/keys/example.crt', 'utf8');
var pair = {
  key: key,
  cert: crt
};

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var httpsServer = https.createServer(pair, app);
httpsServer.listen(port);

/**
 * Listen on provided port, on all network interfaces.
 */

// server.listen(port);
// server.on('error', onError);
// server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
