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
            const rowDiv = document.createElement('div');
            row.forEach((value, y) => {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.style.backgroundColor = `rgb(${Math.round(255 * (1 - value) ** 2)}, ${Math.round(255 * value ** 2)}, 0)`;
                cell.onclick = () => updateValue(x, y, value + 0.1);
                rowDiv.appendChild(cell);
            });
            container.appendChild(rowDiv);
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
    adjustAll(value - 0.5);
}
