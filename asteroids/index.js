const canvas = document.getElementById("myCanvas");
const g = canvas.getContext("2d");

let oldTime;

const player = {
    px: 100,
    py: 100,
    vx: 0,
    vy: 0,
};

const rocks = [];

for(let i=0; i<10; i++){
    const rock = {
    };
    rocks.push(rock);
};

const clearFrame = () => {
    g.fillStyle = "#FFFFFF";
    g.fillRect(0, 0, 900, 600);
};

const drawPlayer = (player) => {
    g.fillStyle = "#000000";
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(100,50);
    g.lineTo(50, 100);
    g.lineTo(0, 90);
    g.closePath();
    g.fill();
};

const drawRock = (rock) => {
};

const gameLoop = (newTime) => {
    const deltaTime = newTime - oldTime;
    clearFrame();
    
    rocks.forEach((rock) => {
        drawRock(rock);
    });
    
    drawPlayer(player);
    
    oldTime = newTime;
    window.requestAnimationFrame(gameLoop);
};

window.requestAnimationFrame(gameLoop);
