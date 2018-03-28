var Campi = require('campi'),
    app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    fs = require('fs'),
    sensorLib = require('node-dht-sensor'),
    base64 = require('base64-stream');

var campi = new Campi();

var now = new Date();
var stamp = now.getMonth()+'-'+now.getDay()+'-'+now.getHours()+'-'+now.getMinutes();

//var msg = '';
var imageCount = 0;

var duration = 1000 * 60 * 60 * 7; //7 hours for wood; 3 hours for biomat
var delay = 1000 * 60 * 2; //5 minutes for wood; 2 minutes for biomat
var rate = 1000 * 15; //15 seconds for wood; 10 seconds for biomat

if (!fs.existsSync(stamp)){
    fs.mkdirSync(stamp);
    console.log('Folder #'+stamp+' created');
}

function interval(func, wait, times){
    var interv = function(w, t){
        return function(){
            if(typeof t === "undefined" || t-- > 0){
                setTimeout(interv, w);
                try{
                    func.call(null);
                }
                catch(e){
                    t = 0;
                    throw e.toString();
                }
            }
        };
    }(wait, times);

    setTimeout(interv, wait);
};

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function () {
    var busy = false;
    
 //   var imageCount = 0;
 //   var duration = 1000 * 60 * 60 * 3; //7 hours for wood; 3 hours for biomat
 //   var delay = 2000    //1000 * 60 * 2; //5 minutes for wood; 2 minutes for biomat
 //   var rate = 997 //* 10; //15 seconds for wood; 10 seconds for biomat

    console.log('listening on port 3000');

    
    var saveFrames = setInterval(function () {

        busy = true;

        campi.getImageAsFile({
            width: 1024,
            height: 768,
            nopreview: true,
            timeout: 1,
            hflip: true,
            vflip: true
        }, './'+stamp+'/'+imageCount+'.jpg', function (err) {
            if (err) {
                throw err;
            }
            console.log('Image #'+imageCount+' captured');
            imageCount++;
            busy = false;
            if (imageCount === duration/delay) {
                console.log('Captured all frames for timelapse');
                clearInterval(saveFrames);
            }
        });

        interval(function(){
        if (!busy) {
            busy = true;
            campi.getImageAsStream({
                width: 640,
                height: 480,
                shutter: 200000,
                timeout: 1,
                nopreview: true,
                hflip: true,
                vflip: true
            }, function (err, stream) {
                var message = '';

                var base64Stream = stream.pipe(base64.encode());

                base64Stream.on('data', function (buffer) {
                    message += buffer.toString();
                });

                base64Stream.on('end', function () {
                    io.sockets.emit('image', message);
                    busy = false;
                });
            });
        }
    }, rate, delay/rate);


    }, delay);

}); 


var sensorLib = require('node-dht-sensor');
    fs = require('fs');

var dht_sensor = {
	
    initialize: function () {
        return sensorLib.initialize(22, 4);
    },
    
    readlog: function () {
        var readout = sensorLib.read();
        console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
            'humidity: ' + readout.humidity.toFixed(2) + '%');
        var tstr = readout.temperature.toFixed(2) + "C" ;
        var hstr = readout.humidity.toFixed(2) + "%" ;
        //msg = tstr+hstr ; 

        var sObj = {"image_No":imageCount , "temperature":tstr , "humidity":hstr} ;

        var json = JSON.stringify(sObj);

        fs.appendFile(stamp + '/sensorlog.json',json, (err) => {
            if(err) throw err;
            console.log('appended');
            
        }
                     );
        setTimeout(function () {
            dht_sensor.readlog();
        }, 2000);
    }
};

if (dht_sensor.initialize()) {
    dht_sensor.readlog();
} else {
    console.warn('Failed to initialize sensor');
}
