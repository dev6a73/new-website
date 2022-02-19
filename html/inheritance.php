<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <?php
        echo "<title>{$title}</title>";
    ?>
    <title>main page</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'unsafe-inline' 'self' 'https://localhost:3000'; script-src-elem 'self' 'unsafe-inline'; script-src-attr 'unsafe-hashes';">
    <link rel="stylesheet" type="text/css" href="stylesheets/stylesheet.css" id="style">
    <style>
        #canvas1 {
            background-color: #123;
        }
        #Advanced {
            display: none;
        }
        #winner {
            position: relative;
            top: -250px;
            margin-left: 150px;
            font-size: 20px;
            color: #111;
        }
        #canvas2 {
            margin-top: 40px;
            background-color: #EEE;
        }
        details {
            margin:8px;
        }
    </style>
    <script>
        var user_controller = require('../controllers/userController');
        <?php
            $nowacc = "<script>document.write(user_controller.nowacc)</script>"
        ?>
    </script>
</head>

<body>
    <h1>Title</h1>
    <ul class="menu">
        <li><a href="index.php">main</a></li>
        <li><a href="shooting_game.php">game</a></li>
        <li><a href="mailto:no-reply@accounts.google.com">mail</a></li>
        <li><a href="https://en.wikipedia.org/wiki/Blog">blog</a></li>
        <li><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">video</a></li>
        <li><a href="users">user</a></li>
        <?php
            echo "account: <br>{$nowacc}"
        ?>
    </ul>
    
    <div class="main">