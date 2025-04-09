<?php
require_once('/xampp/htdocs/smartstation/src/mvc/core/DB.php');

$db = (new DB())->conn;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $newPassword = $_POST['new_password'] ?? '';

    if (empty($username) || empty($newPassword)) {
        echo "Vui lòng nhập đầy đủ thông tin.";
        exit;
    }

    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

    $stmt = $db->prepare("UPDATE taikhoan SET MatKhau = ? WHERE TaiKhoan = ?");
    $stmt->bind_param("ss", $hashedPassword, $username);

    if ($stmt->execute()) {
        echo "✅ Đặt lại mật khẩu thành công cho tài khoản <b>$username</b>!";
    } else {
        echo "❌ Có lỗi xảy ra khi cập nhật mật khẩu.";
    }
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Reset Mật Khẩu</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body class="container mt-5">
    <h3>🔒 Reset mật khẩu tài khoản</h3>
    <form method="POST" class="mt-3">
        <div class="mb-3">
            <label for="username" class="form-label">Tên tài khoản</label>
            <input type="text" class="form-control" name="username" required>
        </div>
        <div class="mb-3">
            <label for="new_password" class="form-label">Mật khẩu mới</label>
            <input type="text" class="form-control" name="new_password" required>
        </div>
        <button type="submit" class="btn btn-primary">Đặt lại mật khẩu</button>
    </form>
</body>
</html>
