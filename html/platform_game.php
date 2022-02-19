            <?php 
                $title = "platform game";
                include("inheritance.php");
            ?>
            <h2>Platform Game</h2>
            <p></p>
            <canvas id="canvas1" width="400px" height="400px" onpointerdown="pointerPress(event)" onpointerup="pressedpointer = false;" onpointermove="pointerxy[0] = event.x - c.offsetLeft; pointerxy[1] = event.y - c.offsetTop"></canvas>
            <br>
            <input type="button" class="button" onpointerdown="changeMode('playing')" value="play">
            <input type="button" class="button" onpointerdown="changeMode(1)" value="add platform">
            <input type="button" class="button" onpointerdown="changeMode(2)" value="add x">
            <input type="button" class="button" onpointerdown="changeMode(3)" value="add ?">
            <input type="button" class="button" onpointerdown="changeMode(4)" value="add water">
            <input type="button" class="button" onpointerdown="changeMode(0)" value="erase">
            <br>
            <br>
            <input type="button" class="button" onpointerdown="document.getElementById('Advanced').style.display = 'block'" value="Advanced">
            <div id="Advanced">
                <br>
                <input type="text" class="button" placeholder="start position ex.) 60, 340" id="startPosition">
                <input type="button" class="button" onpointerdown="moveStartPos()" value="apply">
            </div>
            <p id="edit"> </p>
            <input type="button" class="button" onpointerdown="save()" value="save">
            <input type="text" class="button" onkeypress="load()" placeholder="load" id="load">
        </div>
        <script src="javascripts/platform_game.js">
        </script>
    </body>
</html>