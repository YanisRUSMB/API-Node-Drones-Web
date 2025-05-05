const express = require('express');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const path = require('path');
const { send } = require('process');
const app = express();
const port = 3000;

// Partie arduino
// Ouvre le port série (mets le bon port COM ici)
const arduinoPort = new SerialPort({
    path: 'COM4',
    baudRate: 9600
  });

const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\n' }));




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


function setSpeed(x, y, value) {
    const id = x * cols + y;

    const power = Math.round(1000 + value * 1000);
    const powerClamped = Math.max(1000, Math.min(2000, power));
  
    const command = `SET ${id} ${powerClamped}\n`;
  
    console.log('Envoi à Arduino :', command.trim());
    arduinoPort.write(command);
  
    console.log(`Commande envoyée: ${command}`);
}

// Configuration de la matrice
const rows = 10;
const cols = 10;
let matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

app.get('/api/state', (req, res) => {
    res.json({ matrix });
});

app.get('/api/clear', (req, res) => {
    matrix = matrix.map(row => row.map(() => 0));
    res.json({ success: true, matrix });
});

// Fonction utilitaire pour valider les coordonnées et valeurs
function isValidCoord(x, y) {
    return x >= 0 && x < rows && y >= 0 && y < cols;
}

function isValidValue(value) {
    return value >= 0;
}

// Route pour mettre à jour une hélice spécifique
app.post('/api/update', (req, res) => {
    const { x, y, value } = req.body;

    if (!isValidCoord(x, y)) {
        return res.status(400).json({ error: 'Coordonnées invalides' });
    }

    if (!isValidValue(value)) {
        return res.status(400).json({ error: 'Valeur hors limites' });
    }

    matrix[x][y] = value;
    res.json({ success: true });
});

app.post('/api/update/list', (req, res) => {
    const { list, value } = req.body;

    if (!Array.isArray(list)) {
        return res.status(400).json({ error: 'La liste doit être un tableau' });
    }

    if (!isValidValue(value)) {
        return res.status(400).json({ error: 'Valeur hors limites' });
    }

    list.forEach(([x, y]) => {
        if (!isValidCoord(x, y)) {
            return res.status(400).json({ error: `Coordonnées invalides: (${x}, ${y})` });
        }
        matrix[x][y] = value;
        setSpeed(x, y, value);
    });

    res.json({ success: true });
});

// Route pour ajuster globalement la puissance
app.post('/api/control', (req, res) => {
    const { adjustment } = req.body;

    if (typeof adjustment !== 'number' || !isValidValue(adjustment)) {
        return res.status(400).json({ error: 'Valeur d\'ajustement invalide' });
    }

    matrix = matrix.map(row => row.map(() => adjustment));
    res.json({ success: true, matrix });
});

// Fonction pour calculer les pixels de la ligne (Bresenham)
function getPixelsFromLine(x1, y1, x2, y2) {
    const pixels = [];
    let dx = Math.abs(x2 - x1); // distance horizontale
    let dy = Math.abs(y2 - y1); // distance verticale
    let sx = x1 < x2 ? 1 : -1; // 1 vers la droite, -1 vers la gauche
    let sy = y1 < y2 ? 1 : -1; // 1 vers le haut, -1 vers le bas
    let err = dx - dy;

    while (true) {
        pixels.push([x1, y1]);
        if (x1 === x2 && y1 === y2) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
    }

    return pixels;
}

// Route pour tracer une ligne de pixels
app.post('/api/pixels/line', (req, res) => {
    const { x1, y1, x2, y2, value } = req.body;

    if (!isValidValue(value)) {
        return res.status(400).json({ error: 'Valeur invalide' });
    }

    const pixels = getPixelsFromLine(x1, y1, x2, y2);

    pixels.forEach(([x, y]) => {
        if (isValidCoord(x, y)) {
            matrix[x][y] = value;
        }
    });

    res.json({ pixels });
});

