document.addEventListener('DOMContentLoaded', function () {
    // Kiểm tra trạng thái đăng nhập khi tải trang
    checkLoginStatus();

    // Xử lý click vào icon tài khoản (cả desktop và mobile)
    const accountLinkDesktop = document.getElementById('accountDropdownDesktop');
    if (accountLinkDesktop) {
        accountLinkDesktop.addEventListener('click', function (e) {
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                e.preventDefault();
                e.stopPropagation();
                const loginModal = new bootstrap.Modal(document.getElementById('loginPopup'));
                loginModal.show();
            }
            // Nếu đã đăng nhập, bootstrap dropdown sẽ tự hoạt động
        });
    }

    const accountLinkMobile = document.querySelector('.account-icon[data-bs-toggle="offcanvas"]');
    if (accountLinkMobile) {
        accountLinkMobile.addEventListener('click', function (e) {
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                e.preventDefault();
                const loginModal = new bootstrap.Modal(document.getElementById('loginPopup'));
                loginModal.show();
            }
            // Nếu đã đăng nhập, offcanvas sẽ tự hoạt động
        });
    }

    const defaultAddressRadio = document.getElementById("defaultAddress");
    const otherAddressRadio = document.getElementById("otherAddress");
    const customAddressField = document.getElementById("customAddressField");

    // Khi chọn "Chọn địa chỉ khác", hiển thị trường nhập
    otherAddressRadio.addEventListener("change", function () {
        if (this.checked) {
            customAddressField.style.display = "block";
        }
    });

    // Khi chọn "Sử dụng địa chỉ mặc định", ẩn trường nhập
    defaultAddressRadio.addEventListener("change", function () {
        if (this.checked) {
            customAddressField.style.display = "none";
        }
    });
    

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

    // Xử lý đăng xuất - Desktop
    const logoutLinkDesktop = document.getElementById('logoutLinkDesktop');
    if (logoutLinkDesktop) {
        logoutLinkDesktop.addEventListener('click', function (e) {
            e.preventDefault();
            logoutUser();
        });
    }

    // Xử lý đăng xuất - Mobile
    const logoutLinkMobile = document.getElementById('logoutLinkMobile');
    if (logoutLinkMobile) {
        logoutLinkMobile.addEventListener('click', function (e) {
            e.preventDefault();
            logoutUser();
            // Đóng offcanvas sau khi đăng xuất
            const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('accountOffcanvas'));
            if (offcanvas) {
                offcanvas.hide();
            }
        });
    }

    // Xử lý form đăng ký (nếu có)
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
                return;
            } else {
                document.getElementById('updatePasswordMatchError').style.display = 'none';
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
});

// Hàm kiểm tra trạng thái đăng nhập và cập nhật UI
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username') || '';

    // Cập nhật text và hành vi cho desktop
    const accountTextDesktop = document.getElementById('accountTextDesktop');
    const accountDropdownDesktop = document.getElementById('accountDropdownDesktop');
    
    if (accountTextDesktop && accountDropdownDesktop) {
        if (isLoggedIn) {
            accountTextDesktop.textContent = username || 'Tài khoản';
            // Cho phép dropdown hoạt động
            accountDropdownDesktop.setAttribute('data-bs-toggle', 'dropdown');
        } else {
            accountTextDesktop.textContent = 'Đăng nhập';
            // Vô hiệu hóa dropdown, sẽ xử lý click bằng event listener
            accountDropdownDesktop.removeAttribute('data-bs-toggle');
        }
    }

    // Cập nhật text và hành vi cho mobile
    const accountTextMobile = document.getElementById('accountTextMobile');
    const mobileAccountLink = accountTextMobile ? accountTextMobile.parentElement : null;
    
    if (accountTextMobile && mobileAccountLink) {
        if (isLoggedIn) {
            accountTextMobile.textContent = username || 'Tài khoản';
            // Cho phép offcanvas hoạt động
            mobileAccountLink.setAttribute('data-bs-toggle', 'offcanvas');
            mobileAccountLink.setAttribute('data-bs-target', '#accountOffcanvas');
        } else {
            accountTextMobile.textContent = 'Đăng nhập';
            // Vô hiệu hóa offcanvas, sẽ xử lý click bằng event listener
            mobileAccountLink.removeAttribute('data-bs-toggle');
            mobileAccountLink.removeAttribute('data-bs-target');
        }
    }
}

// Hàm xử lý đăng xuất
function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('fullName');
    localStorage.removeItem('phone');
    localStorage.removeItem('email');
    localStorage.removeItem('address');
    
    checkLoginStatus();
}
