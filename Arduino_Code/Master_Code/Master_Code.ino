const int motorPins[8] = {2, 3, 4, 5, 6, 7, 8, 9}; // Pins reliées aux executeurs
int motorPulses[8] = {1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000};

void setup() {
  Serial.begin(9600);
  for (int i = 0; i < 8; i++) {
    pinMode(motorPins[i], OUTPUT);
    digitalWrite(motorPins[i], LOW);
  }
}

void loop() {
  // 1. Lire les commandes entrantes
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();

    if (command.startsWith("SET")) {
      int firstSpace = command.indexOf(' ');
      int secondSpace = command.indexOf(' ', firstSpace + 1);

      int id = command.substring(firstSpace + 1, secondSpace).toInt();
      int power = command.substring(secondSpace + 1).toInt(); // Puissance (entre 1000 et 2000 µs)

      if (id >= 0 && id < 8) {
        motorPulses[id] = constrain(power, 1000, 2000);
      }
    }
  }

  // 2. Envoyer en boucle les impulsions vers chaque moteur
  for (int i = 0; i < 8; i++) {
    digitalWrite(motorPins[i], HIGH);
    delayMicroseconds(motorPulses[i]);
    digitalWrite(motorPins[i], LOW);
  }

  delay(5);
}