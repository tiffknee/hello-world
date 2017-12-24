from time import sleep
import picamera

camera = picamera.PiCamera()
camera.resolution = (1024, 768)

camera.start_preview()
sleep(210)
camera.stop_preview()