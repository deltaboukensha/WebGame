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
const b2ContactListener = Box2D.Dynamics.b2ContactListener;
const b2Math = Box2D.Common.Math.b2Math;

const canvas = document.getElementById("myCanvas");
const g = canvas.getContext("2d");
let oldTime;
const keyPress = {};
const world = new b2World(new b2Vec2(0, 0), true);
const bodyDef = new b2BodyDef;
const fixDef = new b2FixtureDef;
fixDef.density = 1.0;
fixDef.friction = 0.5;
fixDef.restitution = 0.2;
const xMin = 0;
const xMax = 30;
const yMin = 0;
const yMax = 20;
let weaponCoolDown = 0;
bodyDef.type = b2Body.b2_dynamicBody;
const queueAction = [];

class Entity {
    constructor(fixture, body) {
        this.fixture = fixture;
        this.body = body;
    }

    GetFixture() {
        return this.fixture;
    }

    GetBody() {
        return this.body;
    }

    Explode() {}
};

class Unit {
    constructor({fixture, body}) {
        this.fixture = fixture;
        this.body = body;
    }

    GetFixture() {
        return this.fixture;
    }

    GetBody() {
        return this.body;
    }
};

class RemovalItem {
    constructor(entity, delay) {
        this.entity = entity;
        this.delay = delay;
    }
    
    GetEntity(){
        return this.entity;
    }
    
    GetDelay(){
        return this.delay;
    }
    
    SetDelay(delay){
        this.delay = delay;
    }
}

class DelayAction {
    constructor(delay, action) {
        this.action = action;
        this.delay = delay;
    }
    
    RunAction(){
        this.action();
    }
    
    GetDelay(){
        return this.delay;
    }
    
    SetDelay(delay){
        this.delay = delay;
    }
}

class Player extends Entity {
    constructor(fixture, body) {
        super(fixture, body);
    }
};

class Box extends Entity {
    constructor(fixture, body, width, height) {
        super(fixture, body);
        this.width = width;
        this.height = height;
    }
    
    GetWidth(){
        return this.width;
    }
    
    GetHeight(){
        return this.height;
    }

    Explode() {
        const w = this.width;
        const h = this.height;
        const x = this.GetBody().GetPosition().x;
        const y = this.GetBody().GetPosition().y;
        var pieces = [
            createBox(w / 2, h / 2, x - w / 2, y - h / 2),
            createBox(w / 2, h / 2, x + w / 2, y - h / 2),
            createBox(w / 2, h / 2, x - w / 2, y + h / 2),
            createBox(w / 2, h / 2, x + w / 2, y + h / 2),
        ];
        pieces.forEach(p => {
            p.GetBody().SetLinearVelocity(this.GetBody().GetLinearVelocity());
            p.GetBody().SetAngularVelocity(this.GetBody().GetAngularVelocity());
        });
        removeEntity(this);
    }
};

class Bullet extends Entity {
    constructor(fixture, body) {
        super(fixture, body);
    }
    
    Explode() {
        removeEntity(this);
    }
};

const createBox = (width, height, x, y) => {
    fixDef.density = 1;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(width, height);
    bodyDef.position.x = x;
    bodyDef.position.y = y;
    const fixture = world.CreateBody(bodyDef).CreateFixture(fixDef);
    const entity = new Box(fixture, fixture.GetBody(), width, height);
    fixture.SetUserData(entity);
    fixture.GetBody().SetUserData(entity);
    return entity;
};

//create some objects
for (var i = 0; i < 10; i++) {
    createBox(Math.random() + 0.1, Math.random() + 0.1, Math.random() * 10, Math.random() * 10);
}

//create player
bodyDef.position.x = 10;
bodyDef.position.y = 10;
fixDef.shape = new b2PolygonShape;
// fixDef.shape.SetAsBox(0.5, 0.5);
fixDef.shape.SetAsArray([new b2Vec2(0, 0), new b2Vec2(1.5, 0.5), new b2Vec2(0, 1)], 3);

const createPlayer = () => {
    fixDef.density = 1;
    const fixture = world.CreateBody(bodyDef).CreateFixture(fixDef);
    const entity = new Player(fixture, fixture.GetBody());
    fixture.SetUserData(entity);
    fixture.GetBody().SetUserData(entity);
    return entity;
};

const player = createPlayer();

const createBullet = (player) => {
    fixDef.density = 100;
    fixDef.shape = new b2CircleShape(0.1);
    const fixture = world.CreateBody(bodyDef).CreateFixture(fixDef);
    const entity = new Bullet(fixture, fixture.GetBody())
    fixture.SetUserData(entity);
    fixture.GetBody().SetUserData(entity);

    const direction = new b2Vec2(Math.cos(player.GetBody().GetAngle()), Math.sin(player.GetBody().GetAngle()));
    const velocity = direction.Copy();
    const offset = direction.Copy();
    offset.Multiply(2);
    const power = 10.0;
    velocity.Multiply(power);
    entity.GetBody().SetLinearVelocity(b2Math.AddVV(velocity, player.GetBody().GetLinearVelocity()));
    entity.GetBody().SetPosition(b2Math.AddVV(player.GetBody().GetPosition(), offset));
    entity.GetBody().SetAngle(player.GetBody().GetAngle());
    entity.GetBody().SetBullet(true);

    return entity;
};

const debugDraw = new b2DebugDraw();
debugDraw.SetSprite(g);
debugDraw.SetDrawScale(30.0);
debugDraw.SetFillAlpha(0.3);
debugDraw.SetLineThickness(1.0);
debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
world.SetDebugDraw(debugDraw);

