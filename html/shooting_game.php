        <?php 
            $title = "index";
            include("inheritance.php");
        ?>
            <h2>Shooting Game</h2>
            <p>This is a 2 player shooting game</p>
            <input id="startbutton" onclick="gameStart()" class="button" value="start" type="submit">
            <br>
            <canvas id="canvas2" width="400px" height="400px"></canvas>
            <p id="winner"> </p>
            <details>
                <summary>how to play</summary>
                <p>press wasd(arrow keys) to move<br>
                press q(p) to aim<br>
                press e(o) to shoot<br>
                You must push other player offscreen to win.
                </p>
            </details>
        </div>
        <script src="javascripts/js%20-%20shooting%20game.js"></script>
    </body>
</html>