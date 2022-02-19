var c = document.getElementById("canvas1");
var ctx = c.getContext("2d")
var startPos = [60, 340]
var player = {
    x: startPos[0],
    y: startPos[1],
    a: {x: 0, y: 0},
    v: {x: 0, y: 0},
}
var rebound_ratio = 0.5
var friction = 5
var frictionForce=[0,0]
var dragForce=[0,0]
var buoyancy = 0;
var airDensity = .0005
var waterDensity = .5
var gravity = 0.01
var speed = 1
var all = []
for(var i = 0; i < 400; i++){
    all[i] = 0
}
all[58] = 1
all[78] = 1
all[98] = 1
var editMode = false;
var collisionDetector = [false, false, false, false]
var pressedpointer = false
var climbing = true
var pointerxy = [0, 0]
var pressedKey = {}
let status = [0, 0, 0, 0, 0];//[air, ground, x, wall, water]
function platform(x, y, c, d) {
    var collision = x+20>=player.x+1 && x<=player.x+19 && y+20>=player.y+1 && y<=player.y+19
    if(d == 1){
        ctx.fillStyle = "#246"
    }
    if(d == 2){
        ctx.fillStyle = "#345"
    }
    if(d == 3){
        ctx.fillStyle = "#444"
        c[3] = false
        c[1] = false
        c[2] = false
    }
    if(d == 4){
        ctx.fillStyle = "#147"
        c = false
    }
    if(d == 0){
        ctx.fillStyle = "#123"
        c = false
    }
    ctx.fillRect(x, y, 20, 20)
    if(collision && d==0){
        status[0] = 1
    }
    if(x+20>=player.x+2 && x<=player.x+18 && player.y+20 >= y && d==1 && y>=player.y-15){
        status[1] = 1
    }
    if(x+20>=player.x+2 && x<=player.x+18 && player.y+20 >= y && d==3 && y>=player.y-5 && c[4] != false){
        status[1] = 1
    }
    if(collision && player.y <= y-15 && c[0] && ((c[4] != false && d==3) || d!=3)){
        player.v.y = -Math.abs(player.v.y)*rebound_ratio
        player.y -= 1
        status[1] = 1
    }//up
    
    if(collision && d==4){
        status[4] = 1
    }
    if(collision && player.y >= y+15 && c[1]){
        player.v.y = Math.abs(player.v.y)*rebound_ratio
        c[1] = false
        player.y += 1
    }//down
    if(collision && player.x+10 <= x && c[2] && x-player.x-10>player.y-y){
        player.x -= 1
        player.v.x = -Math.abs(player.v.x)*rebound_ratio
        status[3] = 1
    }//left
    if(collision && player.x >= x+10 && c[3] && player.x-x-10>player.y-y){
        player.x += 1
        player.v.x = Math.abs(player.v.x)*rebound_ratio
        status[3] = 1
    }//right
    if(collision && d == 2 && editMode == "playing"){
        player = {
            x: startPos[0],
            y: startPos[1],
            a: {x: 0, y: 0.01},
            v: {x: 0, y: 0},
        }
        frictionForce=[0,0]
        dragForce=[0,0]
        buoyancy = 0;
    }
}
function inGame() {
    ctx.clearRect(0, 0, c.width, c.height)

    status = [0, 0, 0, 0, 0]
    for(var i = 0; i < 20; i++){
        for(var j = 0; j < 20; j++){
            collisionDetector = [true, true, true, true]
            if(all[20*i+j+1] == 1 && j != 19){
                collisionDetector[1] = false
            }
            if(all[20*i+j-1] == 3 && j != 0){
                collisionDetector[4] = false
            }
            if(all[20*i+j-1] == 1 && j != 0){
                collisionDetector[0] = false
            }
            if(all[20*i+j+20] == 1 && i != 19){
                collisionDetector[3] = false
            }
            if(all[20*i+j-20] == 1 && i != 0){
                collisionDetector[2] = false
            }
            if(all[20*i+j] >= 0){
                platform(i*20, j*20, collisionDetector, all[20*i+j])
            }
        }
    }
    if(player.v.x > 20){
        player.v.x = 20
    }
    if(player.v.x < -20){
        player.v.x = -20
    }
    if(player.v.y < -20){
        player.v.y = -20
    }
    if(player.v.y > 10){
        player.v.y = 10
    }
    if(editMode == "playing"){
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
    if(player.x<-20 || player.x>400 || player.y<-20 || player.y>400 || isNaN(player.y) || isNaN(player.x)) {
        player = {
            x: startPos[0],
            y: startPos[1],
            a: {x: 0, y: 0},
            v: {x: 0, y: 0},
        }
    }
    ctx.fillStyle = "#26A"
    ctx.fillRect(player.x, player.y, 20, 20)
    if(pressedpointer){
        for(var i = 0; i < 20; i++){
            for(var j = 0; j < 20; j++){
                if(Math.floor((pointerxy[0])/20) == i && Math.floor((pointerxy[1])/20) == j && typeof(editMode) == "number"){
                    all[20*i+j] = editMode
                }
            }   
        }
    }
    if(status[0] == 1){
        dragForce[0] = -(1/2)*airDensity*player.v.x*player.v.x*Math.sign(player.v.x)
        dragForce[1] = -(1/2)*airDensity*player.v.y*player.v.y*Math.sign(player.v.y)
        buoyancy = -airDensity*gravity
        frictionForce[0] = 0
        frictionForce[1] = 0
    }
    if(status[4] == 1){
        dragForce[0] = -(1/2)*waterDensity*player.v.x*player.v.x*Math.sign(player.v.x)
        dragForce[1] = -(1/2)*waterDensity*player.v.y*player.v.y*Math.sign(player.v.y)
        buoyancy = -waterDensity*gravity
        frictionForce[0] = 0
        frictionForce[1] = 0
    }
    if(status[1] == 1){
        frictionForce[0] = -gravity*friction*player.v.x
        frictionForce[1] = -gravity*friction*player.v.y
    }
    
    document.getElementById("edit").innerHTML = status + ', <br>' + player.v.x + ', <br>' + player.v.y
}
function pointerPress(event) {
    if(editMode == "playing"){
        player.v.x  = (event.x - c.offsetLeft - 10 - player.x)/100*speed
        player.v.y  = (event.y - c.offsetTop - 10 - player.y)/100*speed
    }
    pressedpointer = true
}
function changeMode(e) {
    editMode = e
    if(e == 1){
        e = "editing(adding platform)"
    }
    if(e == 2){
        e = "editing(adding x)"
    }
    if(e == 0){
        e = "editing(erasing)"
    }
    if(e == 3){
        e = "editing(adding ?)"
    }
    if(e == 4){
        e = "editing(adding water)"
    }
    document.getElementById("edit").innerHTML = "now: " + e
}
function save() {
    navigator.clipboard.writeText(all + "," + startPos)
    alert("copied")
}
function load() {
    all = document.getElementById("load").value.split(",", 400)
    startPos[0] = Number(document.getElementById('load').value.split(',')[400]);
    startPos[1] = Number(document.getElementById('load').value.split(',')[401]);
}
function moveStartPos() {
    var startPosition = document.getElementById('startPosition').value
    startPos[0] = Number(startPosition.split(',')[0]);
    startPos[1] = Number(startPosition.split(',')[1])
}
function arrowKeyMove(event) {
    if(editMode == "playing"){
        pressedKey[event.key] = true;
        
        document.addEventListener('keyup', (event) => {
            delete this.pressedKey[event.key];
        });
    }
}
window.setInterval(inGame, 1)
window.setInterval(function() {
    if(pressedKey.w){
        if(climbing && status[3] ==1){
            player.v.y = -1
        }
        if(status[1] == 1){
            player.v.y = -1.4;  
        }
        if(status[4] == 1){
            player.v.y -= waterDensity
        }
        if(status[0] == 1){
            player.v.y -= airDensity
        }
        status[1] = 0
    }
    if(pressedKey.s){
        player.a.y = 0.1;
        if(status[1] == 1){
            player.v.x = 0
        }
    }else{
        player.a.y = 0
    }
    if(pressedKey.d){
        if(player.v.x <= speed){
            player.v.x += speed/50;
        }
    }
    if(pressedKey.a){
        if(player.v.x >= -speed){
            player.v.x -= speed/50;
        }
    }
}, 1)