var c = document.getElementById("canvas1");
var container = document.getElementById("container");
var ctx = c.getContext("2d")
var startPos = [50, 300]
var rebound_ratio = 0.5
var friction = 5
var buoyancy = 0;
var airDensity = .0005
var waterDensity = .5
var gravity = 0.01
var speed = 1
var jumpheight = 8;
var frictionForce = [0, 0]
var dragForce = [0, 0]
var editMode = 'playing';
var collisionDetector = [false, false, false, false]
var pressedpointer = false
var climbing = true
var pointerxy = [0, 0]
var pressedKey = {}
let touchStatus = [];
var maxSpeed = 1
var mousefocus = false
var π = Math.PI
var level = "main"
var isDead = false

var {
    Engine,
    Render,
    Runner,
    Composites,
    MouseConstraint,
    Mouse,
    Composite,
    Bodies,
    Body,
    Events,
    Constraint,
    World,
} = Matter;

// create engine
var engine = Engine.create(),
    world = engine.world;

// create renderer
var render = Render.create({
    canvas: c,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        showAngleIndicator: false,
        wireframes: false,
        showStats: true,
        showPerformance: true,
    }
});
function fullscreen() {
    render.options.width = Math.min(window.innerWidth, window.innerHeight * 4 / 3)
    render.options.height = Math.min(window.innerWidth * 3 / 4, window.innerHeight)
    c.width = render.options.width
    c.height = render.options.height
}

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// add bodies
var player = {
    type: "composite",
    bodies: [
        Bodies.rectangle(startPos[0], startPos[1], 25, 50, { id: 'body' }),
        Bodies.rectangle(startPos[0], startPos[1] + 25, 25, 10, { id: 'feet' }),
    ]
}
player.bodies[2] = Example.ragdoll.ragdoll(200, 300, 0.5)
player.bodies[2].id = 'player'

var map = {}
const load = {
    "main": function () {
        map["main"] = Composites.stack()
        Composite.add(map["main"], [
            Bodies.rectangle(400, 400, 100, 50, { isStatic: true, render: { fillStyle: '#7E886A' }, id: 'start' }),
        ])
        map["main"].settings = { startPos: { x: 400, y: 300 } };
        map["main"].id = "main menu";
    },
    "0": () => {
        map[0] = Composites.stack()
        Composite.add(map[0], [
            Bodies.rectangle(100, 500, 400, 200, { isStatic: true, }),
            Bodies.rectangle(700, 500, 400, 400, { isStatic: true, }),
            Bodies.rectangle(400, 350, 100, 10, { isStatic: true, render: { fillStyle: '#ececd1' } }),
            Bodies.rectangle(750, 250, 25, 25, { isStatic: true, render: { fillStyle: '#7E886A' }, id: 'moveto: 1' }),
            Bodies.rectangle(-300, 300, 10, 800, { isStatic: true, render: { fillStyle: '#f55a3c' } }),
            Bodies.rectangle(1100, 300, 10, 800, { isStatic: true, render: { fillStyle: '#f55a3c' } }),
            Bodies.rectangle(400, -100, 1400, 10, { isStatic: true, render: { fillStyle: '#f55a3c' } }),
            Bodies.rectangle(400, 700, 1400, 10, { isStatic: true, render: { fillStyle: '#f55a3c' } }),
        ])
        map[0].settings = { startPos: { x: 200, y: 300 } };
        map[0].id = 'level 0'
    },
    "1": () => {
        map[1] = Composites.stack()
        Composite.add(map[1], [
            Bodies.rectangle(300, 500, 50, 10, { isStatic: true, render: { fillStyle: '#ececd1' } }),
            Bodies.rectangle(400, 470, 50, 10, { isStatic: true, render: { fillStyle: '#ececd1' } }),
            Bodies.rectangle(200, 300, 50, 10, { isStatic: true, render: { fillStyle: '#ececd1' } }),
            Bodies.rectangle(450, 270, 50, 10, { isStatic: true, render: { fillStyle: '#ececd1' } }),
            Bodies.rectangle(550, 160, 75, 10, { isStatic: true, render: { fillStyle: '#ececd1' } }),
            Bodies.rectangle(550, 150, 50, 10, { isStatic: true, render: { fillStyle: '#7E886A' }, id: 'moveto: 2' }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, -50, 800, 50, { isStatic: true, render: { fillStyle: '#f55a3c' } }),
            Bodies.rectangle(800, 275, 50, 700, { isStatic: true }),
            Bodies.rectangle(0, 275, 50, 700, { isStatic: true }),
        ]);
        map[1].settings = { startPos: { x: 200, y: 500 } };
        map[1].id = 'level 1'
    },
    "2": () => {
        map[2] = Composites.stack()
        Composite.add(map[2], [
            Bodies.rectangle(300, 300, 10, 550, { isStatic: false, render: { fillStyle: '#ececd1' }, collisionFilter: { group: -2 } }),
            Bodies.rectangle(300, 300, 10, 150, { isStatic: false, render: { fillStyle: '#f55a3c' }, collisionFilter: { group: -2 } }),
            Bodies.rectangle(400, 300, 50, 50, { isStatic: true, render: { fillStyle: '#f55a3c' } }),
            Bodies.rectangle(650, 575, 300, 10, { isStatic: true, render: { fillStyle: '#f55a3c' } }),
            Bodies.rectangle(700, 400, 25, 25, { isStatic: true, render: { fillStyle: '#7E886A' }, id: 'moveto: 3' }),
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
        ]);
        Composite.add(map[2], [
            Constraint.create({
                bodyA: map[2].bodies[0],
                pointA: { x: 0, y: 0 },
                bodyB: map[2].bodies[1],
                pointB: { x: 0, y: 0 },
                stiffness: 1,
                render: {
                    lineWidth: 1,
                    strokeStyle: '#f55a3c',
                }
            })
        ])
        map[2].settings = { startPos: { x: 150, y: 500 } };
        map[2].id = 'level 2'
    },
    "3": () => {
        map[3] = Composites.stack()
        Composite.add(map[3], [
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
        ]);
        map[3].settings = { startPos: { x: 150, y: 500 } };
        map[3].id = 'level 3'
    }
}

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

