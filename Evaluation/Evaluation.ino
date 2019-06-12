    /* FSR testing sketch. 
     
    Connect one end of FSR to power, the other end to Analog 0.
    Then connect one end of a 10K resistor from Analog 0 to ground 
     
    For more information see www.ladyada.net/learn/sensors/fsr.html */


#include "DHT.h"


#define TempHumidPin 8
#define FSR_COUNT 6

int fsrPins[] = {0,1,2,3,4,5};
int fsrPin = 0;     // the FSR and 10K pulldown are connected to a0
int fsrReadings[FSR_COUNT];
int fsrReading;     // the analog reading from the FSR resistor divider
int fsrVoltages[FSR_COUNT];
int fsrVoltage;     // the analog reading converted to voltage
unsigned long fsrResistances[FSR_COUNT];
unsigned long fsrResistance;  // The voltage converted to resistance, can be very big so make "long"
unsigned long fsrConductances[FSR_COUNT];
unsigned long fsrConductance;
long fsrForces[FSR_COUNT];
long fsrForce;      // Finally, the resistance converted to force

unsigned long currentTime = 0;
unsigned long timerData = 0;
unsigned const long intervalData = (unsigned long)1000 * (unsigned long)60; //take readings every 1 min


DHT dht(TempHumidPin, DHT22);


void setup(void) {
  Serial.begin(9600);   // We'll send debugging information via the Serial monitor
  dht.begin();
}

void loop(void) {
  currentTime = millis();

  if(currentTime - timerData >= intervalData){

    // Iterate through devices (FSR_COUNT)
    for(int i = 0; i<FSR_COUNT; i++){
      Serial.print("FSR #");
      Serial.println(i);
      fsrReadings[i] = analogRead(fsrPins[i]);
      Serial.print("Analog reading = ");
      Serial.println(fsrReadings[i]);
  
      // analog voltage reading ranges from about 0 to 1023 which maps to 0V to 5V (= 5000mV)
      fsrVoltages[i] = map(fsrReadings[i], 0, 1023, 0, 5000);
      Serial.print("Voltage reading in mV = ");
      Serial.println(fsrVoltages[i]);
  
      if (fsrVoltages[i] == 0) {
        Serial.println("No pressure");  
      } else {
        // The voltage = Vcc * R / (R + FSR) where R = 10K and Vcc = 5V
        // so FSR = ((Vcc - V) * R) / V        yay math!
        fsrResistances[i] = 5000 - fsrVoltages[i];     // fsrVoltage is in millivolts so 5V = 5000mV
        fsrResistances[i] *= 10000;                // 10K resistor
        fsrResistances[i] /= fsrVoltages[i];
        Serial.print("FSR resistance in ohms = ");
        Serial.println(fsrResistances[i]);
     
        fsrConductances[i] = 1000000;           // we measure in micromhos so 
        fsrConductances[i] /= fsrResistances[i];
        Serial.print("Conductance in microMhos: ");
        Serial.println(fsrConductances[i]);
     
        // Use the two FSR guide graphs to approximate the force
        if (fsrConductances[i] <= 1000) {
          fsrForces[i] = fsrConductances[i] / 80;
          Serial.print("Force in Newtons: ");
          Serial.println(fsrForces[i]);      
        } else {
          fsrForces[i] = fsrConductances[i] - 1000;
          fsrForces[i] /= 30;
          Serial.print("Force in Newtons: ");
          Serial.println(fsrForces[i]);            
        }
        
      }
      Serial.println("--------------------");
    }
    
    Serial.println("--------------------");
    
    float humid = dht.readHumidity();
    float temp = dht.readTemperature();
    
    Serial.print("Relative Humidity in %: ");
    Serial.println(humid);
    Serial.print("Temperature in *C: ");
    Serial.println(temp);
    
    Serial.println("_______________________________________");
    timerData = millis();
  }
}
