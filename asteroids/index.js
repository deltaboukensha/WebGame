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

// const world = new b2World(new b2Vec2(0, 0), true);

var   b2Vec2 = Box2D.Common.Math.b2Vec2
,	b2BodyDef = Box2D.Dynamics.b2BodyDef
,	b2Body = Box2D.Dynamics.b2Body
,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
,	b2Fixture = Box2D.Dynamics.b2Fixture
,	b2World = Box2D.Dynamics.b2World
,	b2MassData = Box2D.Collision.Shapes.b2MassData
,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
;

const world = new b2World(
    new b2Vec2(0, 10)    //gravity
,  true                 //allow sleep
);

var fixDef = new b2FixtureDef;
fixDef.density = 1.0;
fixDef.friction = 0.5;
fixDef.restitution = 0.2;

var bodyDef = new b2BodyDef;

//create ground
bodyDef.type = b2Body.b2_staticBody;
bodyDef.position.x = 9;
bodyDef.position.y = 13;
fixDef.shape = new b2PolygonShape;
fixDef.shape.SetAsBox(10, 0.5);
world.CreateBody(bodyDef).CreateFixture(fixDef);

//create some objects
bodyDef.type = b2Body.b2_dynamicBody;
for(var i = 0; i < 10; ++i) {
if(Math.random() > 0.5) {
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(
            Math.random() + 0.1 //half width
        ,  Math.random() + 0.1 //half height
    );
} else {
    fixDef.shape = new b2CircleShape(
        Math.random() + 0.1 //radius
    );
}
bodyDef.position.x = Math.random() * 10;
bodyDef.position.y = Math.random() * 10;
world.CreateBody(bodyDef).CreateFixture(fixDef);
}

const debugDraw = new b2DebugDraw();
debugDraw.SetSprite(g);
debugDraw.SetDrawScale(30.0);
debugDraw.SetFillAlpha(0.3);
debugDraw.SetLineThickness(1.0);
debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
world.SetDebugDraw(debugDraw);

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
    
    world.Step(deltaTime * 0.001, 10, 10);
    world.DrawDebugData();
    world.ClearForces();
    
    // rocks.forEach((rock) => {
    //     drawRock(rock);
    // });
    
    // drawPlayer(player);
    
    oldTime = newTime;
    window.requestAnimationFrame(gameLoop);
};

window.requestAnimationFrame(gameLoop);
