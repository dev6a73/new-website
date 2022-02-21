            <?php 
                $title = "platform game";
                include("inheritance.php");
            ?>
            <h2>Platform Game</h2>
            <p></p>
            <canvas id="canvas1" width="400px" height="400px"></canvas>
            <br>
            <input type="button" class="button changemode" value="play">
            <input type="button" class="button changemode" value="erase">
            <input type="button" class="button changemode" value="add platform">
            <input type="button" class="button changemode" value="add x">
            <input type="button" class="button changemode" value="add ?">
            <input type="button" class="button changemode" value="add water">
            <br>
            <br>
            <input type="button" class="button" value="Advanced" id="advancedopener">
            <div id="Advanced">
                <br>
                <input type="text" class="button" placeholder="start position ex.) 60, 340" id="startPosition">
                <input type="button" class="button" value="apply" id="applyStartPos">
            </div>
            <p id="edit"> </p>
            <input type="button" class="button" value="save" id="save">
            <input type="text" class="button" placeholder="load" id="load">
        </div>
        <script src="javascripts/platform_game.js">
        </script>
    </body>
</html>