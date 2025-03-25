<?php
    session_start();
    session_destroy();
    header("Location: login.php");
    exit();
?>
// Compare this snippet from src/views/admin/login.php: