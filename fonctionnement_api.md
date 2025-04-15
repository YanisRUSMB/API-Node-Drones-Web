# Fonctionnement de l'API

Actuellement, l'API simule une matrice de **10x10** pour représenter l'état des drones. Cette matrice servira dans un futur proche à simuler les coordonnées des drones. Une fois cette simulation en place, l'API contrôlera directement les drones via un contrôleur qui permettra de mettre à jour leur position et état.

- **Mise à jour des drones** : 
  - Le front-end enverra des requêtes à l'API pour mettre à jour l'état des drones. Le back-end traitera ces requêtes et mettra à jour la matrice des drones en conséquence.
  - L'API renverra ensuite la matrice mise à jour, permettant ainsi au front-end de refléter l'état des drones sur l'interface utilisateur.

- **Requêtes plus complexes** (telles que `line`, `rectangle`, etc.) : 
  - Pour les requêtes plus complexes, comme le dessin d'une ligne ou d'un rectangle, l'API mettra à jour les coordonnées des drones spécifiés et renverra les coordonnées de ceux qui ont été modifiés.
  - Cela permettra au front-end de mettre à jour l'interface utilisateur en fonction des drones affectés par l'action (par exemple, l'ajout ou la suppression de drones dans une certaine zone).

# Gestion des Animations

Les **animations et effets temporels** peuvent être gérés côté back-end. L'API peut exécuter des effets comme des changements progressifs de valeurs ou des animations dans le temps, en utilisant des techniques comme `setTimeout` ou `setInterval`. 

- **Planification des animations** : 
  - Le back-end peut gérer ces animations en contrôlant les drones et en mettant à jour leur état de manière progressive.
  - Les coordonnées des drones modifiés seront envoyées au front-end pour qu'il puisse synchroniser l'interface utilisateur avec les changements d'état des drones.

# Librairies pour le Contrôle des Affichages LED

Après avoir exploré diverses librairies pour contrôler des affichages via une **Arduino** ou un **Raspberry Pi**, il a été constaté que ces librairies ne répondent pas à tous nos besoins. Elles sont principalement utilisées pour contrôler directement les pixels de l'affichage (changer les couleurs, etc.), mais ne permettent pas de dessiner des formes prédéfinies ou d'effectuer des calculs plus complexes comme ceux requis pour le contrôle des drones dans le cadre de cette API.

- **Solutions proposées** :
  - **Les librairies existantes** permettent de manipuler des pixels individuels, mais ce genre de manipulation peut être entièrement réalisé en **JavaScript** (y compris pour les animations ou effets).
  - Cela offre plus de flexibilité et permet de mieux contrôler les drones et de simuler les animations sans avoir à dépendre de matériels spécifiques.

