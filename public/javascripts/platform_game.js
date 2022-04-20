var c = document.getElementById("canvas1");
var container = document.getElementById("container");
var ctx = c.getContext("2d")
var startPos = [50, 300]
var player = {
    x: startPos[0],
    y: startPos[1],
    a: { x: 0, y: 0 },
    v: { x: 0, y: 0 },
}
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
var editMode = false;
var collisionDetector = [false, false, false, false]
var pressedpointer = false
var climbing = true
var pointerxy = [0, 0]
var pressedKey = {}
let touchStatus = [0, 0, 0, 0, 0];//[air, ground, x, wall, water]
var maxSpeed = 1
var mousefocus = false

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
        showAngleIndicator: true
    }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// add bodies
var playerBody = Bodies.rectangle(player.x, player.y, 25, 50)
var obj = Bodies.rectangle(200, 400, 50, 50)

Composite.add(world, [
    // walls
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    playerBody,
    obj,
]);

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
    touchStatus[1] = 1
});

console.log(Matter)

function inGame() {
    ctx.clearRect(0, 0, c.width, c.height)
    if (playerBody.velocity.x > 20) {
        playerBody.velocity.x = 20
    }
    if (playerBody.velocity.x < -20) {
        playerBody.velocity.x = -20
    }
    if (playerBody.velocity.y < -20) {
        playerBody.velocity.y = -20
    }
    if (playerBody.velocity.y > 20) {
        playerBody.velocity.y = 20
    }
    if (editMode == "playing" || editMode == -1) {
        //playerBody.position.x = playerBody.centre.x
        //playerBody.position.y = playerBody.centre.y;
    }//move
    if(playerBody.angle%Math.PI != 0){
        Body.setAngle(playerBody, (playerBody.angle%Math.PI)/1.1)
    }
    if (pressedKey.r) {
        player = {
            x: startPos[0],
            y: startPos[1],
            a: { x: 0, y: 0 },
            v: { x: 0, y: 0 },
        }
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
    if (pressedKey.w && touchStatus[1]) {
        //Body.setVelocity(playerBody, { x: playerBody.velocity.x, y: -jumpheight })
        Body.applyForce(playerBody, { x: playerBody.position.x, y: playerBody.position.y }, { x: 0, y: -0.04 })
        Body.setAngle(playerBody, (playerBody.angle%Math.PI)/2)
        touchStatus[1] = 0
    }
    if (pressedKey.d && playerBody.velocity.x < maxSpeed) {
        Body.setVelocity(playerBody, { x: playerBody.velocity.x + speed, y: playerBody.velocity.y })
    }
    if (pressedKey.a && playerBody.velocity.x > -maxSpeed) {
        Body.setVelocity(playerBody, { x: playerBody.velocity.x - speed, y: playerBody.velocity.y })
    }
}
eventHandler()
window.setInterval(() => {
    inGame()
    movement()
}, 1)