            var pressedKey = {};
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            var winnerText = document.getElementById("winner")
            var isGamePlaying = false
            var player1 = {x: 40, y: 180, now: {x: 40, y: 40}}
            var gun1 = {
                angle: 0,
                dist: undefined,
                nowAngle: 0,
            }
            var player2 = {x: 20, y: 180, now: {x: 40, y: 180}}
            var gun2 = {
                angle: Math.PI,
                dist: undefined,
                nowAngle: Math.PI,
            }
            function gameStart() {
                isGamePlaying = true
                document.getElementById("startbutton").value = "reset"
                winnerText.innerHTML = ""
                player1 = {x: 40, y: 180, now: {x: 40, y: 40}}
                gun1 = {
                    angle: 0,
                    dist: undefined,
                    nowAngle: 0,
                }
                player2 = {x: 320, y: 180, now: {x: 40, y: 180}}
                gun2 = {
                    angle: Math.PI,
                    dist: undefined,
                    nowAngle: Math.PI,
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
                    ctx.fillRect(5 + player1.now.x + gun1.dist*Math.cos(gun1.nowAngle), 5 + player1.now.y + gun1.dist*Math.sin(gun1.nowAngle), 10, 10)
                    ctx.fillRect(5 + player2.now.x + gun2.dist*Math.cos(gun2.nowAngle), 5 + player2.now.y + gun2.dist*Math.sin(gun2.nowAngle), 10, 10)
                    gun1.dist += 1;
                    gun2.dist += 1;
                    if(gun1.dist > 200 || isNaN(gun1.dist)){
                        gun1.dist = undefined;
                    }
                    if(gun2.dist > 200 || isNaN(gun2.dist)){
                        gun2.dist = undefined;
                    }
                    window.addEventListener("keydown", arrowKeyMove("keydown"))
                    if(player1.x>=-10 + player2.now.x + gun2.dist*Math.cos(gun2.nowAngle) && player1.x-20<=player2.now.x + gun2.dist*Math.cos(gun2.nowAngle) && player1.y>=-10 + player2.now.y + gun2.dist*Math.sin(gun2.nowAngle) && player1.y-20<=player2.now.y + gun2.dist*Math.sin(gun2.nowAngle)){
                        player1.x += 2*Math.cos(gun2.nowAngle)
                        player1.y += 2*Math.sin(gun2.nowAngle)
                    }
                    if(player2.x>=-10 + player1.now.x + gun1.dist*Math.cos(gun1.nowAngle) && player2.x-20<=player1.now.x + gun1.dist*Math.cos(gun1.nowAngle) && player2.y>=-10 + player1.now.y + gun1.dist*Math.sin(gun1.nowAngle) && player2.y-20<=player1.now.y + gun1.dist*Math.sin(gun1.nowAngle)){
                        player2.x += 2*Math.cos(gun1.nowAngle)
                        player2.y += 2*Math.sin(gun1.nowAngle)
                    }
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
                    if(pressedKey.e && gun1.dist == undefined) {
                        gun1.dist = 0;
                        gun1.nowAngle = gun1.angle;
                        player1.now.x = player1.x
                        player1.now.y = player1.y
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
                    if(pressedKey.o && gun2.dist == undefined) {
                        gun2.dist = 0;
                        gun2.nowAngle = gun2.angle;
                        player2.now.x = player2.x
                        player2.now.y = player2.y
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