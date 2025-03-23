// src/public/js/popup.js
document.addEventListener('DOMContentLoaded', function () {
    // Đóng tất cả modal trước khi mở modal mới
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function () {
            modals.forEach(otherModal => {
                if (otherModal !== modal && otherModal.classList.contains('show')) {
                    const modalInstance = bootstrap.Modal.getInstance(otherModal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                }
            });
        });
    });

    // Xử lý giỏ hàng
    const cartPopup = document.getElementById('cartPopup');
    cartPopup.addEventListener('show.bs.modal', function () {
        const cartItems = document.querySelector('.cart-items');
        const cartEmpty = document.querySelector('.cart-empty');
        const cartItemCount = cartItems.children.length;

        if (cartItemCount === 0) {
            cartItems.style.display = 'none';
            cartEmpty.style.display = 'block';
        } else {
            cartItems.style.display = 'block';
            cartEmpty.style.display = 'none';
        }
    });

    document.querySelectorAll('.cart-item .btn-danger').forEach(button => {
        button.addEventListener('click', function () {
            this.closest('.cart-item').remove();
            const cartPopupInstance = bootstrap.Modal.getInstance(cartPopup);
            cartPopup.dispatchEvent(new Event('show.bs.modal'));
        });
    });

    // Kiểm tra form đăng ký
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const usernameInput = document.getElementById('registerUsername');
        const passwordInput = document.getElementById('registerPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const fullNameInput = document.getElementById('fullName');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        const addressInput = document.getElementById('address');

        const usernameError = document.getElementById('usernameError');
        const passwordLengthError = document.getElementById('passwordLengthError');
        const passwordMatchError = document.getElementById('passwordMatchError');
        const passwordMatchSuccess = document.getElementById('passwordMatchSuccess');
        const fullNameError = document.getElementById('fullNameError');
        const phoneError = document.getElementById('phoneError');
        const emailError = document.getElementById('emailError');
        const addressError = document.getElementById('addressError');

        // Hàm kiểm tra email hợp lệ
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        // Hàm kiểm tra số điện thoại hợp lệ (10 số, bắt đầu bằng 0)
        function isValidPhone(phone) {
            const phoneRegex = /^0\d{9}$/;
            return phoneRegex.test(phone);
        }

        // Kiểm tra thời gian thực khi người dùng nhập
        usernameInput.addEventListener('input', function () {
            if (this.value.trim() === '') {
                usernameError.style.display = 'block';
            } else {
                usernameError.style.display = 'none';
            }
        });

        passwordInput.addEventListener('input', function () {
            const password = this.value;
            const confirmPassword = confirmPasswordInput.value;

            if (password.length < 8) {
                passwordLengthError.style.display = 'block';
            } else {
                passwordLengthError.style.display = 'none';
            }

            if (password !== confirmPassword && confirmPassword !== '') {
                passwordMatchError.style.display = 'block';
                passwordMatchSuccess.style.display = 'none';
            } else if (password === confirmPassword && confirmPassword !== '') {
                passwordMatchError.style.display = 'none';
                passwordMatchSuccess.style.display = 'block';
            } else {
                passwordMatchError.style.display = 'none';
                passwordMatchSuccess.style.display = 'none';
            }
        });

        confirmPasswordInput.addEventListener('input', function () {
            const password = passwordInput.value;
            const confirmPassword = this.value;

            if (password !== confirmPassword) {
                passwordMatchError.style.display = 'block';
                passwordMatchSuccess.style.display = 'none';
            } else if (password === confirmPassword && confirmPassword !== '') {
                passwordMatchError.style.display = 'none';
                passwordMatchSuccess.style.display = 'block';
            } else {
                passwordMatchError.style.display = 'none';
                passwordMatchSuccess.style.display = 'none';
            }
        });

        fullNameInput.addEventListener('input', function () {
            if (this.value.trim() === '') {
                fullNameError.style.display = 'block';
            } else {
                fullNameError.style.display = 'none';
            }
        });

        phoneInput.addEventListener('input', function () {
            if (!isValidPhone(this.value)) {
                phoneError.style.display = 'block';
            } else {
                phoneError.style.display = 'none';
            }
        });

        emailInput.addEventListener('input', function () {
            if (!isValidEmail(this.value)) {
                emailError.style.display = 'block';
            } else {
                emailError.style.display = 'none';
            }
        });

        addressInput.addEventListener('input', function () {
            if (this.value.trim() === '') {
                addressError.style.display = 'block';
            } else {
                addressError.style.display = 'none';
            }
        });

        // Kiểm tra khi gửi form
        registerForm.addEventListener('submit', function (e) {
            let hasError = false;

            if (usernameInput.value.trim() === '') {
                usernameError.style.display = 'block';
                hasError = true;
            } else {
                usernameError.style.display = 'none';
            }

            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            if (password.length < 8) {
                passwordLengthError.style.display = 'block';
                hasError = true;
            } else {
                passwordLengthError.style.display = 'none';
            }

            if (password !== confirmPassword) {
                passwordMatchError.style.display = 'block';
                passwordMatchSuccess.style.display = 'none';
                hasError = true;
            } else if (password === confirmPassword && confirmPassword !== '') {
                passwordMatchError.style.display = 'none';
                passwordMatchSuccess.style.display = 'block';
            }

            if (fullNameInput.value.trim() === '') {
                fullNameError.style.display = 'block';
                hasError = true;
            } else {
                fullNameError.style.display = 'none';
            }

            if (!isValidPhone(phoneInput.value)) {
                phoneError.style.display = 'block';
                hasError = true;
            } else {
                phoneError.style.display = 'none';
            }

            if (!isValidEmail(emailInput.value)) {
                emailError.style.display = 'block';
                hasError = true;
            } else {
                emailError.style.display = 'none';
            }

            if (addressInput.value.trim() === '') {
                addressError.style.display = 'block';
                hasError = true;
            } else {
                addressError.style.display = 'none';
            }

            if (hasError) {
                e.preventDefault();
            }
        });
    }
});

// Hàm xử lý mouseenter
function handleMouseEnter() {
    const accountDropdown = document.getElementById('accountDropdown');
    accountDropdown.style.display = 'block';
}

// Hàm xử lý mouseleave
function handleMouseLeave() {
    const accountDropdown = document.getElementById('accountDropdown');
    accountDropdown.style.display = 'none';
}