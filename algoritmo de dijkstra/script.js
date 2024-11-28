const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const toggleModeButton = document.getElementById('toggleMode');
const startNodeSelect = document.getElementById('startNode');
const endNodeSelect = document.getElementById('endNode');
const findPathButton = document.getElementById('findPath');
const output = document.getElementById('output');

let nodes = [];
let edges = [];
let mode = 'add'; 
let selectedNode = null;

// nodo
function drawNode(x, y, id) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#3498db';
    ctx.fill();
    ctx.strokeStyle = '#2c3e50';
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.fillText(id, x - 5, y + 5);
}

// arista
function drawEdge(nodeA, nodeB, weight) {
    ctx.beginPath();
    ctx.moveTo(nodeA.x, nodeA.y);
    ctx.lineTo(nodeB.x, nodeB.y);
    ctx.strokeStyle = '#95a5a6';
    ctx.stroke();
    ctx.closePath();
    // Mostrar peso
    const midX = (nodeA.x + nodeB.x) / 2;
    const midY = (nodeA.y + nodeB.y) / 2;
    ctx.fillStyle = '#2c3e50';
    ctx.fillText(weight, midX, midY);
}

function generateNodeId(index) {
    return String.fromCharCode(65 + index); 
}

//  clics en el lienzo
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === 'add') {
        // nuevo nodo
        const id = generateNodeId(nodes.length);
        nodes.push({ id, x, y });
        updateSelectOptions();
        redraw();
    } else if (mode === 'connect') {
        // Conectar nodos
        const targetNode = nodes.find(
            node => Math.hypot(node.x - x, node.y - y) < 20
        );

        if (targetNode) {
            if (!selectedNode) {
                selectedNode = targetNode; // nodo inicial
            } else if (selectedNode !== targetNode) {
                //  arista entre nodos
                const weight = parseInt(prompt('Peso de la arista:'), 10);
                if (!isNaN(weight)) {
                    edges.push({
                        from: selectedNode,
                        to: targetNode,
                        weight
                    });
                    redraw();
                }
                selectedNode = null; 
            }
        }
    }
});

toggleModeButton.addEventListener('click', () => {
    mode = mode === 'add' ? 'connect' : 'add';
    toggleModeButton.textContent = `Modo: ${mode === 'add' ? 'Agregar Nodos' : 'Conectar Nodos'}`;
});

// Redibuja el lienzo
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    edges.forEach(edge => drawEdge(edge.from, edge.to, edge.weight));
    nodes.forEach(node => drawNode(node.x, node.y, node.id));
}


function updateSelectOptions() {
    startNodeSelect.innerHTML = '';
    endNodeSelect.innerHTML = '';
    nodes.forEach(node => {
        const option = document.createElement('option');
        option.value = node.id;
        option.textContent = node.id;
        startNodeSelect.appendChild(option);
        endNodeSelect.appendChild(option.cloneNode(true));
    });
}

// Algoritmo de Dijkstra
function dijkstra(start, end) {
    const distances = {};
    const previous = {};
    const queue = [];

    nodes.forEach(node => {
        distances[node.id] = Infinity;
        previous[node.id] = null;
        queue.push(node.id);
    });

    distances[start] = 0;

    while (queue.length) {
        queue.sort((a, b) => distances[a] - distances[b]);
        const current = queue.shift();

        if (current === end) {
            const path = [];
            let step = end;
            while (step) {
                path.unshift(step);
                step = previous[step];
            }
            return { path, distance: distances[end] };
        }

        edges
            .filter(edge => edge.from.id === current || edge.to.id === current)
            .forEach(edge => {
                const neighbor = edge.from.id === current ? edge.to.id : edge.from.id;
                const newDist = distances[current] + edge.weight;
                if (newDist < distances[neighbor]) {
                    distances[neighbor] = newDist;
                    previous[neighbor] = current;
                }
            });
    }

    return { path: null, distance: Infinity };
}

// Mostrar el camino más corto
findPathButton.addEventListener('click', () => {
    const start = startNodeSelect.value;
    const end = endNodeSelect.value;

    if (start && end) {
        const { path, distance } = dijkstra(start, end);
        if (path) {
            output.textContent = `Camino más corto: ${path.join(' -> ')} (Distancia: ${distance})`;
        } else {
            output.textContent = 'No hay camino disponible.';
        }
    } else {
        output.textContent = 'Selecciona nodos válidos.';
    }
});
