<!-- views/login_popup.php -->
<div id="loginPopup" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content custom-modal">
            <!-- Bỏ modal-header, thêm nút đóng trực tiếp vào modal-content -->
            <button type="button" class="btn-close custom-close" data-bs-dismiss="modal" aria-label="Close"></button>
            <div class="modal-body">
                <h5 class="modal-title text-center mb-4">Đăng nhập</h5>
                
                <form action="" method="POST">
                    <div class="mb-3">
                        <input type="text" class="form-control custom-input" id="username" name="username" placeholder="Tên đăng nhập" required>
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control custom-input" id="password" name="password" placeholder="Mật khẩu" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 custom-btn">Đăng nhập</button>
                </form>
                <p class="text-center mt-3">Chưa có tài khoản? <a href="#" data-bs-toggle="modal" data-bs-target="#registerPopup">Đăng ký ngay</a></p>
            </div>
        </div>
    </div>
</div>