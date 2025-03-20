
selectedCell = [];
cells = null;

async function request(endpoint, method, body) {
    const response = await fetch(`http://localhost:3000/api/${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return await response.json();
}

async function getMatrix() {
    return (await request('state', 'GET')).matrix;
}

addEventListener("DOMContentLoaded", () => {
    createMatrix();
    document.getElementById('slider').addEventListener('input', handleSliderChange);
    document.getElementById('clear').addEventListener('click', clearMatrix);
    document.getElementById('line').addEventListener('click', () => {
        if (selectedCell.length < 2 || selectedCell.length > 2) {
            alert('Sélectionnez exactement 2 cellules pour dessiner une ligne');
            return;
        }
        const x1 = parseInt(selectedCell[0].dataset.x);
        const y1 = parseInt(selectedCell[0].dataset.y);
        const x2 = parseInt(selectedCell[selectedCell.length - 1].dataset.x);
        const y2 = parseInt(selectedCell[selectedCell.length - 1].dataset.y);
        drawLine(x1, y1, x2, y2, parseFloat(document.getElementById('slider').value));
    }
    );
});


function clearMatrix() {
    request('clear', 'GET').then(() => createMatrix());
}

function createMatrix() {
    getMatrix().then(matrix => {
        const container = document.getElementById('matrix');
        container.innerHTML = '';
        matrix.forEach((row, x) => {
            row.forEach((value, y) => {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                updateCell(cell, value);
                container.appendChild(cell);
            });
        });

        cells = Array.from(document.getElementsByClassName('cell'));
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                if (cell.classList.contains('selected')) {
                    removeSelectedCell(cell);
                    return;
                }
                addSelectedCell(cell);
            });
        });
    });
}

function renderEngine(x, y, value){
   updateCell(cells.find(cell => cell.dataset.x == x && cell.dataset.y == y), value);
    
}

function updateCell(cell, value) {
    if (value === 0) {
        cell.style.backgroundColor = `rgba(0, 0, 0, 0.4)`;
    } else {
        const red = Math.round(255 * value);
        const green = Math.round(255 * (1 - value));
        cell.style.backgroundColor = `rgb(${red}, ${green}, 0)`;
    }
    const isSelected = this.selectedCell.find(c => c.dataset.x == cell.dataset.x && c.dataset.y == cell.dataset.y);
    if (isSelected) {
        removeSelectedCell(isSelected);
        addSelectedCell(cell);
    }   
}


function addSelectedCell(cell) {
    cell.classList.add('selected');
    selectedCell.push(cell);
}

function removeSelectedCell(cell) {
    cell.classList.remove('selected');
    selectedCell = selectedCell.filter(c => c.dataset.x != cell.dataset.x || c.dataset.y != cell.dataset.y);
}

async function updateValue(x, y, value) {
    const response = await request('update', 'POST', { x, y, value });
    if (response.success) {
        renderEngine(x, y, value);
    }
}

async function updateList(list, value) {
    const response = await request('update/list', 'POST', { list, value });
    if (response.success) {
        list.forEach(element => {
            renderEngine(element[0], element[1], value);
        });
    }
}

async function adjustAll(value) {
    await request('control', 'POST', { adjustment: value });
    cells.forEach(cell => {
        renderEngine(cell.dataset.x, cell.dataset.y, value);
    });
}

async function drawLine(x1, y1, x2, y2, value) {
    const response = await request('pixels/line', 'POST', { x1, y1, x2, y2, value });
    response.pixels.forEach(pixel => {
        renderEngine(pixel[0], pixel[1], value);
    });
}


function handleSliderChange(event) {
    const value = parseFloat(event.target.value);
    document.getElementById('slider-value').innerText = value.toFixed(2);
    if (selectedCell.length > 0) {
        const list = selectedCell.map(cell => {
            return [ parseInt(cell.dataset.x), parseInt(cell.dataset.y) ];
        });
        updateList(list, value);
    }else {
        adjustAll(value);
    }
}
