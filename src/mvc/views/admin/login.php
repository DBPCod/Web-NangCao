<?php
    session_start();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = $_POST['username'];
        $password = $_POST['password'];

        // Giả sử kiểm tra đăng nhập thành công
        if ($username === 'admin' && $password === '123') { // Thay bằng logic kiểm tra thực tế
            $_SESSION['admin_logged_in'] = true;
            header("Location: http://localhost/smartstation/src/mvc/views/admin/");
            exit();
        } else {
            $error = "Thông tin đăng nhập không đúng";
        }
    }
?>

<!-- HTML của form login như trong DOCUMENT của bạn -->
<!DOCTYPE html>
<html>

<head>
    <title>SmartStation</title>
    <link rel="shortcut icon" href="../../../public//img/logo.png" type="image/x-icon">
    <link rel="stylesheet" href="../../../public/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="../../../public/css/adminLogin.css">
</head>

<body>
    <div class="login-container">
        <div class="illustration-side">
            <img src="../../../public/img/logo.png" alt="Login Illustration" class="illustration">
        </div>
        <div class="form-side">
            <h2>Admin Login</h2>
            <form id="adminLoginForm" method="POST">
                <div class="mb-3">
                    <input type="text" class="form-control" id="username" name="username" placeholder="Username" required>
                </div>
                <div class="mb-3">
                    <input type="password" class="form-control" id="password" name="password" placeholder="Password" required>
                </div>
                <button type="submit" class="btn btn-login w-100">LOGIN</button>
            </form>
        </div>
    </div>
</body>

</html>