// Route pour dessiner un rectangle
app.post('/api/pixels/rectangle', (req, res) => {
    const { x1, y1, x2, y2, value } = req.body;

    if (!isValidValue(value)) {
        return res.status(400).json({ error: 'Valeur invalide' });
    }

    if (!isValidCoord(x1, y1) || !isValidCoord(x2, y2)) {
        return res.status(400).json({ error: 'Coordonnées invalides' });
    }

    const pixels = [];
    for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {
            pixels.push([x, y]);
            matrix[x][y] = value;
        }
    }

    res.json({ pixels });
});

// Route pour dessiner un triangle
app.post('/api/pixels/triangle', (req, res) => {
    const { x1, y1, x2, y2, x3, y3, value } = req.body;

    if (!isValidValue(value)) {
        return res.status(400).json({ error: 'Valeur invalide' });
    }

    if (
        !isValidCoord(x1, y1) ||
        !isValidCoord(x2, y2) ||
        !isValidCoord(x3, y3)
    ) {
        return res.status(400).json({ error: 'Coordonnées invalides' });
    }

    const pixels = [
        ...getPixelsFromLine(x1, y1, x2, y2),
        ...getPixelsFromLine(x2, y2, x3, y3),
        ...getPixelsFromLine(x3, y3, x1, y1),
    ];

    pixels.forEach(([x, y]) => {
        matrix[x][y] = value;
    });

    res.json({ pixels });
});


app.post('/api/pixels/circle', (req, res) => {
    let { cx, cy, radius, value } = req.body;

    if (!isValidValue(value)) {
        return res.status(400).json({ error: 'Valeur invalide' });
    }

    if (radius < 1) {
        return res.status(400).json({ error: 'Rayon trop petit' });
    }

    if (!isValidCoord(cx, cy)) {
        return res.status(400).json({ error: 'Coordonnées invalides' });
    }

    const pixels = [];

    let x = radius;
    let y = 0;
    let decisionOver2 = 1 - x;

    while (y <= x) {
        const points = [
            [cx + x, cy + y],
            [cx + y, cy + x],
            [cx - x, cy + y],
            [cx - y, cy + x],
            [cx - x, cy - y],
            [cx - y, cy - x],
            [cx + x, cy - y],
            [cx + y, cy - x]
        ];

        points.forEach(([px, py]) => {
            if (isValidCoord(px, py)) {
                matrix[px][py] = value;
                pixels.push([px, py]);
            }
        });

        y++;

        if (decisionOver2 <= 0) {
            decisionOver2 += 2 * y + 1;
        } else {
            x--;
            decisionOver2 += 2 * (y - x) + 1;
        }
    }

    res.json({ pixels });
});


function animatePixelsSequential(pixels, startValue, endValue, duration) {
    const steps = 60;
    const pixelDelay = 150; // ms entre chaque pixel
    const stepInterval = duration / steps;

    pixels.forEach((pixel, index) => {
        setTimeout(() => {
            let currentStep = 0;
            const stepValue = (endValue - startValue) / steps;

            const intervalId = setInterval(() => {
                if (currentStep > steps) {
                    clearInterval(intervalId);
                    return;
                }

                const currentValue = Math.round(startValue + stepValue * currentStep);
                const [x, y] = pixel;
                console.log(`Animation pixel: (${x}, ${y}) - Valeur: ${currentValue}`);
                if (isValidCoord(x, y)) {
                    matrix[x][y] = currentValue;
                }

                currentStep++;
            }, stepInterval);
        }, index * pixelDelay);
    });
}


app.post('/api/animate/line', (req, res) => {
    const { x1, y1, x2, y2, startValue, endValue, duration } = req.body;

    if (
        !isValidCoord(x1, y1) ||
        !isValidCoord(x2, y2) ||
        typeof startValue !== 'number' ||
        typeof endValue !== 'number' ||
        typeof duration !== 'number'
    ) {
        return res.status(400).json({ error: 'Paramètres invalides' });
    }

    const pixels = getPixelsFromLine(x1, y1, x2, y2);
    animatePixelsSequential(pixels, startValue, endValue, duration);

    res.json({ success: true, pixels, message: "Animation démarrée" });
});
