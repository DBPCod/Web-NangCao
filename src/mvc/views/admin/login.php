<title>SmartStation</title>
<link rel="shortcut icon" href="./src/public/img/logo.png" type="image/x-icon">
<link rel="stylesheet" href="./src/public/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="./src/public/css/adminLogin.css">
<div class="login-container">
    <!-- Illustration Side (Left) -->
    <div class="illustration-side">
        <img src="./src/public/img/logo.png" alt="Login Illustration" class="illustration">
    </div>

    <!-- Form Side (Right) -->
    <div class="form-side">
        <h2>Admin Login</h2>
        <form id="adminLoginForm">
            <div class="mb-3">
                <input type="text" class="form-control" id="username" placeholder="Username" required>
            </div>
            <div class="mb-3">
                <input type="password" class="form-control" id="password" placeholder="Password" required>
            </div>
            <button type="submit" class="btn btn-login w-100">LOGIN</button>
        </form>
    </div>
</div>