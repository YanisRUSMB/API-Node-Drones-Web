const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.listen(port, () => {
    console.log(`API en cours d'exécution sur http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.render('index');
});

// Configuration de la matrice (exemple : 3x3)
const rows = 10;
const cols = 10;
let matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

// Route pour récupérer l'état des hélices
app.get('/api/state', (req, res) => {
    res.json({ matrix });
});

app.get('/api/clear', (req, res) => {
    matrix = matrix.map(row => row.map(val => val = 0));
    res.json({ success: true, matrix });
});

// Route pour mettre à jour une hélice spécifique
app.post('/api/update', (req, res) => {
    const { x, y, value } = req.body;
    if (x >= 0 && x < rows && y >= 0 && y < cols && value >= 0 && value <= 1) {
        matrix[x][y] = value;
        res.json({ success: true, matrix });
    } else {
        res.status(400).json({ error: 'Coordonnées invalides ou valeur hors limites' });
    }

});

app.post('/api/update/list', (req, res) => {
    const {list, value} = req.body;
    if (!Array.isArray(list)) {
        return res.status(400).json({ error: 'La liste doit être un tableau' });
    }
    list.forEach(element => {
        const [ x, y ] = element;
        if (x < 0 || x >= rows || y < 0 || y >= cols || value < 0 || value > 1) {
            return res.status(400).json({ error: 'Coordonnées invalides ou valeur hors limites' });
        }
        matrix[x][y] = value;
    });
    res.json({ success: true });


});

// Route pour ajuster globalement la puissance
app.post('/api/control', (req, res) => {
    const { adjustment } = req.body;
    if (typeof adjustment === 'number') {
        matrix = matrix.map(row => row.map(val => val = adjustment));
        res.json({ success: true, matrix });
    } else {
        res.status(400).json({ error: 'Valeur d\'ajustement invalide' });
    }
});


app.post('/api/pixels/line', (req, res) => {
    const { x1, y1, x2, y2, value } = req.body;
    if (value < 0 || value > 1) {
        return res.status(400).json({ error: 'Valeur invalide' });
    }
    
    const pixels = getPixelsFromLine(x1, y1, x2, y2);

    pixels.forEach(element => {
        const [x, y] = element;
        if (x < 0 || x >= rows || y < 0 || y >= cols || value < 0 || value > 1) {
            return res.status(400).json({ error: 'Coordonnées invalides ou valeur hors limites' });
        }
        matrix[x][y] = value;
    });
    
    res.json({ pixels });
});


app.post('/api/pixels/rectangle', (req, res) => {
    const { x1, y1, x2, y2, value } = req.body;
    if (value < 0 || value > 1) {
        return res.status(400).json({ error: 'Valeur invalide' });
    }

    if (x1 < 0 || x1 >= rows || y1 < 0 || y1 >= cols || x2 < 0 || x2 >= rows || y2 < 0 || y2 >= cols) {
        return res.status(400).json({ error: 'Coordonnées invalides ou hors limites' });
    }

    const pixels = getPixelsFromRectangle(x1, y1, x2, y2);

    pixels.forEach(([x, y]) => {
        matrix[x][y] = value;
    });

    res.json({ pixels });
});

function getPixelsFromRectangle(x1, y1, x2, y2) {
    const pixels = [];
    for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {
            pixels.push([x, y]);
        }
    }
    return pixels;
}

app.post('/api/pixels/triangle', (req, res) => {
    const { x1, y1, x2, y2, x3, y3, value } = req.body;

    if (value < 0 || value > 1) {
        return res.status(400).json({ error: 'Valeur invalide' });
    }

    if (
        x1 < 0 || x1 >= rows || y1 < 0 || y1 >= cols ||
        x2 < 0 || x2 >= rows || y2 < 0 || y2 >= cols ||
        x3 < 0 || x3 >= rows || y3 < 0 || y3 >= cols
    ) {
        return res.status(400).json({ error: 'Coordonnées invalides ou hors limites' });
    }

    const edge1 = getPixelsFromLine(x1, y1, x2, y2);
    const edge2 = getPixelsFromLine(x2, y2, x3, y3);
    const edge3 = getPixelsFromLine(x3, y3, x1, y1);

    const pixels = [...edge1, ...edge2, ...edge3];

    pixels.forEach(([x, y]) => {
        matrix[x][y] = value;
    });

    res.json({ pixels });
});


function getPixelsFromLine(x1, y1, x2, y2) {
    // Tableau pour stocker tous les pixels de la ligne
    const pixels = [];
    
    // Calcul des différences entre les coordonnées des points de départ et d'arrivée
    let dx = Math.abs(x2 - x1);  // Différence horizontale (absolue)
    let dy = Math.abs(y2 - y1);  // Différence verticale (absolue)
    
    // Calcul des directions dans lesquelles avancer
    let sx = (x2 > x1) ? 1 : -1;  // Direction horizontale (gauche ou droite)
    let sy = (y2 > y1) ? 1 : -1;  // Direction verticale (haut ou bas)
    
    // Initialisation de l'erreur initiale
    let err = dx - dy;  // Différence entre les déplacements horizontaux et verticaux
    
    // Boucle principale pour tracer la ligne
    while (true) {
        // Ajouter le pixel courant à la liste des pixels de la ligne
        pixels.push([x1, y1]);
        
        // Si le point courant est le point final, on arrête l'algorithme
        if (x1 === x2 && y1 === y2) break;
        
        // Calcul de l'erreur doublée pour déterminer quel pixel choisir
        let e2 = err * 2;
        
        // Si l'erreur est supérieure à -dy, cela signifie qu'il faut avancer horizontalement
        if (e2 > -dy) {
            err -= dy;  // Ajuster l'erreur
            x1 += sx;  // Avancer en x
        }
        
        // Si l'erreur est inférieure à dx, cela signifie qu'il faut avancer verticalement
        if (e2 < dx) {
            err += dx;  // Ajuster l'erreur
            y1 += sy;  // Avancer en y
        }
    }
    
    return pixels;
}



