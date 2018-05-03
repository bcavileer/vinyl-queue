var tessel = require('tessel'); // Import tessel

var portA = tessel.port.A; // Select port A

var pin = portA.pwm[0]; // Select the first PWM pin on port A, equivalent to portA.pin[5]

// The starting values of each color out of 255
var state = 0;

// Set the signal frequency to 50 Hz, or 20 mSec cycles
tessel.pwmFrequency(50);

setInterval(function() {
  if (state == 0) {
    pin.pwmDutyCycle(0.0275);
    state = 1;
  } else {
    pin.pwmDutyCycle(0.12);
    state = 0;
  }

}, 500); // Set this function to be called every 500 milliseconds, or every half a second
