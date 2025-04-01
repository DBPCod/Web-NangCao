<?php
    session_start();

    // Kiểm tra xem đã đăng nhập chưa
    if (!isset($_SESSION['admin_logged_in'])) {
        // Nếu chưa đăng nhập, chuyển hướng đến trang login
        header("Location: http://localhost/smartstation/src/mvc/views/admin/login.php");
        exit();
    }

    // Nếu đã đăng nhập, load trang dashboard
    include 'home.php';
    
