const g = document.getElementById("myCanvas").getContext("2d");
g.beginPath();
g.arc(100, 75, 50, 0, 2 * Math.PI);
g.stroke();

g.beginPath();
g.arc(100, 90, 50, 0, 2 * Math.PI);
g.stroke();

g.beginPath();
g.moveTo(0, 0);
g.lineTo(300, 150);
g.stroke();

const waveFunction = () => {};