level = params.level || "main"
newLevel(level)

load["main"]()
Composite.remove(world, map[level])

Composite.add(world, [
    // walls
    ...player.bodies,
    map[level],
]);

player.bodies[2].bodies.forEach(i => Body.setPosition(i, map[level].settings.startPos))

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
});

Events.on(engine, 'collisionStart', function (event) {
    for (var i = 0; i < event.pairs.length; i++) {
        var pair = event.pairs[i];
        touchStatus[pair.bodyA.id] = 1
        touchStatus[pair.bodyB.id] = 1
        if (((3 <= pair.bodyA.id && pair.bodyA.id <= 12) || (3 <= pair.bodyB.id && pair.bodyB.id <= 12)) && !isDead) {
            if ((pair.bodyA.id.toString().match('moveto:') || pair.bodyB.id.toString().match('moveto:')) && !isDead) {
                newLevel(parseInt(pair.bodyA.id.toString().match('moveto:') ? pair.bodyA.id.toString()[8] + pair.bodyA.id.toString()[9] : pair.bodyB.id.toString()[8] + pair.bodyB.id.toString()[9], 16))
                console.log(console.timeLog('time').split(' ')[0]* 1000)
            }
            if (pair.bodyA.render.fillStyle == '#f55a3c' || pair.bodyB.render.fillStyle == '#f55a3c') {
                player.bodies[2].bodies.forEach(i => i.isSensor = true)
                player.bodies[2].constraints.forEach(i => Matter.Composite.remove(world, i, true))
                isDead = true
                setTimeout(() => {
                    //isDead = false
                    //player.bodies[2].bodies.forEach(i => i.isSensor = false)
                    // Composite.clear(world)
                    window.location.reload()
                    //newLevel(level)
                }, 1000)
            }
        }
    }
});

Events.on(engine, 'collisionEnd', function (event) {
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        touchStatus[pair.bodyA.id] = 0
        touchStatus[pair.bodyB.id] = 0
    }
});

function inGame() {
    ctx.clearRect(0, 0, c.width, c.height)
    if (mouseConstraint.body?.id == 'start') {
        newLevel(0)
        world.composites.forEach(x => x.id == 'main menu'? world.composites[(world.composites.findIndex(a => a==x))] = Composites.stack() : null)
        console.time('time')
    }
    window.onresize = fullscreen()

    balance(1.1)
    if (player.bodies[0].velocity.x > 20) {
        player.bodies[0].velocity.x = 20
    }
    if (player.bodies[0].velocity.x < -20) {
        player.bodies[0].velocity.x = -20
    }
    if (player.bodies[0].velocity.y < -20) {
        player.bodies[0].velocity.y = -20
    }
    if (player.bodies[0].velocity.y > 20) {
        player.bodies[0].velocity.y = 20
    }
    if (player.bodies[0].angle % Math.PI != 0) {
        Body.setAngle(player.bodies[0], (player.bodies[0].angle % Math.PI) / 1.1)
    }
    if (pressedKey.r) {
        Composite.clear(world)
        window.location.reload()
    }
    if (pressedKey["Escape"] || pressedKey["Esc"]) {
        console.log("esc pressed")
    }
}

