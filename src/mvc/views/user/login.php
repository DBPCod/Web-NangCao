<!-- views/login_popup.php -->
<div id="loginPopup" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content custom-modal">
            <button type="button" class="btn-close custom-close" data-bs-dismiss="modal" aria-label="Close"></button>
            <div class="modal-body">
                <h5 class="modal-title text-center mb-4">Đăng nhập</h5>

                <form action="" method="POST">
                    <div class="mb-3 position-relative">
                        <input type="text" class="form-control custom-input" id="username" name="username" placeholder="Tên đăng nhập" required>
                        <span class="warning-icon bi bi-exclamation-triangle-fill d-none" id="username-warning"></span>
                        <!-- Thông báo lỗi cho tài khoản -->
                        <div id="username-error" class="error-message text-danger d-none">Tên đăng nhập không đúng!</div>
                    </div>
                    <div class="mb-3 position-relative">
                        <input type="password" class="form-control custom-input" id="password" name="password" placeholder="Mật khẩu" required>
                        <span class="warning-icon bi bi-exclamation-triangle-fill d-none" id="password-warning"></span>
                        <!-- Thông báo lỗi cho mật khẩu -->
                        <div id="password-error" class="error-message text-danger d-none">Mật khẩu không đúng!</div>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 custom-btn">Đăng nhập</button>
                </form>
                <p class="text-center mt-3">Chưa có tài khoản? <a href="#" data-bs-toggle="modal" data-bs-target="#registerPopup">Đăng ký ngay</a></p>
            </div>
        </div>
    </div>
</div>

<!-- Thêm Bootstrap Icons (nếu chưa có) -->
<!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"> -->
