const canvas = document.getElementById("myCanvas");
const g = canvas.getContext("2d");

const state = {};

let oldTime;

const draw = () => {
    g.fillStyle = "#000000";
    g.fillRect(ball.x, ball.y, 10, 10);

    for(let x=0; x<8; x++){
        for(let y=0; y<8; y++){
        }
    }
};

const clearFrame = () => {
    g.fillStyle = "#FFFFFF";
    g.fillRect(0, 0, 900, 600);
};

const gameLoop = (newTime) => {
    const deltaTime = newTime - oldTime;
    // console.log(deltaTime);
    
    clearFrame();
    draw();
    
    oldTime = newTime;
    window.requestAnimationFrame(gameLoop);
};

window.requestAnimationFrame(gameLoop);
