from time import sleep
import picamera


camera = picamera.PiCamera()
camera.resolution = (1024, 768)
# camera.vflip = True


camera.start_preview()

sleep(120)

camera.stop_preview()