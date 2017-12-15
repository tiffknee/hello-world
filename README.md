humidity-chamber
===========

a controlled environment for monitoring stuff that likes moisture


__inputs:__
* temperature sensor
* relative humidity sensor
* rpi camera

__outputs:__
* humidifier
* dehumidifier
* fans

__hardware:__
* raspberry pi 3
* hdmi display
* relay

__other parts:__
* box (glass top, acrylic bed, wood base)


###### ENABLE GPIO ACCESS
```
sudo npm install onoff
```

###### ENABLE SENSOR MONITORING
```
sudo npm install node-dht-sensor
```


###### ENABLE PYTHON PICAMERA
```
sudo apt-get update
sudo apt-get install python-picamera
```

###### FOR COMPILING GIFS
```
apt-get install imagemagick -y
```

###### FOR COMPILING VIDEOS
```
apt-get install libav-tools -y
```
