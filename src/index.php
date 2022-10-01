<?php
session_start();
function loginUser($usr, $dis) {
    $_SESSION['user'] = $usr;
    $_SESSION['display'] = $dis;
}
if (isset($_POST['usrName']) && isset($_POST['paswrd'])) {
    $condb = new mysqli('localhost', 'root', 'MyDatabase1', 'tetris');
    if ($condb->connect_error) {
        die("Connection failed");
    }
    if (isset($_POST['fName'])) {
        $_SESSION['safe'] = "yes";
        $sql = $condb->prepare("SELECT firstName FROM Users WHERE username=?");
        $sql->bind_param('s', $_POST['usrName']);
        $sql->execute();
        $result = $sql->get_result()->fetch_array(MYSQLI_ASSOC);
        $sql->close();
        if (isset($result['firstName'])) {
            $_SESSION['safe'] = "Username already taken";
        } else if (preg_match('/\s/',$_POST['usrName'])) {
            $_SESSION['safe'] = "Spaces are not allowed in usernames";
        } else if (preg_match('/\s/',$_POST['fName'])) {
            $_SESSION['safe'] = "Spaces are not allowed in first name";
        } else if ($_POST['paswrd'] != $_POST['paswrd2']) {
            $_SESSION['safe'] = "Passwords do not match";
        } else if (preg_match('/\s/',$_POST['lName'])) {
            $_SESSION['safe'] = "Spaces are not allowed in last name";
        } else if (strlen($_POST['paswrd']) < 8) {
            $_SESSION['safe'] = "Password is too short";
        } else if (strpos(strtolower($_POST['paswrd']), strtolower($_POST['fName'])) !== false) {
            $_SESSION['safe'] = "Password cannot conatin your name";
        } else if (strpos(strtolower($_POST['paswrd']), strtolower($_POST['lName'])) !== false) {
            $_SESSION['safe'] = "Password cannot conatin your name";
        } else if (strpos(strtolower($_POST['paswrd']), strtolower($_POST['fName'])) !== false) {
            $_SESSION['safe'] = "Password cannot conatin your username";
        }

        if ($_SESSION['safe'] == "yes") {
            // Insert into database
            $display = $_POST['display'] == "yes" ? 1 : 0;
            $pass_hash = password_hash($_POST['paswrd'], PASSWORD_DEFAULT);
            $sql = $condb->prepare("INSERT INTO Users (username, firstName, lastName, password, display) VALUES (?, ?, ?, ?, ?)");
            $sql->bind_param('ssssi', $_POST['usrName'], $_POST['fName'], $_POST['lName'], $pass_hash, $display);
            $sql->execute();
            $sql->close();
            unset($_SESSION['safe']);
            loginUser($_POST['usrName'], $display);
        } else {
            $host  = $_SERVER['HTTP_HOST'];
            $url   = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
            $extra = 'register.php';
            header("Location: http://$host$url/$extra");
            exit;
        }
    } else {
        $sql = $condb->prepare("SELECT password, display FROM Users WHERE username=?");
        $sql->bind_param('s', $_POST['usrName']);
        $sql->execute();
        $result = $sql->get_result()->fetch_array(MYSQLI_ASSOC);
        $sql->close();

        if ($result == null) {
            $password = "";
            $display = 0;
        } else {
            $password = $result['password'];
            $display = $result['display'];
        }

        if (password_verify($_POST['paswrd'], $password)) {
            loginUser($_POST['usrName'], $display);
        } else {
            $password = "";
        }
    }
}
?>
<!doctype html>
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
                <?php
                if(empty($_SESSION['user'])) {
                    echo "<form action=\"\" method=\"POST\">
                    <div class=\"form\">
                        <label for=\"usrName\">Username:</label>
                        <input type=\"text\" name=\"usrName\" id=\"usrName\" placeholder=\"username\" required><br>
                    </div>
                    <div class=\"form\">
                        <label for=\"paswrd\">Password:</label>
                        <input type=\"password\" name=\"paswrd\" id=\"paswrd\" required><br>
                    </div>
                    <div class=\"form\">
                        <input type=\"submit\">
                    </div>
                </form>";

                if (isset($password)) {
                    if ($password == "") {
                        echo "<div id=\"warning\">!Username or password is incorrect!</div>";
                    }
                };

                echo "<p>
                    Don't have a user account? <a href=\"register.php\">Register now</a>
                </p>";
                } else {
                    echo "<h1>Welcome to Tetris</h1>
                    <a href=\"tetris.php\"><button type=\"button\">Click here to play</button></a>";
                }
                ?>
            </div>
        </div>
    </body>
</html>