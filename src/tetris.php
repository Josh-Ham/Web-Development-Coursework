<?php
session_start();
?>
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="style.css">
        <script src="tetris.js"></script>
    </head>
    <body>
        <ul id="navbar">
            <div>
                <li name="home"><a href="index.php">Home</a></li>
            </div>
            <div>
                <li name="tetris"><a href="tetris.php">Play Tetris</a></li>
                <li name="leaderboard"><a href="leaderboard.php">Leaderboard</a></li>
            </div>
        </ul>

        <div class="main">
            <div id="greybox">
                <?php
                    echo "<input type=\"button\" value=\"Start Game\" onclick=\"tetris()\" id=\"startButton\">";
                ?>
            </div>
        </div>

        <audio src="sound/Tetris_Tune - 25:03:2022, 16.11.wav" autoplay loop></audio>
    </body>
</html>
