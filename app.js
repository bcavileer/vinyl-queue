// HTTP Request routing library
var router = require('tiny-router'),
    // Websocket library
    ws     = require('nodejs-websocket'),
    // Use fs for static files
    fs     = require('fs'),
    // Use tessel for changing the LEDs
    tessel = require('tessel');

var portA = tessel.port.A; // Select port A
var pin   = portA.pwm[0]; // Select the first PWM pin on port A, equivalent to portA.pin[5]
var state = 0;

// Set the signal frequency to 50 Hz, or 20 mSec cycles
tessel.pwmFrequency(50);

var wsServer = ws.createServer(function(conn) {
  console.log('New connection');
  conn.on('text', function(str) {
    conn.sendText('state: ' + state);
  });
  conn.on('close', function(code, reason) {
    console.log('Connection closed');
  });
}).listen(8081);

// The router should use our static folder for client HTML/JS
router.use('static', {path: __dirname + '/static'})
// Use the onboard file system (as opposed to microsd)
    .use('fs', fs)
    // Listen on port 8080
    .listen(8080);

// When the router gets an HTTP request at /servos/[NUMBER]
router.get('/servos/{servo}', function(req, res) {
  if (state == 0) {
    pin.pwmDutyCycle(0.0275);
    state = 1;
  } else {
    pin.pwmDutyCycle(0.12);
    state = 0;
  }
  wsServer.connections.forEach(function(conn) {
    conn.sendText('state: ' + state);
  });
  // Send a response
  res.send(200);
});

console.log('Running Server');