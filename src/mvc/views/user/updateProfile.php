<!-- views/updateprofile.php -->
<div id="updateProfile" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content custom-modal">
            <button type="button" class="btn-close custom-close" data-bs-dismiss="modal" aria-label="Close"></button>
            <div class="modal-body">
                <div class="text-center mb-4">
                    <h5 class="modal-title mt-2">Cập nhật thông tin</h5>
                </div>
                <form id="updateProfileForm">
                    <div class="mb-3">
                        <input type="text" class="form-control custom-input" id="updateUsername" name="username" placeholder="Tên đăng nhập" readonly>
                        <div id="updateUsernameError" class="text-danger mt-2" style="display: none;">Tên đăng nhập không được để trống!</div>
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control custom-input" id="updateFullName" name="full_name" placeholder="Họ và tên" required>
                        <div id="updateFullNameError" class="text-danger mt-2" style="display: none;">Họ và tên không được để trống!</div>
                    </div>
                    <div class="mb-3">
                        <input type="tel" class="form-control custom-input" id="updatePhone" name="phone" placeholder="Số điện thoại" required>
                        <div id="updatePhoneError" class="text-danger mt-2" style="display: none;">Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng 0!</div>
                    </div>
                    <div class="mb-3">
                        <input type="email" class="form-control custom-input" id="updateEmail" name="email" placeholder="Email" required>
                        <div id="updateEmailError" class="text-danger mt-2" style="display: none;">Email không hợp lệ!</div>
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control custom-input" id="updateAddress" name="address" placeholder="Địa chỉ" required>
                        <div id="updateAddressError" class="text-danger mt-2" style="display: none;">Địa chỉ không được để trống!</div>
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control custom-input" id="updatePassword" name="password" placeholder="Mật khẩu mới (để trống nếu không đổi)">
                        <div id="updatePasswordLengthError" class="text-danger mt-2" style="display: none;">Mật khẩu phải có ít nhất 8 ký tự!</div>
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control custom-input" id="updateConfirmPassword" name="confirm_password" placeholder="Nhập lại mật khẩu mới">
                        <div id="updatePasswordMatchError" class="text-danger mt-2" style="display: none;">Mật khẩu không khớp!</div>
                        <div id="updatePasswordMatchSuccess" class="text-success mt-2" style="display: none;">Mật khẩu khớp!</div>
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control custom-input" id="currentPassword" name="current_password" placeholder="Nhập mật khẩu hiện tại" required>
                        <div id="currentPasswordError" class="text-danger mt-2" style="display: none;">Mật khẩu hiện tại không đúng!</div>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 custom-btn">Cập nhật</button>
                </form>
            </div>
        </div>
    </div>
</div>