
# Documentation de l'API

## Routes

### 1. `/` - Page d'accueil
- **Méthode** : `GET`
- Affiche la page d'accueil (`index.ejs`).

### 2. `/api/state` - Récupérer l'état de la matrice
- **Méthode** : `GET`
- **Réponse** :
  - `matrix`: La matrice actuelle.

**Exemple de réponse** :
```json
{
  "matrix": [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ...]
}
```

### 3. `/api/clear` - Réinitialiser la matrice
- **Méthode** : `GET`
- **Réponse** :
  - `success`: Un booléen indiquant si l'opération a réussi.
  - `matrix`: La matrice après réinitialisation (tous les éléments sont à 0).

**Exemple de réponse** :
```json
{
  "success": true,
  "matrix": [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ...]
}
```

### 4. `/api/update` - Mettre à jour une hélice spécifique
- **Méthode** : `POST`
- **Paramètres du corps de la requête** :
  - `x`: Coordonnée x de la matrice (entier).
  - `y`: Coordonnée y de la matrice (entier).
  - `value`: Valeur à attribuer à la position spécifiée (entier).

**Exemple de réponse** :
```json
{
  "success": true,
  "matrix": [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ...]
}
```

### 5. `/api/update/list` - Mettre à jour plusieurs hélices à la fois
- **Méthode** : `POST`
- **Paramètres du corps de la requête** :
  - `list`: Liste de coordonnées (tableau de tableaux `[x, y]`).
  - `value`: Valeur à attribuer aux positions spécifiées (entier).

**Exemple de réponse** :
```json
{
  "success": true,
  "matrix": [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ...]
}
```

### 6. `/api/control` - Ajuster globalement la puissance
- **Méthode** : `POST`
- **Paramètres du corps de la requête** :
  - `adjustment`: Valeur d'ajustement à appliquer à toute la matrice (entier).

**Exemple de réponse** :
```json
{
  "success": true,
  "matrix": [[adjustment, adjustment, ..., adjustment], ...]
}
```

### 7. `/api/pixels/line` - Tracer une ligne de pixels
- **Méthode** : `POST`
- **Paramètres du corps de la requête** :
  - `x1, y1`: Coordonnées de départ.
  - `x2, y2`: Coordonnées de fin.
  - `value`: Valeur à appliquer aux pixels de la ligne.

**Exemple de réponse** :
```json
{
  "pixels": [[x1, y1], [x2, y2], ...]
}
```

### 8. `/api/pixels/rectangle` - Dessiner un rectangle
- **Méthode** : `POST`
- **Paramètres du corps de la requête** :
  - `x1, y1`: Coordonnées du coin supérieur gauche.
  - `x2, y2`: Coordonnées du coin inférieur droit.
  - `value`: Valeur à appliquer aux pixels du rectangle.

**Exemple de réponse** :
```json
{
  "pixels": [[x1, y1], [x2, y2], ...]
}
```

### 9. `/api/pixels/triangle` - Dessiner un triangle
- **Méthode** : `POST`
- **Paramètres du corps de la requête** :
  - `x1, y1`: Coordonnées du premier sommet.
  - `x2, y2`: Coordonnées du deuxième sommet.
  - `x3, y3`: Coordonnées du troisième sommet.
  - `value`: Valeur à appliquer aux pixels du triangle.

**Exemple de réponse** :
```json
{
  "pixels": [[x1, y1], [x2, y2], [x3, y3], ...]
}
```

## Erreurs
Les erreurs suivantes peuvent être renvoyées par l'API :
- **400 Bad Request** : Paramètres invalides ou manquants.
- **400 Bad Request** : Coordonnées ou valeurs hors limites.
- **400 Bad Request** : La liste doit être un tableau (pour les mises à jour en liste).

---
