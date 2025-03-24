<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartStation</title>
    <link rel="shortcut icon" href="./src/public/img/logo.png" type="image/x-icon">
    <link rel="stylesheet" href="./src/public/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="./src/public/css/style.css">
    <link rel="stylesheet" href="./src/public/css/popup.css">
    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
        rel="stylesheet" />
</head>

<body>
    <?php 
        include 'header.php';
        include 'product.php';
        include 'footer.php';
        include 'login.php';
        include 'cart.php';
        include 'register.php';
        include 'updateprofile.php';
        include 'orderhistory.php';
    ?>
    <script src="./src/public/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="./src/public/js/product.js"></script>
    <script src="./src/public/js/popup.js"></script>
    <script src="./src/public/js/auth.js"></script>
</body>

</html>