Humidity Chamber using Node.js
===========

a controlled environment for monitoring stuff that likes moisture


### parts

**inputs:**
+ relative humidity & temperature (DHT11/22 sensor + 4.7K ohm resistor)
+ [rPi camera](https://www.raspberrypi.org/products/camera-module-v2/)

**outputs:**
+ humidifier
+ dehumidifier
+ DC fans

**hardware:**
+ [raspberryPi 3](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/)
+ hdmi display
+ 4 channel relay


___

libraries
-----------


###### ENABLE GPIO ACCESS
```
npm install onoff --save
```

###### ENABLE SENSOR READING
```
npm install node-dht-sensor
```
this module depends on [drivers](http://www.airspayce.com/mikem/bcm2835/) for the BCM2835 chip


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


___

rPi3 gpio pinout
-----------

![reference diagram](img/pinout.png)
