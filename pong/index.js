const canvas = document.getElementById("myCanvas");
const g = canvas.getContext("2d");

let oldTime;

const playerA = {
    x: 100,
    y: 100,
};

const playerB = {
    x: 600,
    y: 100,
};

const ball = {
    x: 300,
    y: 200,
};

const drawPlayerA = () => {
    g.fillStyle = "#000000";
    g.fillRect(playerA.x, playerA.y, 20, 120);
};

const drawPlayerB = () => {
    g.fillStyle = "#000000";
    g.fillRect(playerB.x, playerB.y, 20, 120);
};

const drawBall = () => {
    g.fillStyle = "#000000";
    g.fillRect(ball.x, ball.y, 10, 10);
};

const clearFrame = () => {
    g.fillStyle = "#FFFFFF";
    g.fillRect(0, 0, 900, 600);
};

const gameLoop = (newTime) => {
    const deltaTime = newTime - oldTime;
    // console.log(deltaTime);
    
    clearFrame();
    drawPlayerA();
    drawPlayerB();
    drawBall();
    
    oldTime = newTime;
    window.requestAnimationFrame(gameLoop);
};

window.requestAnimationFrame(gameLoop);
