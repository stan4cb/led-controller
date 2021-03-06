"use strict";

var pwm;
var i2cBus = require("i2c-bus");
var dr = require("pca9685");
var express = require("express");
var app = express();

var options = {
	i2c: i2cBus.openSync(1),
	address: 0x40,
	frequency: 1000,
	debug: false
};

pwm = new dr.default(options, function() {
	console.log("PWM - Initialization done");
});

app.get('/', function(req, res) { res.send('Led Controller 0.8.4 - 20/11/16'); });
app.get('/sleep', function(req, res) { set_all(g_led_param_to_pulse('10')); res.send("Sleep"); });
app.get('/:channel/:intensity', set_light );
app.get('/rgb/:r/:g/:b/:a', set_rgb );

app.listen(3000, function() { console.log('Listening on port 3000'); });


function set_rgb(req, res) {
	var r = validete_input( inverse(parseFloat( req.params.r )));
	var g = validete_input( inverse(parseFloat( req.params.g )));
	var b = validete_input( inverse(parseFloat( req.params.b )));
	var a = inverse(parseFloat( req.params.a ));

	pwm.setDutyCycle(12, r * a);
	pwm.setDutyCycle(13, g * a);
	pwm.setDutyCycle(14, b * a);

	var in_str = "RGB in to (" + r + "," + g + "," + b + "," + a + ")";
	var out_str = "RGB out to (" + (r * a) + "," + (g*a) + "," + (b*a) + "," + a + ")";

	res.send(in_str + "\n" + out_str);
}

function set_light(req, res) {
  var ch = req.params.channel;
  var intensity = req.params.intensity;

  var v_intensity = g_led_param_to_pulse(intensity);

  if(ch == 0) {
	  set_all( v_intensity );
  }
  else {
	  var n_ch = cross_fix(ch);

	  var n_value = parseInt((255 * v_intensity) + 42);

	  //pwm.setPulseRange(n_ch, n_value, 255 - n_value);
	  pwm.setDutyCycle(n_ch, v_intensity);

	if(n_ch == 12)
	  pwm.setDutyCycle(15, v_intensity);
	if(n_ch == 10)
	  pwm.setDutyCycle(11, v_intensity);
	if(n_ch == 13)
	  pwm.setDutyCycle(14, v_intensity);

	  console.log("Channel " + ch);
	  console.log("NChannel " + n_ch);
	  //console.log("Value " + n_value);
  }

  res.send("Channel" + " {" + n_ch + "} " + " is set to " + v_intensity);
}

function g_led_param_to_pulse(intensity)
{
	switch (intensity) {
		case '0':   return 0.01;
		case '15':  return 0.15;
		case '20':  return 0.2;
		case '30':  return 0.3;
		case '40':  return 0.4;
		case '50':  return 0.5;
		case '60':  return 0.6;
		case '70':  return 0.7;
		case '80':  return 0.8;
		case '90':  return 0.9;
		case '100': return 0.99;
		default: return 0.01;
	}
}

function inverse(val)
{
	return 1.0 - val;
}

function validete_input(val)
{
	return (val > 1.00 ? 1.00 : val < 0.00 ? 0.00 : val);
}

function cross_fix(ch)
{
	switch (ch) {
		case '1':  return 13;
		case '2':  return 9;
		case '3':  return 8;
		case '4':  return 12;
		case '5':  return 10;
		case '6':  return 2; // empty

		default: return 1;
	}
}

function set_all(intensity)
{
	pwm.setDutyCycle(1, intensity);
	pwm.setDutyCycle(2, intensity);
	pwm.setDutyCycle(3, intensity);
	pwm.setDutyCycle(4, intensity);
	pwm.setDutyCycle(5, intensity);
	pwm.setDutyCycle(6, intensity);
/*
	pwm.setPulseRange(1, 4095 * intensity, 4095 * (1 - intensity));
	pwm.setPulseRange(2, 4095 * intensity, 4095 * (1 - intensity));
	pwm.setPulseRange(3, 4095 * intensity, 4095 * (1 - intensity));
	pwm.setPulseRange(4, 4095 * intensity, 4095 * (1 - intensity));
	pwm.setPulseRange(5, 4095 * intensity, 4095 * (1 - intensity));
	pwm.setPulseRange(6, 4095 * intensity, 4095 * (1 - intensity));*/
}
