//import Matter from 'https://cdn.skypack.dev/matter-js'
//import mathjs from 'https://cdn.skypack.dev/mathjs';

var c = document.getElementById("canvas1");
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
var jumpheight = 1.4;
var frictionForce = [0, 0]
var dragForce = [0, 0]
var editMode = false;
var collisionDetector = [false, false, false, false]
var pressedpointer = false
var climbing = true
var pointerxy = [0, 0]
var pressedKey = {}
let touchStatus = [0, 0, 0, 0, 0];//[air, ground, x, wall, water]
var mousefocus = false
/*function platform(x, y, c, d) {
    var collision = x + 20 >= player.x + 1 && x <= player.x + 19 && y + 20 >= player.y + 1 && y <= player.y + 19
    if (d == 1) {
        ctx.fillStyle = "#246"
    }
    if (d == 2) {
        ctx.fillStyle = "#345"
    }
    if (d == 3) {
        ctx.fillStyle = "#444"
        c[3] = false
        c[1] = false
        c[2] = false
    }
    if (d == 4) {
        ctx.fillStyle = "#147"
        c = false
    }
    if (d == 0) {
        ctx.fillStyle = "#123"
        c = false
    }
    ctx.fillRect(x, y, 20, 20)
    if(c[4] != false && d==3){
        ctx.fillStyle = "#333"
        ctx.fillRect(x,y,20,5)
    }
    if (collision && (d == 0 || d == 3)) {
        touchStatus[0] = 1
    }
    if (x + 20 >= player.x + 2 && x <= player.x + 18 && player.y + 20 >= y && d == 1 && y >= player.y - 15) {
        touchStatus[1] = 1
    }
    if (x + 20 >= player.x + 2 && x <= player.x + 18 && player.y + 20 >= y && d == 3 && y >= player.y - 5 && c[4] != false) {
        touchStatus[1] = 1
    }
    if (collision && player.y <= y - 15 && c[0] && ((c[4] != false && d == 3) || d != 3)) {
        player.v.y = -Math.abs(player.v.y) * rebound_ratio
        player.y -= 1
        touchStatus[1] = 1
    }//up

    if (collision && d == 4) {
        touchStatus[4] = 1
    }
    if (collision && player.y >= y + 15 && c[1]) {
        player.v.y = Math.abs(player.v.y) * rebound_ratio
        c[1] = false
        player.y += 1
    }//down
    if (collision && player.x + 10 <= x && c[2] && x - player.x > player.y - y) {
        player.x -= 1
        player.v.x = -Math.abs(player.v.x) * rebound_ratio
        touchStatus[3] = 1
    }//left
    if (collision && player.x >= x + 10 && c[3] && player.x - x > player.y - y) {
        player.x += 1
        player.v.x = Math.abs(player.v.x) * rebound_ratio
        touchStatus[3] = 1
    }//right
    if (collision && d == 2 && editMode == "playing") {
        player = {
            x: startPos[0],
            y: startPos[1],
            a: { x: 0, y: 0.01 },
            v: { x: 0, y: 0 },
        }
        frictionForce = [0, 0]
        dragForce = [0, 0]
        buoyancy = 0;
    }
}*/
var mouseX, mouseY, mousePress = 0;
(function () {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0);
        }

        mouseX = event.pageX - c.offsetLeft
        mouseY = event.pageY - c.offsetTop
        document.body.onmousedown = function () {
            ++mousePress;
        }
        document.body.onmouseup = function () {
            --mousePress;
        }
    }
})();
const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )

function distToSegment(x, y, x1, y1, x2, y2) {

    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;

    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0) //in case of 0 length line
        param = dot / len_sq;

    var xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    }
    else if (param > 1) {
        xx = x2;
        yy = y2;
    }
    else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    var dx = x - xx;
    var dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}
