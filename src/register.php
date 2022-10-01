<?php
session_start();
?>
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="style.css">
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
                <div id="warning"><?php if (isset($_SESSION['safe'])) { echo "!".$_SESSION['safe']."!"; };?></div>
                <?php unset($_SESSION['safe']); ?>
                <form action="index.php" method="POST">
                    <div class="form">
                        <label for="fName">First name:</label>
                        <input type="text" name="fName" id="fName" required>
                    </div>
                    <div class="form">
                        <label for="lName">Last name:</label>
                        <input type="text" name="lName" id="lName" required>
                    </div>
                    <div class="form">
                        <label for="usrName">Username:</label>
                        <input type="text" name="usrName" id="usrName" required>
                    </div>
                    <div class="form">
                        <label for="paswrd">Password:</label>
                        <input type="password" name="paswrd" id="paswrd" placeholder="Password" required>
                    </div>
                    <div class="form">
                        <label for="paswrd2">Confirm password:</label>
                        <input type="password" name="paswrd2" id="paswrd2" placeholder="Confirm password" required>
                    </div>
                    <div class="form">
                        <div>
                            <p>Display Score<br>on Leaderboard?</p>
                        </div>
                        <div class="radioAnswers">
                            <label for="yes">Yes<input type="radio" name="display" id="yes" value="yes" required></label>
                            <label for="no">No<input type="radio" name="display" id="no" value="no"></label>
                        </div>
                    </div>
                    <div>
                        <input type="submit" value="Register">
                    </div>
                </form>
            </div>
        </div>
    </body>
</html>