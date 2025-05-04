<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['Permissions'])) {
    echo json_encode($_SESSION['Permissions']);
} else {
    echo json_encode([]);
}
?>