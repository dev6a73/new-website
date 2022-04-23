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
        wireframes: false
    }
});

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
var obj = Bodies.rectangle(200, 400, 50, 50)
player.bodies[2] = Example.ragdoll.ragdoll(200, 0 * 1000, 1)

Composite.add(world, [
    // walls
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    obj,
    ...player.bodies,
]);

// add mouse control
var mouse = Mouse.create(render.canvas)/*,
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });*/

//Composite.add(world, mouseConstraint);

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
        if ((4 <= pair.bodyA.id && pair.bodyA.id <= 13) && !(4 <= pair.bodyB.id && pair.bodyB.id <= 13)) {
            touchStatus[pair.bodyA.id] = 1
        } else {
            touchStatus[pair.bodyA.id] = 0
        }
        if ((4 <= pair.bodyB.id && pair.bodyB.id <= 13) && !(4 <= pair.bodyA.id && pair.bodyA.id <= 13)) {
            touchStatus[pair.bodyB.id] = 1
        } else {
            touchStatus[pair.bodyB.id] = 0
        }
    }
});

function inGame() {
    ctx.clearRect(0, 0, c.width, c.height)

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
        Composite.add(world, [Bodies.circle(mouse.position.x, mouse.position.y, 1, { isStatic: true, render: {fillStyle: '#FFBC42' }})]);
    }
}
function changeMode(e) {
    editMode = e
    if (e == -1) {
        e = 'playing'
    }
    if (e == 1) {
        e = "editing(adding platform)"
    }
    if (e == 2) {
        e = "editing(adding x)"
    }
    if (e == 0) {
        e = "editing(erasing)"
    }
    if (e == 3) {
        e = "editing(adding ?)"
    }
    if (e == 4) {
        e = "editing(adding water)"
    }
    document.getElementById("edit").innerHTML = "now: " + e
}
function save() {
    window.localStorage.setItem("data" + window.localStorage.length, all + "," + startPos)
}
function load() {
    try {
        all = window.localStorage.getItem(document.getElementById("load").value).split(",", 400)
        all[0] = Number(window.localStorage.getItem(document.getElementById("load").value).split(",")[0].replace(/\D/g, ''))
        startPos[0] = Number(window.localStorage.getItem(document.getElementById("load").value).split(",")[400].replace(/\D/g, ''));
        startPos[1] = Number(window.localStorage.getItem(document.getElementById("load").value).split(",")[401].replace(/\D/g, ''));
    } catch (error) {
        alert(`this file does not exist`)
    }
}
function moveStartPos() {
    var startPosition = document.getElementById('startPosition').value
    startPos[0] = Number(startPosition.split(',')[0]);
    startPos[1] = Number(startPosition.split(',')[1])
}
function arrowKeyMove(event) {
    if (editMode == "playing") {
        pressedKey[event.key] = true;
        document.addEventListener('keyup', (event) => {
            delete pressedKey[event.key];
        });
    }
}
function eventHandler() {
    document.getElementById("canvas1").addEventListener("pointermove", (event) => { pointerxy[0] = event.x - c.offsetLeft; pointerxy[1] = event.y - c.offsetTop; })
    var changemode = document.getElementsByClassName("changemode");
    changemode[0].addEventListener("click", () => { changeMode("playing") })
    changemode[1].addEventListener("click", () => { changeMode(0) })
    changemode[2].addEventListener("click", () => { changeMode(1) })
    changemode[3].addEventListener("click", () => { changeMode(2) })
    changemode[4].addEventListener("click", () => { changeMode(3) })
    changemode[5].addEventListener("click", () => { changeMode(4) })

    document.addEventListener("keypress", (event) => { arrowKeyMove(event) })
    document.getElementById("advancedopener").addEventListener("click", () => { document.getElementById('Advanced').style.display = 'block' })
    document.getElementById("applyStartPos").addEventListener("click", () => { moveStartPos() })
    document.getElementById("save").addEventListener("click", () => save())
    document.getElementById("load").addEventListener("keypress", () => load())
}
function movement() {
    if (pressedKey.w) {
        if(touchStatus[6] == 1){
            Body.applyForce(player.bodies[2].bodies[0], { x: player.bodies[2].bodies[0].position.x, y: player.bodies[2].bodies[0].position.y}, { x: (player.bodies[2].bodies[0].position.x - player.bodies[2].bodies[6].position.x)/1000, y: (player.bodies[2].bodies[0].position.y - player.bodies[2].bodies[6].position.y)/1000 })
        }
        if(touchStatus[7] == 1){
            Body.applyForce(player.bodies[2].bodies[0], { x: player.bodies[2].bodies[0].position.x, y: player.bodies[2].bodies[0].position.y}, { x: (player.bodies[2].bodies[0].position.x - player.bodies[2].bodies[7].position.x)/1000, y: (player.bodies[2].bodies[0].position.y - player.bodies[2].bodies[7].position.y)/1000 })
        }
        balance(1.1)
    }
    if (pressedKey.d && player.bodies[2].bodies[0].velocity.x < maxSpeed) {
        Body.setVelocity(player.bodies[2].bodies[0], { x: player.bodies[2].bodies[0].velocity.x + speed, y: player.bodies[2].bodies[0].velocity.y })
        balance(1.1, -0.1)
    }
    if (pressedKey.a && player.bodies[2].bodies[0].velocity.x > -maxSpeed) {
        Body.setVelocity(player.bodies[2].bodies[0], { x: player.bodies[2].bodies[0].velocity.x - speed, y: player.bodies[2].bodies[0].velocity.y })
        balance(1.1, 0.1)
    }
    if(pressedKey.q){
        balance(2,0,!!(touchStatus[6] == 1 || touchStatus[7] == 1))
        if(touchStatus[6] == 1 && touchStatus[7] ==1){
            Body.applyForce(player.bodies[2].bodies[0], { x: player.bodies[2].bodies[0].position.x, y: player.bodies[2].bodies[0].position.y}, { x: (player.bodies[2].bodies[0].position.x - player.bodies[2].bodies[6].position.x)/1000, y: (player.bodies[2].bodies[0].position.y - player.bodies[2].bodies[6].position.y)/1000 })
            Body.applyForce(player.bodies[2].bodies[0], { x: player.bodies[2].bodies[0].position.x, y: player.bodies[2].bodies[0].position.y}, { x: (player.bodies[2].bodies[0].position.x - player.bodies[2].bodies[7].position.x)/1000, y: (player.bodies[2].bodies[0].position.y - player.bodies[2].bodies[7].position.y)/1000 })

        }
    }
}
function balance(a, b = 0, c = false) {
    Body.setAngle(player.bodies[2].bodies[0], (player.bodies[2].bodies[0].angle % Math.PI) / a+b)
    Body.setAngle(player.bodies[2].bodies[6], (player.bodies[2].bodies[6].angle % Math.PI) / a+b)
    Body.setAngle(player.bodies[2].bodies[7], (player.bodies[2].bodies[7].angle % Math.PI) / a+b)
    Body.setAngle(player.bodies[2].bodies[8], (player.bodies[2].bodies[8].angle % Math.PI) / a+b)
    Body.setAngle(player.bodies[2].bodies[9], (player.bodies[2].bodies[9].angle % Math.PI) / a+b)
    if(c){
        Body.setAngle(player.bodies[2].bodies[0], 0)
        Body.setAngle(player.bodies[2].bodies[6], 0)
        Body.setAngle(player.bodies[2].bodies[7], 0)
        Body.setAngle(player.bodies[2].bodies[8], 0)
        Body.setAngle(player.bodies[2].bodies[9], 0)
        Body.setPosition(player.bodies[2].bodies[8], { x: player.bodies[2].bodies[6].position.x/2+player.bodies[2].bodies[8]/2, y: player.bodies[2].bodies[6].position.y/2 + player.bodies[2].bodies[8]/2-15 })
        Body.setPosition(player.bodies[2].bodies[9], { x: player.bodies[2].bodies[7].position.x/2+player.bodies[2].bodies[9]/2, y: player.bodies[2].bodies[7].position.y/2 + player.bodies[2].bodies[9]/2-15 })
        Body.setPosition(player.bodies[2].bodies[6], { x: player.bodies[2].bodies[6].position.x/2+player.bodies[2].bodies[8]/2, y: player.bodies[2].bodies[6].position.y/2 + player.bodies[2].bodies[8]/2+15 })

    }
}
eventHandler()
window.setInterval(() => {
    inGame()
    movement()
}, 1)