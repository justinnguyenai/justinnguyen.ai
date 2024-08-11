const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const music = document.getElementById('music');
const musicToggle = document.getElementById('musicToggle');
const volumeSlider = document.getElementById('volumeSlider');

let width, height;
let particleCount = 2000;
let colorCount = 8;
let rMax = 0.4;
let forceFactor = 1;
let dt = 0.02;
let frictionHalfLife = 0.02;
let frictionFactor = Math.pow(0.5, dt / frictionHalfLife);

let colors, positionsX, positionsY, velocitiesX, velocitiesY;
let attractionMatrix;

function initializeArrays() {
    colors = new Int32Array(particleCount);
    positionsX = new Float32Array(particleCount);
    positionsY = new Float32Array(particleCount);
    velocitiesX = new Float32Array(particleCount);
    velocitiesY = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        colors[i] = Math.floor(Math.random() * colorCount);
        positionsX[i] = Math.random() * 2 - 1;
        positionsY[i] = Math.random() * 2 - 1;
        velocitiesX[i] = 0;
        velocitiesY[i] = 0;
    }
}

function initializeAttractionMatrix() {
    attractionMatrix = new Float32Array(colorCount * colorCount);
    for (let i = 0; i < colorCount * colorCount; i++) {
        attractionMatrix[i] = Math.random() * 2 - 1;
    }
}

function force(r, a) {
    const beta = 0.3;
    if (r < beta) {
        return r / beta - 1;
    } else if (beta < r && r < 1) {
        return a * (1 - Math.abs(2 * r - 1 - beta) / (1 - beta));
    } else {
        return 0;
    }
}

function wrap(value) {
    return value - 2 * Math.floor((value + 1) / 2);
}

function updateParticles() {
    for (let i = 0; i < particleCount; i++) {
        let totalForceX = 0;
        let totalForceY = 0;

        for (let j = 0; j < particleCount; j++) {
            if (j === i) continue;

            let rx = positionsX[j] - positionsX[i];
            let ry = positionsY[j] - positionsY[i];

            rx = wrap(rx);
            ry = wrap(ry);

            const r = Math.sqrt(rx * rx + ry * ry);

            if (r > 0 && r < rMax) {
                const f = force(r / rMax, attractionMatrix[colors[i] * colorCount + colors[j]]);
                totalForceX += (rx / r) * f;
                totalForceY += (ry / r) * f;
            }
        }

        totalForceX *= rMax * forceFactor;
        totalForceY *= rMax * forceFactor;

        velocitiesX[i] *= frictionFactor;
        velocitiesY[i] *= frictionFactor;

        velocitiesX[i] += totalForceX * dt;
        velocitiesY[i] += totalForceY * dt;

        positionsX[i] += velocitiesX[i] * dt;
        positionsY[i] += velocitiesY[i] * dt;

        positionsX[i] = wrap(positionsX[i]);
        positionsY[i] = wrap(positionsY[i]);
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particleCount; i++) {
        const screenX = (positionsX[i] + 1) * 0.5 * width;
        const screenY = (positionsY[i] + 1) * 0.5 * height;

        ctx.beginPath();
        ctx.arc(screenX, screenY, 2, 0, 2 * Math.PI);
        ctx.fillStyle = `hsl(${(360 * colors[i]) / colorCount}, 100%, 50%)`;
        ctx.fill();
    }
}

function resizeCanvas() {
    const header = document.querySelector('.container');
    const headerHeight = header ? header.offsetHeight : 0;
    
    width = window.innerWidth;
    height = window.innerHeight - headerHeight;
    
    canvas.width = width;
    canvas.height = height;
}


function loop() {
    updateParticles();
    drawParticles();
    requestAnimationFrame(loop);
}

function reset() {
    initializeArrays();
    initializeAttractionMatrix();
}

function toggleMusic() {
    if (music.paused) {
        music.play();
        musicToggle.textContent = 'Music = On';
    } else {
        music.pause();
        musicToggle.textContent = 'Music = Off';
    }
}

window.addEventListener('resize', resizeCanvas);
document.getElementById('resetBtn').addEventListener('click', reset);
musicToggle.addEventListener('click', toggleMusic);
volumeSlider.addEventListener('input', (e) => {
    music.volume = e.target.value;
});

resizeCanvas();
reset();
loop();

music.volume = 0.2;
volumeSlider.value = 0.2;