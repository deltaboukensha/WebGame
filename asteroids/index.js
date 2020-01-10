const canvas = document.getElementById("myCanvas");
const g = canvas.getContext("2d");
let oldTime;
const keyPress = {};

const b2Vec2 = Box2D.Common.Math.b2Vec2;
const b2BodyDef = Box2D.Dynamics.b2BodyDef;
const b2Body = Box2D.Dynamics.b2Body;
const b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
const b2Fixture = Box2D.Dynamics.b2Fixture;
const b2World = Box2D.Dynamics.b2World;
const b2MassData = Box2D.Collision.Shapes.b2MassData;
const b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
const b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
const b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

const world = new b2World(new b2Vec2(0, 0), true);

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
// for (var i = 0; i < 10; i++) {
//     if (Math.random() > 0.5) {
//         fixDef.shape = new b2PolygonShape;
//         fixDef.shape.SetAsBox(
//             Math.random() + 0.1 //half width
//             , Math.random() + 0.1 //half height
//         );
//     } else {
//         fixDef.shape = new b2CircleShape(
//             Math.random() + 0.1 //radius
//         );
//     }
//     bodyDef.position.x = Math.random() * 10;
//     bodyDef.position.y = Math.random() * 10;
//     world.CreateBody(bodyDef).CreateFixture(fixDef);
// }

//create player
bodyDef.position.x = 10;
bodyDef.position.y = 10;
fixDef.shape = new b2PolygonShape;
fixDef.shape.SetAsBox(0.5, 0.5);
const player = world.CreateBody(bodyDef).CreateFixture(fixDef);

const debugDraw = new b2DebugDraw();
debugDraw.SetSprite(g);
debugDraw.SetDrawScale(30.0);
debugDraw.SetFillAlpha(0.3);
debugDraw.SetLineThickness(1.0);
debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
world.SetDebugDraw(debugDraw);

const gameLoop = (newTime) => {
    const deltaTime = newTime - oldTime;
    const playerAngle = player.GetBody().GetAngle();
    const forwardVector = new b2Vec2(Math.cos(playerAngle), Math.sin(playerAngle));

    if (keyPress["w"]) {
        const angle = player.GetBody().GetAngle();
        const forceVector = forwardVector;
        player.GetBody().ApplyForce(forceVector, player.GetBody().GetWorldCenter());
    }
    
    if (keyPress["s"]) {
        const forceVector = forwardVector.GetNegative();
        player.GetBody().ApplyForce(forceVector, player.GetBody().GetWorldCenter());
    }
    
    if (keyPress["a"]) {
        player.GetBody().ApplyTorque(-0.1);
    }
    
    if (keyPress["d"]) {
        player.GetBody().ApplyTorque(+0.1);
    }

    world.Step(deltaTime * 0.001, 10, 10);
    world.DrawDebugData();
    world.ClearForces();

    oldTime = newTime;
    window.requestAnimationFrame(gameLoop);
};

window.requestAnimationFrame(gameLoop);

document.addEventListener('keypress', (e) => {
    keyPress[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keyPress[e.key] = false;
});
