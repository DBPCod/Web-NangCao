<!-- views/register_popup.php -->
<div id="registerPopup" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content custom-modal">
            <button type="button" class="btn-close custom-close" data-bs-dismiss="modal" aria-label="Close"></button>
            <div class="modal-body">
                <div class="text-center mb-4">
                
                    <h5 class="modal-title mt-2">Đăng ký</h5>
                </div>
                <form action="controllers/auth_controller.php" method="POST">
                    <div class="mb-3">
                        <input type="text" class="form-control custom-input" id="registerUsername" name="username" placeholder="Tên đăng nhập" required>
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control custom-input" id="registerPassword" name="password" placeholder="Mật khẩu" required>
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control custom-input" id="fullName" name="full_name" placeholder="Họ và tên" required>
                    </div>
                    <div class="mb-3">
                        <input type="tel" class="form-control custom-input" id="phone" name="phone" placeholder="Số điện thoại" required>
                    </div>
                    <div class="mb-3">
                        <input type="email" class="form-control custom-input" id="email" name="email" placeholder="Email" required>
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control custom-input" id="address" name="address" placeholder="Địa chỉ" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 custom-btn">Đăng ký</button>
                </form>
                <p class="text-center mt-3">Đã có tài khoản? <a href="#" data-bs-toggle="modal" data-bs-target="#loginPopup">Đăng nhập ngay</a></p>
            </div>
        </div>
    </div>
</div>