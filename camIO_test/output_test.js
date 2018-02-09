var onoff = require('onoff');

var Gpio = onoff.Gpio,
  humider = new Gpio(5, 'out'),
  interval;

interval = setInterval(function () { //interval will be called every 2 seconds
  var value = (humider.readSync() + 1) % 2; //Synchronously read the value of pin 4 and transform 1 to 0 or 0 to 1
  humider.write(value, function() { //Asynchronously write the new value to pin 4
    console.log("Changed humidifier state to: " + value);
  });
}, 2000);

process.on('SIGINT', function () { //listen to the event triggered on CTRL+C
  clearInterval(interval);
  humider.writeSync(0); //clean close of GPIO pin before exiting
  humider.unexport();
  console.log('bye bye ~ !!');
  process.exit();
});