#include <Servo.h>

Servo esc;

void setup() {
  Serial.begin(9600);
  esc.attach(9);
}

void loop() {
  unsigned long pulseWidth = pulseIn(3, HIGH, 25000);

  if (pulseWidth > 500) {
    esc.writeMicroseconds(pulseWidth);
  } else {
    esc.writeMicroseconds(1000); // Sécurité si pas de signal
  }

  delay(20);
}
