var Campi = require('campi'),
    app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    fs = require('fs'),
    base64 = require('base64-stream');

var campi = new Campi();

var now = new Date();
var stamp = now.getMonth()+'-'+now.getDay()+'-'+now.getHours()+'-'+now.getMinutes();

if (!fs.existsSync(stamp)){
    fs.mkdirSync(stamp);
    console.log('Folder #'+stamp+' created');
}

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function () {
    var busy = false;

    var imageCount = 0;
    var delay = 1000 * 60 * 5; //5 minutes
    var duration = 1000 * 60 * 60 * 7; //7 hours

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
    }, delay);

    var rate = 1000 * 15; //15 seconds

    setInterval(function () {
        if (!busy) {
            busy = true;
            campi.getImageAsStream({
                width: 640,
                height: 480,
                shutter: 200000,
                timeout: 1,
                nopreview: true
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
    }, rate);

});