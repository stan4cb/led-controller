var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {

  // Initialize the RGB LED
  var led = new five.Led.RGB({
    controller: "PCA9685",
    pins: {
      red: 12,
      green: 13,
      blue: 14
    },
  });

  // RGB LED alternate constructor
  // This will normalize an array of pins in [r, g, b]
  // order to an object (like above) that's shaped like:
  // {
  //   red: r,
  //   green: g,
  //   blue: b
  // }
  // var led = new five.Led.RGB({
  //   pins: [2, 1, 0],
  //   controller: "PCA9685"
  // });

  // Add led to REPL (optional)
  this.repl.inject({
    led: led
  });

});