function newLevel(num) {
    try {
        Composite.remove(world, map[level])
    } catch (error) {
        console.log(error)
    }
    level = isNaN('0x' + num) ? num : parseInt(num, 16)
    load[level]()
    if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?level=' + level;
        window.history.pushState({ path: newurl }, '', newurl);
    }
    player.bodies[2].bodies.forEach(i => Body.setPosition(i, map[level].settings.startPos))
    Composite.add(world, map[level])
}

function arrowKeyMove(event) {
    pressedKey[event.key] = true;
    document.addEventListener('keyup', (event) => {
        delete pressedKey[event.key];
    });
}
function eventHandler() {
    document.getElementById("canvas1").addEventListener("pointermove", (event) => { pointerxy[0] = event.x - c.offsetLeft; pointerxy[1] = event.y - c.offsetTop; })
    document.addEventListener("keypress", (event) => { arrowKeyMove(event) })
}
function movement() {
    if (pressedKey.w && !isDead) {
        if (touchStatus[10] == 1) {
            Body.applyForce(player.bodies[2].bodies[0], { x: player.bodies[2].bodies[0].position.x, y: player.bodies[2].bodies[0].position.y }, { x: (player.bodies[2].bodies[0].position.x - player.bodies[2].bodies[6].position.x) / 5000, y: (player.bodies[2].bodies[0].position.y - player.bodies[2].bodies[6].position.y) / 5000 })
        }
        if (touchStatus[12] == 1) {
            Body.applyForce(player.bodies[2].bodies[0], { x: player.bodies[2].bodies[0].position.x, y: player.bodies[2].bodies[0].position.y }, { x: (player.bodies[2].bodies[0].position.x - player.bodies[2].bodies[7].position.x) / 5000, y: (player.bodies[2].bodies[0].position.y - player.bodies[2].bodies[7].position.y) / 5000 })
        }
        balance(1.1)
    }
    if (pressedKey.d && player.bodies[2].bodies[0].velocity.x < maxSpeed) {
        Body.setVelocity(player.bodies[2].bodies[0], { x: player.bodies[2].bodies[0].velocity.x + speed, y: player.bodies[2].bodies[0].velocity.y })
        balance(1.1, 0.1)
    }
    if (pressedKey.a && player.bodies[2].bodies[0].velocity.x > -maxSpeed) {
        Body.setVelocity(player.bodies[2].bodies[0], { x: player.bodies[2].bodies[0].velocity.x - speed, y: player.bodies[2].bodies[0].velocity.y })
        balance(1.1, -0.1)
    }
    if (pressedKey.q) {
        balance(2, 0, !!(touchStatus[10] == 1 || touchStatus[12] == 1))
        if (touchStatus[10] == 1 && touchStatus[12] == 1) {
            Body.applyForce(player.bodies[2].bodies[0], { x: player.bodies[2].bodies[0].position.x, y: player.bodies[2].bodies[0].position.y }, { x: (player.bodies[2].bodies[0].position.x - player.bodies[2].bodies[6].position.x) / 500000, y: (player.bodies[2].bodies[0].position.y - player.bodies[2].bodies[6].position.y) / 50000 })
            Body.applyForce(player.bodies[2].bodies[0], { x: player.bodies[2].bodies[0].position.x, y: player.bodies[2].bodies[0].position.y }, { x: (player.bodies[2].bodies[0].position.x - player.bodies[2].bodies[7].position.x) / 500000, y: (player.bodies[2].bodies[0].position.y - player.bodies[2].bodies[7].position.y) / 50000 })
        }
    }
}
function balance(a, b = 0, c = false) {
    Body.setAngle(player.bodies[2].bodies[0], (player.bodies[2].bodies[0].angle % Math.PI) / a + b)
    Body.setAngle(player.bodies[2].bodies[6], (player.bodies[2].bodies[6].angle % Math.PI) / a + b)
    Body.setAngle(player.bodies[2].bodies[7], (player.bodies[2].bodies[7].angle % Math.PI) / a + b)
    Body.setAngle(player.bodies[2].bodies[8], (player.bodies[2].bodies[8].angle % Math.PI) / a + b)
    Body.setAngle(player.bodies[2].bodies[9], (player.bodies[2].bodies[9].angle % Math.PI) / a + b)
}
eventHandler()
window.setInterval(() => {
    inGame()
    movement()
}, 1)