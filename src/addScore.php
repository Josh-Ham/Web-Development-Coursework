<?php
session_start();
if (!empty($_SESSION['user'])) {
    if ($_SESSION['display'] == 1) {
        $condb = new mysqli('localhost', 'root', 'MyDatabase1', 'tetris');
       if ($condb->connect_error) {
           die("Connection failed");
       }
       $sql = $condb->prepare("INSERT INTO Scores (username, score) VALUES (?, ?);");
       $sql->bind_param('si', $_SESSION['user'], $_POST['playerScore']);
       $sql->execute();
       $sql->close();
   }
}
?>