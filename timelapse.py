from time import sleep
import datetime
import os
import picamera

duration = 5 #in hours
delay = 10 #in minutes


folder = datetime.datetime.now().strftime('%Y-%m-%d %H_%M_%S')

os.makedirs(folder)
os.chdir(folder)

print 'made folder'


camera = picamera.PiCamera()
camera.resolution = (1024, 768)

interval = delay*60 #in secs
frames = (duration*60*60) / interval #in secs

camera.start_preview()

for i in range(frames):
    camera.capture('image{0:04d}.jpg'.format(i))
    print i
    sleep(interval)

camera.stop_preview()




os.system('convert -delay 1 -loop 0 image*.jpg animation.gif')
print 'animation done'