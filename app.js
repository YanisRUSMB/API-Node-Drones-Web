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


// Configuration de la matrice (exemple : 3x3)
const rows = 10;
const cols = 10;
let matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

// Route pour récupérer l'état des hélices
app.get('/api/state', (req, res) => {
    res.json({ matrix });
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



app.get('/', (req, res) => {
    res.render('index');
});









