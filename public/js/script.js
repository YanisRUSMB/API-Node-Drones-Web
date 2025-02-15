
selectedCell = null;
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
    renderMatrix();
});

function renderMatrix() {
    getMatrix().then(matrix => {
        const container = document.getElementById('matrix');
        container.innerHTML = '';
        matrix.forEach((row, x) => {
            row.forEach((value, y) => {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                if (value === 0) {
                    cell.style.backgroundColor = `rgba(0, 0, 0, 0.4)`;
                } else {
                    const red = Math.round(255 * value);
                    const green = Math.round(255 * (1 - value));
                    cell.style.backgroundColor = `rgb(${red}, ${green}, 0)`;
                }
                if (selectedCell?.dataset.x == x && selectedCell?.dataset.y == y) {
                    cell.classList.add('selected');
                    selectedCell = cell;
                }
                container.appendChild(cell);
            });
        });

        cells = Array.from(document.getElementsByClassName('cell'));
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                if (cell.classList.contains('selected')) {
                    selectedCell?.classList.remove('selected');
                    selectedCell = null;
                    return;
                }
                selectedCell?.classList.remove('selected');
                selectedCell = cell
                cell.classList.add('selected');
            });
        });
    });
}

async function updateValue(x, y, value) {
    await request('update', 'POST', { x, y, value });
    renderMatrix();
}

async function adjustAll(value) {
    await request('control', 'POST', { adjustment: value });
    renderMatrix();
}

function handleSliderChange(event) {
    const value = parseFloat(event.target.value);
    document.getElementById('slider-value').innerText = value.toFixed(2);
    if (selectedCell) {
        return updateValue(selectedCell.dataset.x, selectedCell.dataset.y, value);
    }else {
        adjustAll(value);
    }
}
