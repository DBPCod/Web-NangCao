// src/public/js/auth.js
document.addEventListener('DOMContentLoaded', function () {
    // Kiểm tra trạng thái đăng nhập khi tải trang
    checkLoginStatus();

    // Xử lý form đăng nhập
    const loginForm = document.querySelector('#loginPopup form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username && password) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);
                localStorage.setItem('fullName', '');
                localStorage.setItem('phone', '');
                localStorage.setItem('email', '');
                localStorage.setItem('address', '');

                const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginPopup'));
                loginModal.hide();

                checkLoginStatus();
            } else {
                alert('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
            }
        });
    }

    // Xử lý form đăng ký
    const registerForm = document.querySelector('#registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            const fullName = document.getElementById('fullName').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const address = document.getElementById('address').value;

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            localStorage.setItem('fullName', fullName);
            localStorage.setItem('phone', phone);
            localStorage.setItem('email', email);
            localStorage.setItem('address', address);

            const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerPopup'));
            registerModal.hide();

            checkLoginStatus();
        });
    }

    // Xử lý form cập nhật thông tin
    const updateProfileForm = document.querySelector('#updateProfileForm');
    if (updateProfileForm) {
        const updateProfileModal = document.getElementById('updateProfile');
        updateProfileModal.addEventListener('show.bs.modal', function () {
            document.getElementById('updateUsername').value = localStorage.getItem('username') || '';
            document.getElementById('updateFullName').value = localStorage.getItem('fullName') || '';
            document.getElementById('updatePhone').value = localStorage.getItem('phone') || '';
            document.getElementById('updateEmail').value = localStorage.getItem('email') || '';
            document.getElementById('updateAddress').value = localStorage.getItem('address') || '';
        });

        updateProfileForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const currentPassword = document.getElementById('currentPassword').value;
            const storedPassword = localStorage.getItem('password');
            const fullName = document.getElementById('updateFullName').value;
            const phone = document.getElementById('updatePhone').value;
            const email = document.getElementById('updateEmail').value;
            const address = document.getElementById('updateAddress').value;
            const newPassword = document.getElementById('updatePassword').value;
            const confirmPassword = document.getElementById('updateConfirmPassword').value;

            if (currentPassword !== storedPassword) {
                document.getElementById('currentPasswordError').style.display = 'block';
                return;
            } else {
                document.getElementById('currentPasswordError').style.display = 'none';
            }

            if (newPassword && newPassword.length < 8) {
                document.getElementById('updatePasswordLengthError').style.display = 'block';
                return;
            } else {
                document.getElementById('updatePasswordLengthError').style.display = 'none';
            }

            if (newPassword && newPassword !== confirmPassword) {
                document.getElementById('updatePasswordMatchError').style.display = 'block';
                document.getElementById('updatePasswordMatchSuccess').style.display = 'none';
                return;
            } else if (newPassword) {
                document.getElementById('updatePasswordMatchError').style.display = 'none';
                document.getElementById('updatePasswordMatchSuccess').style.display = 'block';
            }

            if (!fullName) {
                document.getElementById('updateFullNameError').style.display = 'block';
                return;
            } else {
                document.getElementById('updateFullNameError').style.display = 'none';
            }

            const phoneRegex = /^0\d{9}$/;
            if (!phoneRegex.test(phone)) {
                document.getElementById('updatePhoneError').style.display = 'block';
                return;
            } else {
                document.getElementById('updatePhoneError').style.display = 'none';
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                document.getElementById('updateEmailError').style.display = 'block';
                return;
            } else {
                document.getElementById('updateEmailError').style.display = 'none';
            }

            if (!address) {
                document.getElementById('updateAddressError').style.display = 'block';
                return;
            } else {
                document.getElementById('updateAddressError').style.display = 'none';
            }

            localStorage.setItem('fullName', fullName);
            localStorage.setItem('phone', phone);
            localStorage.setItem('email', email);
            localStorage.setItem('address', address);
            if (newPassword) {
                localStorage.setItem('password', newPassword);
            }

            alert('Cập nhật thông tin thành công!');
            const updateModal = bootstrap.Modal.getInstance(document.getElementById('updateProfile'));
            updateModal.hide();
        });
    }

    // Xử lý modal lịch sử mua hàng
    const orderHistoryModal = document.getElementById('orderHistory');
    if (orderHistoryModal) {
        orderHistoryModal.addEventListener('show.bs.modal', function () {
            const orderHistoryList = document.getElementById('orderHistoryList');
            const orderHistoryEmpty = document.getElementById('orderHistoryEmpty');
            const username = localStorage.getItem('username');
            const orders = JSON.parse(localStorage.getItem(`orders_${username}`)) || [];

            if (orders.length === 0) {
                orderHistoryList.innerHTML = '';
                orderHistoryList.style.display = 'none';
                orderHistoryEmpty.style.display = 'block';
            } else {
                orderHistoryEmpty.style.display = 'none';
                orderHistoryList.style.display = 'block';
                orderHistoryList.innerHTML = `
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Mã đơn hàng</th>
                                <th>Ngày đặt</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders.map(order => `
                                <tr>
                                    <td>${order.orderId}</td>
                                    <td>${order.date}</td>
                                    <td>${order.total.toLocaleString('vi-VN')}đ</td>
                                    <td>${order.status}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
        });
    }

    // Xử lý đăng xuất
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('password');
            localStorage.removeItem('fullName');
            localStorage.removeItem('phone');
            localStorage.removeItem('email');
            localStorage.removeItem('address');
            // Không xóa danh sách đơn hàng để giữ lịch sử mua hàng
            checkLoginStatus();
        });
    }
});

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const accountText = document.getElementById('accountText');
    const accountLink = document.getElementById('accountLink');
    const accountDropdown = document.getElementById('accountDropdown');
    const accountContainer = document.querySelector('.account-container');

    accountContainer.removeEventListener('mouseenter', handleMouseEnter);
    accountContainer.removeEventListener('mouseleave', handleMouseLeave);

    if (isLoggedIn) {
        accountText.textContent = 'Tài khoản';
        accountLink.removeAttribute('data-bs-toggle');
        accountLink.removeAttribute('data-bs-target');

        accountContainer.addEventListener('mouseenter', handleMouseEnter);
        accountContainer.addEventListener('mouseleave', handleMouseLeave);
    } else {
        accountText.textContent = 'Đăng nhập';
        accountLink.setAttribute('data-bs-toggle', 'modal');
        accountLink.setAttribute('data-bs-target', '#loginPopup');
        accountDropdown.style.display = 'none';
    }
}

function handleMouseEnter() {
    const accountDropdown = document.getElementById('accountDropdown');
    accountDropdown.style.display = 'block';
}

function handleMouseLeave() {
    const accountDropdown = document.getElementById('accountDropdown');
    accountDropdown.style.display = 'none';
}

// Thêm vào đầu file auth.js, ngay sau document.addEventListener('DOMContentLoaded', ...)
const username = localStorage.getItem('username');
if (username) {
    // Giả lập dữ liệu đơn hàng
    const sampleOrders = [
        { orderId: 'DH001', date: '2025-03-20', total: 8790000, status: 'Đã giao' },
        { orderId: 'DH002', date: '2025-03-21', total: 3500000, status: 'Đang xử lý' },
        { orderId: 'DH003', date: '2025-03-22', total: 1200000, status: 'Đã hủy' }
    ];
    localStorage.setItem(`orders_${username}`, JSON.stringify(sampleOrders));
}