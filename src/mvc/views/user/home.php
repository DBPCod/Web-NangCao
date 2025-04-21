<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartStation</title>
    <link rel="shortcut icon" href="../../../public/img/logo.png" type="image/x-icon">
    <link rel="stylesheet" href="../../../public/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="../../../public/css/style.css">
    <link rel="stylesheet" href="../../../public/css/popup.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" />
    <link rel="stylesheet" href="../../../public/toast_message/main.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>
    <div id="toast" class="toast-container"></div>
    <?php 
        include 'header.php';
        include 'product.php';
        include 'footer.php';
        include 'login.php';
        include 'cart.php';
        include 'registerForm.php';
        include 'updateProfile.php';
        include 'orderHistory.php';
        include 'multiProductCheckout.php';
        include 'singleProductCheckout.php';
    ?>
    <script src="../../../public/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="../../../public/js/jquery.js"></script>
    <script src="../../../public/js/product.js"></script>
    <script src="../../../public/js/popup.js"></script>
    <script src="../../../public/toast_message/main.js"></script>
    <script src="../../../public/js/auth.js"></script>
    <script src="../../../public/js/singleProductCheckout.js"></script>
    <script src="../../../public/js/multiProductCheckout.js"></script>
</body>