<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <?php
        echo "<title>{$title}</title>";
    ?>
    <title>main page</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-hashes' 'unsafe-inline'; script-src 'unsafe-eval' 'unsafe-inline' 'self' ; script-src-elem 'self' 'unsafe-inline'; script-src-attr 'unsafe-hashes';">
    <meta name="description" content="">
    <link rel="stylesheet" type="text/css" href="stylesheets/stylesheet.css" id="style">
</head>

<body>
    <h1>Title</h1>
    <ul class="menu">
        <li><a href="index.php">index</a></li>
        <li><a href="users">user</a></li>
        <li id="accountLink"></li>
    </ul>
        <script src="javascripts/storage.js"></script>
    <div class="main">