var circlelineintersectionpoint = function (x1, y1, x2, y2, x, y, r) {
    var m = (y2 - y1) / (x2 - x1);
    var c = (y1 - m * x1);
    var A = m**2+1
    var B = 2*(m*c-m*y-x)
    var C = (c**2-r**2+x**2+y**2-2*c*y)
    return [[(-B+Math.sqrt(B**2-4*A*C))/(2*A),m*((-B+Math.sqrt(B**2-4*A*C))/(2*A))+c],[(-B-Math.sqrt(B**2-4*A*C))/(2*A),m*((-B-Math.sqrt(B**2-4*A*C))/(2*A))+c]]

}
var Physics = {
    intersects: (a, b, c, d, p, q, r, s) => {
        var det, gamma, lambda;
        det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det === 0) {
            return false;
        } else {
            lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
            gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
            return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
    },
}
class Virtex {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    move(x, y) {
        this.x = x
        this.y = y
    }
}
class Segment {
    constructor(point1, point2) {
        this.point1 = point1
        this.point2 = point2
    }
    draw() {
        ctx.beginPath()
        ctx.moveTo(this.point1.x, this.point1.y)
        ctx.lineTo(this.point2.x, this.point2.y)
        ctx.stroke()
    }
    moveStart(p1) {
        this.point1 = p1
    }
    moveEnd(p2) {
        this.point2 = p2
    }
}
class Polygons {
    constructor(settings, ...points) {
        this.id = settings.id ?? null
        this.points = Array.from({ length: points.length }, (_, j) => new Virtex(...(points[j])));
        this.line = Array.from({ length: points.length }, (_, j) => new Segment(this.points[j], this.points[(j + 1) % this.points.length]));
    }
    draw() {
        this.line.forEach(line => line.draw())
    }
    lineCollision(x1, y1, x2, y2) {
        for (var i = 0; i < this.line.length; i++) {
            if (Math.min(distToSegment(x1, y1, this.line[i].point1.x, this.line[i].point1.y, this.line[i].point2.x, this.line[i].point2.y), distToSegment(x2, y2, this.line[i].point1.x, this.line[i].point1.y, this.line[i].point2.x, this.line[i].point2.y)) < 1 || Physics.intersects(x1, y1, x2, y2, this.line[i].point1.x, this.line[i].point1.y, this.line[i].point2.x, this.line[i].point2.y)) {
                return true
            }
        }
        return false
    }
    move() {
        for (var i = 0; i < this.points.length; i++) {
            if (Math.abs(mouseX - this.points[i].x) < 10 && Math.abs(mouseY - this.points[i].y) < 10 && mousePress && !mousefocus || mousefocus == this.points[i]) {
                mousefocus = this.points[i]
                this.points[i].move(mouseX, mouseY)
                this.line[i].moveStart(this.points[i])
                this.line[i].moveEnd(this.points[(i + 1) % this.points.length])
            } else if (!mousePress) {
                mousefocus = false
            }
        }
    }
}
var a = [
    new Polygons({ id: 0x1 }, [0, 350], [0, 400], [400, 400], [400, 350], ...Array.from({ length: 20 }, (_, j) => [Math.random() * 10 - 5 + 400 - j * 20, Math.random() * 10 + 345]))
]
function inGame() {
    ctx.clearRect(0, 0, c.width, c.height)
    touchStatus = [0, 0, 0, 0, 0]
    for (var i = 0; i < a.length; i++) {
        a[i].move()
        a[i].draw()
        for (var j = 0; j < a[i].points.length; j++) {
            if (distToSegment(player.x, player.y, a[i].points[j].x, a[i].points[j].y, a[i].points[(j + 1) % a[i].points.length].x, a[i].points[(j + 1) % a[i].points.length].y) < 20) {
                touchStatus[1] = 1
                var interpoint = circlelineintersectionpoint(a[i].points[j].x, a[i].points[j].y, a[i].points[(j + 1) % a[i].points.length].x, a[i].points[(j + 1) % a[i].points.length].y, player.x, player.y, 20)
                player.x -= ((interpoint[0][0] + interpoint[1][0])/2 - player.x) * 0.15
                player.y -= ((interpoint[0][1] + interpoint[1][1])/2 - player.y) * 0.15
                objectMap(player.v, v => v *= 0.9)
            }
        }
        touchStatus[0] = 1
    }
    if (player.v.x > 20) {
        player.v.x = 20
    }
    if (player.v.x < -20) {
        player.v.x = -20
    }
    if (player.v.y < -20) {
        player.v.y = -20
    }
    if (player.v.y > 20) {
        player.v.y = 20
    }
    if (editMode == "playing" || editMode == -1) {
        player.x += player.v.x;
        player.v.x += player.a.x;
        player.y += player.v.y;
        player.v.y += player.a.y;
        player.v.y += gravity
        player.v.x += frictionForce[0];
        player.v.y += frictionForce[1];
        player.v.x += dragForce[0];
        player.v.y += dragForce[1];
        player.v.y += buoyancy
    }//move
    if (player.x < -20 || player.x > 400 || player.y < -20 || player.y > 400 || isNaN(player.y) || isNaN(player.x)) {
        player = {
            x: startPos[0],
            y: startPos[1],
            a: { x: 0, y: 0 },
            v: { x: 0, y: 0 },
        }
    }

    ctx.beginPath();
    ctx.arc(player.x, player.y, 20, 0, 2 * Math.PI);
    ctx.stroke();

    if (pressedpointer && typeof (editMode) == "number") {
        all[20 * (Math.floor((pointerxy[0]) / 20)) + Math.floor((pointerxy[1]) / 20)] = editMode
        pressedpointer = false
    }
    if (touchStatus[0] == 1) {
        dragForce[0] = -(1 / 2) * airDensity * player.v.x * player.v.x * Math.sign(player.v.x)
        dragForce[1] = -(1 / 2) * airDensity * player.v.y * player.v.y * Math.sign(player.v.y)
        buoyancy = -airDensity * gravity
        frictionForce[0] = 0
        frictionForce[1] = 0
    }
    if (touchStatus[4] == 1) {
        dragForce[0] = -(1 / 2) * waterDensity * player.v.x * player.v.x * Math.sign(player.v.x)
        dragForce[1] = -(1 / 2) * waterDensity * player.v.y * player.v.y * Math.sign(player.v.y)
        buoyancy = -waterDensity * gravity
        frictionForce[0] = 0
        frictionForce[1] = 0
    }
    if (touchStatus[1] == 1 || touchStatus[3] == 1) {
        frictionForce[0] = -gravity * friction * player.v.x
        frictionForce[1] = -gravity * friction * player.v.y
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
        if (climbing && touchStatus[3] == 1) {
            player.v.y = -jumpheight
        }
        if (touchStatus[1] == 1) {
            player.v.y = -jumpheight;
        }
        if (touchStatus[4] == 1) {
            player.v.y -= jumpheight * Math.abs(waterDensity) ** 0.5 * gravity ** 0.5
        }
        if (touchStatus[0] == 1) {
            player.v.y -= jumpheight * Math.abs(airDensity) ** 0.5 * gravity ** 0.5
        }
        touchStatus[1] = 0
    }
    if (pressedKey.d) {
        if (player.v.x <= speed) {
            player.v.x += speed * Math.abs(frictionForce[0] + dragForce[0]) + 0.01;
        }
    }
    if (pressedKey.a) {
        if (player.v.x >= -speed) {
            player.v.x -= speed * Math.abs(frictionForce[0] + dragForce[0]) + 0.01;
        }
    }
}
eventHandler()
window.setInterval(() => {
    inGame()
    movement()
}, 1)