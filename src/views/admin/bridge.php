<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartStation</title>
    <link rel="shortcut icon" href="./src/public/img/logo.png" type="image/x-icon">
    <link rel="stylesheet" href="./src/public/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="./src/public/css/admin.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
</head>

<body>
    <?php
        include 'header.php';
    ?>
    <div class="container-fluid">
        <div class="row">
            <?php include 'sidebar.php'; ?>

            <div class="col-md-9 col-lg-10 content-area">
                <?php
                    // Kiểm tra xem người dùng chọn trang nào
                    $page = isset($_GET['page']) ? $_GET['page'] : 'dashboard';

                    switch ($page) {
                        case 'users':
                            include 'users.php';
                            break;
                        case 'products':
                            include 'products.php';
                            break;
                        case 'orders':
                            include 'orders.php';
                            break;
                        case 'statistics':
                            include 'statistics.php';
                            break;
                        default:
                            include 'dashboard.php';
                            break;
                    }
                ?>
            </div>
        </div>
    </div>

    <script src="./src/public/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="./src/public/js/jquery.js"></script>
</body>

</html>
