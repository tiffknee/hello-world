var sensorLib = require('node-dht-sensor');
    fs = require('fs');

var delay = 2000;

var dht_sensor = {
    initialize: function () {
        return sensorLib.initialize(22, 4);
    },
    read: function () {
        var readout = sensorLib.read();

        var temp = readout.temperature.toFixed(2);
        var humid = readout.humidity.toFixed(2);

        var data = {
            "temperature" : temp,
            "humidity" : humid
        }
        
        fs.appendFile('sensor_log.json', JSON.stringify(data), (err) => {
            if (err) {
                console.error(err);
                return;
            };
            console.log('Temperature: ' + temp + 'C, ' + 'humidity: ' + humid + '%');
        });

        setTimeout(function () {
            dht_sensor.read();
        }, delay);
    }
};

if (dht_sensor.initialize()) {
    dht_sensor.read();
} else {
    console.warn('Failed to initialize sensor');
}