const removeEntity = (entity) => {
    world.DestroyBody(entity.GetBody());
};

const contactBulletBox = (entityA, entityB) => {
    let bullet;
    let box;
    
    if(entityA instanceof Bullet && entityB instanceof Box){
        bullet = entityA;
        box = entityB;
    }
    else if(entityA instanceof Box && entityB instanceof Bullet){
        bullet = entityB;
        box = entityA;
    }
    else{
        return;
    }
    
    if(box.GetWidth() > 0.1 && box.GetHeight() > 0.1){
        queueAction.push(new DelayAction(0, () => {
            box.Explode();
        }));
    }
    else{
        queueAction.push(new DelayAction(0, () => {
            removeEntity(box);
            
        }));
    }
    
    queueAction.push(new DelayAction(0, () => {
        explodeBullet(bullet);
    }));
};
class UnitMaker {
    constructor() {
        this.bodyDef = new b2BodyDef;
        this.bodyDef.type = b2Body.b2_dynamicBody;
        
        this.fixDef = new b2FixtureDef;
        this.fixDef.density = 1;
    }

    SetSphere() {
        this.fixDef.shape = new b2CircleShape(0.1);
    }
    
    SetPosition({x, y}){
        this.bodyDef.position.x = x;
        this.bodyDef.position.y = y;
    }
    
    SetLinearVelocity({x, y}){
        this.bodyDef.linearVelocity.x = x;
        this.bodyDef.linearVelocity.y = y;
    }

    MakeUnit() {
        const body = world.CreateBody(this.bodyDef);
        const fixture = body.CreateFixture(this.fixDef);
        const unit = new Unit({
            body,
            fixture
        });
        fixture.SetUserData(unit);
        body.SetUserData(unit);
        return unit;
    }
};

const createSphere = () => {
    const fixDef = new b2FixtureDef;
    fixDef.density = 1;
    fixDef.shape = new b2CircleShape(0.1);
    const bodyDef = new b2BodyDef;
    const body = world.CreateBody(bodyDef);
    const fixture = body.CreateFixture(fixDef);
    const unit = new Unit({ body, fixture });
    fixture.SetUserData(unit);
    fixture.GetBody().SetUserData(unit);
    return unit;
};

const RNG = () => {
    return Math.random() - Math.random();
};

const explodeBullet = (bullet) => {
    const maker = new UnitMaker();
    maker.SetSphere();
    maker.SetPosition(bullet.GetBody().GetPosition());
    const velocity = bullet.GetBody().GetLinearVelocity();
    
    for(let i=0; i<8; i++){
        maker.SetLinearVelocity({
            x: velocity.x + RNG() * 100,
            y: velocity.y + RNG() * 100,
        });
        const unit = maker.MakeUnit();
    }
    
    removeEntity(bullet);
};

const contactListener = new b2ContactListener();
contactListener.EndContact = (contact) => {
    const entityA = contact.GetFixtureA().GetUserData();
    const entityB = contact.GetFixtureB().GetUserData();
    contactBulletBox(entityA, entityB);
}

world.SetContactListener(contactListener);

const gameLoop = (newTime) => {
    const deltaTime = newTime - oldTime;
    const playerAngle = player.GetBody().GetAngle();
    const playerDirection = new b2Vec2(Math.cos(playerAngle), Math.sin(playerAngle));
    const rotationPower = 1.0;
    const forwardPower = 10.0;

    if (keyPress["w"]) {
        const forceVector = playerDirection.Copy()
        forceVector.Multiply(forwardPower);
        player.GetBody().ApplyForce(forceVector, player.GetBody().GetWorldCenter());
    }

    if (keyPress["s"]) {
        const forceVector = playerDirection.GetNegative().Copy()
        forceVector.Multiply(forwardPower);
        player.GetBody().ApplyForce(forceVector, player.GetBody().GetWorldCenter());
    }

    if (keyPress["a"]) {
        player.GetBody().ApplyTorque(-rotationPower);
    }

    if (keyPress["d"]) {
        player.GetBody().ApplyTorque(+rotationPower);
    }

    weaponCoolDown -= deltaTime;

    if (keyPress[" "]) {
        if (weaponCoolDown < 0) {
            createBullet(player);
            weaponCoolDown = 200;
        }
    }

    const teleportBorder = () => {
        let body = world.GetBodyList();

        while (body) {
            const position = body.GetPosition();
            let x = position.x;
            let y = position.y;

            if (x < xMin) {
                x = xMax;
            }

            if (x > xMax) {
                x = xMin;
            }

            if (y < yMin) {
                y = yMax;
            }

            if (y > yMax) {
                y = yMin;
            }

            body.SetPosition(new b2Vec2(x, y));
            body = body.GetNext();
        }
    };

    teleportBorder();

    world.Step(deltaTime * 0.001, 10, 10);
    world.DrawDebugData();
    world.ClearForces();
    
    for (let i = queueAction.length - 1; i >= 0; i--) {
        const item = queueAction[i];
        const delay = item.GetDelay() - deltaTime;
        item.SetDelay(delay);
        
        if(delay < 0){
            item.RunAction();
            queueAction.splice(i, 1);
        }
    }

    oldTime = newTime;
    window.requestAnimationFrame(gameLoop);
};

//initiate loop
window.requestAnimationFrame((newTime) => {
    oldTime = newTime;
    window.requestAnimationFrame(gameLoop);
});

document.addEventListener('keypress', (e) => {
    keyPress[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keyPress[e.key] = false;
});
