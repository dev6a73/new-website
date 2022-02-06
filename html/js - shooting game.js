var pressedKey = {};
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var winnerText = document.getElementById("winner")
var isGamePlaying = false
var player1 = {x: 40, y: 180, now: {x: [undefined, undefined, undefined], y: [undefined, undefined, undefined]}}
var gun1 = {
    angle: 0,
    dist: [undefined, undefined, undefined],
    nowAngle: [undefined, undefined, undefined],
    now: 0,
    recharge: 0,
}
var player2 = {x: 20, y: 180, now: {x: [undefined, undefined, undefined], y: [undefined, undefined, undefined]}}
var gun2 = {
    angle: Math.PI,
    dist: [undefined, undefined, undefined],
    nowAngle: [undefined, undefined, undefined],
    now: 0,
    recharge: 0,
}
function gameStart() {
    isGamePlaying = true
    document.getElementById("startbutton").value = "reset"
    winnerText.innerHTML = ""
    player1 = {x: 40, y: 180, now: {x: [undefined, undefined, undefined], y: [undefined, undefined, undefined]}}
    gun1 = {
        angle: 0,
        dist: [undefined, undefined, undefined],
        nowAngle: [undefined, undefined, undefined],
        now: 0,
        recharge: 0,
    }
    player2 = {x: 320, y: 180, now: {x: [undefined, undefined, undefined], y: [undefined, undefined, undefined]}}
    gun2 = {
        angle: Math.PI,
        dist: [undefined, undefined, undefined],
        nowAngle: [undefined, undefined, undefined],
        now: 0,
        recharge: 0,
    }
}
function gamePlaying() {
    if(isGamePlaying){
        ctx.fillStyle = "#EEE"
        ctx.fillRect(0, 0, 400, 400)
        ctx.fillStyle = "#8B0"
        ctx.fillRect(player1.x, player1.y, 20, 20);
        ctx.fillStyle = "#B80"
        ctx.fillRect(player2.x, player2.y, 20, 20);
        ctx.beginPath();
        ctx.moveTo(player1.x + 10, player1.y + 10)
        ctx.lineTo(10 + player1.x + 10*Math.cos(gun1.angle), 10 + player1.y + 10*Math.sin(gun1.angle))
        ctx.stroke()
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(player2.x + 10, player2.y + 10)
        ctx.lineTo(10 + player2.x + 10*Math.cos(gun2.angle), 10 + player2.y + 10*Math.sin(gun2.angle))
        ctx.stroke()
        ctx.closePath();
        ctx.fillStyle = "#111"
        for(var i = 0; i < 3; i++){
            ctx.fillRect(5 + player1.now.x[i] + gun1.dist[i]*Math.cos(gun1.nowAngle[i]), 5 + player1.now.y[i] + gun1.dist[i]*Math.sin(gun1.nowAngle[i]), 10, 10)
            ctx.fillRect(5 + player2.now.x[i] + gun2.dist[i]*Math.cos(gun2.nowAngle[i]), 5 + player2.now.y[i] + gun2.dist[i]*Math.sin(gun2.nowAngle[i]), 10, 10)
            gun1.dist[i] += 1;
            gun2.dist[i] += 1;
            if(gun1.dist[i] > 400 || isNaN(gun1.dist[i])){
                gun1.dist[i] = undefined;
            }
            if(gun2.dist[i] > 400 || isNaN(gun2.dist[i])){
                gun2.dist[i] = undefined;
            }
            if(player1.x>=-10 + player2.now.x[i] + gun2.dist[i]*Math.cos(gun2.nowAngle[i]) && player1.x-20<=player2.now.x[i] + gun2.dist[i]*Math.cos(gun2.nowAngle[i]) && player1.y>=-10 + player2.now.y[i] + gun2.dist[i]*Math.sin(gun2.nowAngle[i]) && player1.y-20<=player2.now.y[i] + gun2.dist[i]*Math.sin(gun2.nowAngle[i])){
                player1.x += 2*Math.cos(gun2.nowAngle[i])
                player1.y += 2*Math.sin(gun2.nowAngle[i])
            }
            if(player2.x>=-10 + player1.now.x[i] + gun1.dist[i]*Math.cos(gun1.nowAngle[i]) && player2.x-20<=player1.now.x[i] + gun1.dist[i]*Math.cos(gun1.nowAngle[i]) && player2.y>=-10 + player1.now.y[i] + gun1.dist[i]*Math.sin(gun1.nowAngle[i]) && player2.y-20<=player1.now.y[i] + gun1.dist[i]*Math.sin(gun1.nowAngle[i])){
                player2.x += 2*Math.cos(gun1.nowAngle[i])
                player2.y += 2*Math.sin(gun1.nowAngle[i])
            }
        }
        gun1.recharge -= 0.01;
        gun2.recharge -= 0.01;
        window.addEventListener("keydown", arrowKeyMove("keydown"))
        if(player1.x<-20 || player1.x>400 || player1.y<-20 || player1.y>400){
            winnerText.innerHTML = "<em>player2</em> won!"
            isGamePlaying = false
        }
        if(player2.x<-20 || player2.x>400 || player2.y<-20 || player2.y>400){
            winnerText.innerHTML = "<em>player1</em> won!"
            isGamePlaying = false
        }
    }
}
function arrowKeyMove(event) {
    if(isGamePlaying){
        pressedKey[event.key] = true;
        if(pressedKey.w){
            player1.y -= 0.5
        }
        if(pressedKey.d) {
            player1.x += 0.5
        }
        if(pressedKey.s) {
            player1.y += 0.5
        }
        if(pressedKey.a) {
            player1.x -= 0.5
        }
        if(pressedKey.q) {
            gun1.angle += 0.02
        }
        if(pressedKey.e) {
            if(gun1.dist[gun1.now] == undefined && gun1.recharge < 0){
                gun1.recharge = 1;
                gun1.dist[gun1.now] = 0;
                gun1.nowAngle[gun1.now] = gun1.angle;
                player1.now.x[gun1.now] = player1.x
                player1.now.y[gun1.now] = player1.y
                gun1.now += 1;
                gun1.now = gun1.now % 3
            }
        }
        if(pressedKey.ArrowUp){
            player2.y -= 0.5
        }
        if(pressedKey.ArrowRight) {
            player2.x += 0.5
        }
        if(pressedKey.ArrowDown) {
            player2.y += 0.5
        }
        if(pressedKey.ArrowLeft) {
            player2.x -= 0.5
        }
        if(pressedKey.p) {
            gun2.angle += 0.02
        }
        if(pressedKey.o) {
            if(gun2.dist[gun2.now] == undefined && gun2.recharge < 0){
                gun2.recharge = 1;
                gun2.dist[gun2.now] = 0;
                gun2.nowAngle[gun2.now] = gun2.angle;
                player2.now.x[gun2.now] = player2.x
                player2.now.y[gun2.now] = player2.y
                gun2.now += 1;
                gun2.now = gun2.now % 3
            }
        }
        if(pressedKey.r && pressedKey.t) {
            gameStart();
        }
        document.addEventListener('keyup', (event) => {
            delete this.pressedKey[event.key];
        });
    }
}
window.setInterval(gamePlaying, 1)