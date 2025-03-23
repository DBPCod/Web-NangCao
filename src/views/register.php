<!-- views/register_popup.php -->
<div id="registerPopup" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content custom-modal">
            <button type="button" class="btn-close custom-close" data-bs-dismiss="modal" aria-label="Close"></button>
            <div class="modal-body">
                <div class="text-center mb-4">
                    <h5 class="modal-title mt-2">Đăng ký</h5>
                </div>
                <form action="controllers/auth_controller.php" method="POST" id="registerForm">
                    <div class="mb-3">
                        <input type="text" class="form-control custom-input" id="registerUsername" name="username" placeholder="Tên đăng nhập" required>
                        <div id="usernameError" class="text-danger mt-2" style="display: none;">Tên đăng nhập không được để trống!</div>
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control custom-input" id="registerPassword" name="password" placeholder="Mật khẩu" required>
                        <div id="passwordLengthError" class="text-danger mt-2" style="display: none;">Mật khẩu phải có ít nhất 8 ký tự!</div>
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control custom-input" id="confirmPassword" name="confirm_password" placeholder="Nhập lại mật khẩu" required>
                        <div id="passwordMatchError" class="text-danger mt-2" style="display: none;">Mật khẩu không khớp!</div>
                        <div id="passwordMatchSuccess" class="text-success mt-2" style="display: none;">Mật khẩu khớp!</div>
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control custom-input" id="fullName" name="full_name" placeholder="Họ và tên" required>
                        <div id="fullNameError" class="text-danger mt-2" style="display: none;">Họ và tên không được để trống!</div>
                    </div>
                    <div class="mb-3">
                        <input type="tel" class="form-control custom-input" id="phone" name="phone" placeholder="Số điện thoại" required>
                        <div id="phoneError" class="text-danger mt-2" style="display: none;">Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng 0!</div>
                    </div>
                    <div class="mb-3">
                        <input type="email" class="form-control custom-input" id="email" name="email" placeholder="Email" required>
                        <div id="emailError" class="text-danger mt-2" style="display: none;">Email không hợp lệ!</div>
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control custom-input" id="address" name="address" placeholder="Địa chỉ" required>
                        <div id="addressError" class="text-danger mt-2" style="display: none;">Địa chỉ không được để trống!</div>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 custom-btn">Đăng ký</button>
                </form>
                <p class="text-center mt-3">Đã có tài khoản? <a href="#" data-bs-toggle="modal" data-bs-target="#loginPopup">Đăng nhập ngay</a></p>
            </div>
        </div>
    </div>
</div>