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
                <table id="leaderboard">
                    <tr id="headingRow">
                        <th>Username</th>
                        <th>Score</th>
                    </tr>
                    <?php
                        //Get scores from scores table
                        $condb = new mysqli('localhost', 'root', 'MyDatabase1', 'tetris');
                        if ($condb->connect_error) {
                            die("Connection failed: " . $conn->connect_error);
                        }
                        $sql = $condb->prepare("SELECT Username, Score FROM Scores ORDER BY Score DESC");
                        $sql->execute();
                        $result = $sql->get_result();
                        $sql->close();
                        $num = 0;
                        while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
                            echo "<tr><td>".$row['Username']."</td><td>".$row['Score']."</td></tr>";
                            $num += 1;
                            if ($num > 9) {
                                break;
                            };
                        }
                    ?>
                </table>
            </div>
        </div>
    </body>
</html>