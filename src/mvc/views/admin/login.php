<?php
require_once('/xampp/htdocs/smartstation/src/mvc/core/DB.php');
session_start();

$db = (new DB())->conn;

function GetMatKhau($username)
{
    global $db;
    $stmt = $db->prepare("SELECT MatKhau,IdVaiTro FROM taikhoan WHERE TaiKhoan = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    return $row;
}

function LayThongTinNguoiDung($username)
{
    global $db;
    $stmt = $db->prepare("SELECT t.idnguoidung, n.hovaten, n.email 
        FROM taikhoan t 
        JOIN nguoidung n ON t.idnguoidung = n.idnguoidung 
        WHERE t.TaiKhoan = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

//--------------Permission------------------
function GetPermissions($idVaiTro)
{
    global $db;
    $stmt = $db->prepare("SELECT q.TenQuyen, qv.xem, qv.them, qv.sua, qv.xoa 
        FROM ctquyen qv 
        JOIN quyen q ON qv.IdQuyen = q.IdQuyen 
        WHERE qv.IdVaiTro = ?");
    $stmt->bind_param("i", $idVaiTro);
    $stmt->execute();
    $result = $stmt->get_result();
    $permissions = [];
    while ($row = $result->fetch_assoc()) {
        $permissions[] = $row;
    }
    return $permissions;
}
//---------------------------------------------

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    $hashedPassword = GetMatKhau($username);

    if ($hashedPassword && password_verify($password, $hashedPassword["MatKhau"])) {
        $userInfo = LayThongTinNguoiDung($username);
        //Lấy vai trò
        $idVaiTro = $hashedPassword["IdVaiTro"];

        //Lấy danh sách quyền
        $permissions = GetPermissions($idVaiTro);

        //Lưu vào session 
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_info'] = $userInfo;
        //Vai trò và quyền
        $_SESSION['IdVaiTro'] = $idVaiTro;
        $_SESSION['Permissions'] = $permissions;

        // Lưu thông tin vào cookie (thời gian sống: 30 ngày)
        $cookie_expiry = time() + (1 * 24 * 60 * 60); // 30 ngày
        setcookie('admin_idnguoidung', $userInfo['idnguoidung'], $cookie_expiry, '/');
        setcookie('admin_hovaten', $userInfo['hovaten'], $cookie_expiry, '/');

        echo json_encode([
            'success' => true,
            'message' => 'Đăng nhập thành công!',
            'redirect' => '/smartstation/src/mvc/views/admin/'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Tên đăng nhập hoặc mật khẩu không đúng.'
        ]);
    }
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>SmartStation</title>
    <link rel="shortcut icon" href="../../../public/img/logo.png" type="image/x-icon">
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
                <!-- Thêm phần hiển thị thông báo lỗi -->
                <div id="error-message" class="text-danger mt-2" style="display: none;"></div>
            </form>
        </div>
    </div>

    <!-- Thêm jQuery để xử lý AJAX -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        $(document).ready(function() {
            $('#adminLoginForm').on('submit', function(e) {
                e.preventDefault(); // Ngăn form submit mặc định

                var formData = $(this).serialize(); // Lấy dữ liệu từ form

                console.log(formData);
                $.ajax({
                    url: '', // Gửi request đến chính file này
                    type: 'POST',
                    data: formData,
                    dataType: 'json',
                    success: function(response) {
                        console.log(response);
                        if (response.success) {
                            // Nếu đăng nhập thành công, chuyển hướng
                            window.location.href = response.redirect;
                        } else {
                            // Hiển thị thông báo lỗi
                            $('#error-message').text(response.message).show();
                        }
                    },
                    error: function() {
                        $('#error-message').text('Có lỗi xảy ra, vui lòng thử lại.').show();
                    }
                });
            });

            // Ẩn thông báo lỗi khi người dùng nhập lại
            $('#username, #password').on('input', function() {
                $('#error-message').hide();
            });
        });
    </script>
</body>
</html>