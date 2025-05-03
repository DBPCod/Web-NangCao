let dataCookie;
document.addEventListener('DOMContentLoaded', function () {


    //kiểm tra tự động đăng nhập
    autoLogin();

    // Kiểm tra trạng thái đăng nhập khi tải trang
    checkLoginStatus({ "success": false });

    // Xử lý click vào icon tài khoản trên desktop
    const accountLinkDesktop = document.getElementById('accountDropdownDesktop');
    if (accountLinkDesktop) {
        accountLinkDesktop.addEventListener('click', function (e) {
            if (dataCookie === undefined) {
                e.preventDefault();
                e.stopPropagation();
                const loginModal = new bootstrap.Modal(document.getElementById('loginPopup'));
                loginModal.show();
            }
            // Nếu đã đăng nhập, dropdown sẽ tự hoạt động
        });
    }

    // Xử lý click vào nút đăng nhập trên mobile
    const mobileLoginLink = document.getElementById('mobileLoginLink');
    if (mobileLoginLink) {
        mobileLoginLink.addEventListener('click', function (e) {
            e.preventDefault();
            const loginModal = new bootstrap.Modal(document.getElementById('loginPopup'));
            loginModal.show();
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

    const customAddressField = document.getElementById("customAddressField");


    //ham doi ki tu dac biet luu tren cookie thanh @
    function decodeEmail(encodedEmail) {
        if (!encodedEmail) return "";
        
        if (encodedEmail.includes("%40")) {
            return encodedEmail.replace(/%40/g, "@");
        }
        
        // Không có %40 thì trả về chuỗi cũ
        return encodedEmail;
    }

    //tự động đăng nhập nếu người dùng lưu tài khoản
    function autoLogin() {
        let username = decodeEmail(getCookie('username'));
        if (username) {
            fetch("../../controllers/AuthController.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({username})
            })
                .then(response => response.json())
                .then(data => {
                    dataCookie = data;
                    xuliWarning(data.theloai);
     
                    if (data.success) {
                        checkLoginStatus(data);
                    }
                })
        }

    }

    // Xử lý form đăng nhập
    // const loginForm = document.querySelector('#loginPopup form');
    // if (loginForm) {
    //     loginForm.addEventListener('submit', function (e) {
    //         e.preventDefault();
    //         const username = document.getElementById('username').value;
    //         const password = document.getElementById('password').value;
    //         fetch("../../controllers/AuthController.php", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ username, password })
    //         })
    //             .then(response => response.json())
    //             .then(data => {
    //                 xuliWarning(data.theloai);
    //                 console.log(data);
    //                 if (data.success) {
    //                     dataCookie = data;
    //                     alert("Đăng nhập thành công!");
    //                     // window.location.reload();
    //                     const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginPopup'));
    //                     loginModal.hide();
    //                     checkLoginStatus(data);
    //                 }
    //             })

    //         // if (username && password) {
    //         //     localStorage.setItem('isLoggedIn', 'true');
    //         //     localStorage.setItem('username', username);
    //         //     localStorage.setItem('password', password);
    //         //     localStorage.setItem('fullName', '');
    //         //     localStorage.setItem('phone', '');
    //         //     localStorage.setItem('email', '');
    //         //     localStorage.setItem('address', '');


    //         // } else {
    //         //     alert('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
    //         // }
    //     });
    // }

    // Xu ly dang ki co toast message
    const loginForm = document.querySelector('#loginPopup form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            fetch("../../controllers/AuthController.php",{
                method: "POST",
                headers: {"Content-Type" : "application/json" },
                body: JSON.stringify({username, password})
            })
            .then(response => response.json())
            .then(data =>{
                xuliWarning(data.theloai);  
                if(data.success){
                    dataCookie=data;
                    toast({
                        title: 'Thành công',
                        message: 'Đăng nhập thành công!',
                        type: 'success',
                        duration: 3000
                    });
                    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginPopup'));
                    loginModal.hide();
                    checkLoginStatus(data);
                }
            })
        });
    }

    //ham lay cookie
    function getCookie(name) {
        let cookies = document.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].split('=');
            if (cookie[0] === name) {
                return cookie[1];
            }
        }
        return null; // Nếu không tìm thấy cookie
    }

    function xuliWarning($theloai) {
        if ($theloai == "TAIKHOAN") {
            document.getElementById('username').classList.add('error');
            document.getElementById('username-warning').classList.remove('d-none');
            document.getElementById('username-error').classList.remove('d-none');
            document.getElementById('username').select();
        } else {
            document.getElementById('username').classList.remove('error');
            document.getElementById('username-warning').classList.add('d-none');
            document.getElementById('username-error').classList.add('d-none');
        }

        if ($theloai == "MATKHAU") {
            document.getElementById('password').classList.add('error');
            document.getElementById('password-warning').classList.remove('d-none');
            document.getElementById('password-error').classList.remove('d-none');
            document.getElementById('password').select();
        }
        else {
            document.getElementById('password').classList.remove('error');
            document.getElementById('password-warning').classList.add('d-none');
            document.getElementById('password-error').classList.add('d-none');
        }
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
            const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('navbarOffcanvas'));
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

            PostSignup(username, password, fullName, phone, email, address);
            // localStorage.setItem('isLoggedIn', 'true');
            // localStorage.setItem('username', username);
            // localStorage.setItem('password', password);
            // localStorage.setItem('fullName', fullName);
            // localStorage.setItem('phone', phone);
            // localStorage.setItem('email', email);
            // localStorage.setItem('address', address);

            const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerPopup'));
            registerModal.hide();
        });
    }

    // Xử lý form cập nhật thông tin
    // Xử lý form cập nhật thông tin
const updateProfileForm = document.querySelector('#updateProfileForm');
if (updateProfileForm) {
    let cookie = getCookie('username');
    const updateProfileModal = document.getElementById('updateProfile');
    updateProfileModal.addEventListener('show.bs.modal', function () {
        SetInfor(cookie);
    });

    updateProfileForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const fullName = document.getElementById('updateFullName').value;
        const phone = document.getElementById('updatePhone').value;
        const email = document.getElementById('updateEmail').value;
        const address = document.getElementById('updateAddress').value;
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('updatePassword').value;
        const confirmPassword = document.getElementById('updateConfirmPassword').value;

        // Determine which tab is active
        const activeTab = document.querySelector('.tab-content.active').id;

        if (activeTab === 'info') {
            // Validate user information
            if (!fullName || !phone || !email || !address) {
                toast({
                    title: 'Lỗi',
                    message: 'Vui lòng điền đầy đủ thông tin!',
                    type: 'error',
                    duration: 3000
                });
                return;
            }

            // Update user information
            UpdateInfor(fullName, phone, email, address);
            const updateModal = bootstrap.Modal.getInstance(document.getElementById('updateProfile'));
            updateModal.hide();
        } else if (activeTab === 'passwords') {
            // Validate password fields
            if (!currentPassword) {
                document.getElementById('currentPasswordError').style.display = 'block';
                document.getElementById('currentPassword').select();
                return;
            }

            if (newPassword && newPassword.length < 8) {
                document.getElementById('updatePasswordLengthError').style.display = 'block';
                document.getElementById('updatePassword').select();
                return;
            } else {
                document.getElementById('updatePasswordLengthError').style.display = 'none';
            }

            if (newPassword && newPassword !== confirmPassword) {
                document.getElementById('updatePasswordMatchError').style.display = 'block';
                document.getElementById('updateConfirmPassword').select();
                return;
            } else {
                document.getElementById('updatePasswordMatchError').style.display = 'none';
            }

            // Verify current password and update new password
            CheckPass(currentPassword, newPassword);
        }
    });
}

// Verify current password and update new password
function CheckPass(currentPassword, newPassword) {
    const taikhoan = decodeEmail(getCookie('username'));
    fetch(`../../controllers/TaiKhoanController.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taikhoan, matkhau: currentPassword })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('currentPasswordError').style.display = 'none';
                if (newPassword) {
                    // Update password
                    let taiKhoan = decodeEmail(getCookie('username'));
                    UpdatePass(newPassword, taiKhoan);
                } else {
                    toast({
                        title: 'Lỗi',
                        message: 'Vui lòng nhập mật khẩu mới!',
                        type: 'error',
                        duration: 3000
                    });
                }
                const updateModal = bootstrap.Modal.getInstance(document.getElementById('updateProfile'));
                updateModal.hide();
            } else {
                document.getElementById('currentPasswordError').style.display = 'block';
                document.getElementById('currentPassword').select();
            }
        });
}

// Update password
function UpdatePass(MatKhau, taiKhoan) {
    fetch(`../../controllers/TaiKhoanController.php?taikhoan=${taiKhoan}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ MatKhau, TrangThai: 1 })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                toast({
                    title: 'Thành công',
                    message: 'Cập nhật mật khẩu thành công!',
                    type: 'success',
                    duration: 3000
                });
                ResetPopupInfo();
            } else {
                toast({
                    title: 'Lỗi',
                    message: 'Cập nhật mật khẩu thất bại, vui lòng thử lại!',
                    type: 'error',
                    duration: 3000
                });
            }
        });
}

// Update user information
function UpdateInfor(HoVaTen, SoDienThoai, Email, DiaChi) {
    fetch(`../../controllers/NguoiDungController.php?idNguoiDung=${dataCookie.user.idnguoidung}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ HoVaTen, SoDienThoai, Email, DiaChi, TrangThai: 1 })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                toast({
                    title: 'Thành công',
                    message: 'Cập nhật thông tin thành công!',
                    type: 'success',
                    duration: 3000
                });
                document.getElementById('accountTextDesktop').innerText = HoVaTen;
            } else {
                toast({
                    title: 'Lỗi',
                    message: 'Cập nhật thông tin thất bại, vui lòng thử lại!',
                    type: 'error',
                    duration: 3000
                });
            }
        });
}

// Get user information
function SetInfor() {
    fetch(`/smartstation/src/mvc/controllers/NguoiDungController.php?idNguoiDung=${dataCookie.user.idnguoidung}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('updateFullName').value = data.HoVaTen || '';
            document.getElementById('updatePhone').value = data.SoDienThoai || '';
            document.getElementById('updateEmail').value = data.Email || '';
            document.getElementById('updateAddress').value = data.DiaChi || '';
        });
}

// Reset popup info
function ResetPopupInfo() {
    const newPassword = document.getElementById('updatePassword');
    const confirmPassword = document.getElementById('updateConfirmPassword');
    const currentPassword = document.getElementById('currentPassword');
    newPassword.value = '';
    confirmPassword.value = '';
    currentPassword.value = '';

    showTab('info');
    const selectedBtn = document.querySelector(`button[onclick="showTab('info')"]`);
    selectedBtn.classList.add('active');
}
});


// post dang ki tai khoan
function PostSignup(username, password, fullName, phone, email, address){
    fetch("../../controllers/AuthController.php",{
        method: "POST",
        headers: {"Content-Type" : "application/json" },
        body: JSON.stringify({username, password, fullName, phone, email, address})
    })
    .then(response => response.json())
    .then(data =>{
        if(data.success){
            toast({
                title: 'Thành công',
                message: 'Đăng ký tài khoản thành công!',
                type: 'success',
                duration: 3000
            });
            checkLoginStatus(data);
        } else {
            toast({
                title: 'Lỗi',
                message: 'Đăng ký thất bại, vui lòng thử lại!',
                type: 'error',
                duration: 3000
            });
        }
    })     
}

// Hàm kiểm tra trạng thái đăng nhập và cập nhật UI
function checkLoginStatus(data) {
    // const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    // const username = localStorage.getItem('username') || '';

    // Cập nhật giao diện cho desktop
    const accountTextDesktop = document.getElementById('accountTextDesktop');
    const accountDropdownDesktop = document.getElementById('accountDropdownDesktop');
    if (accountTextDesktop && accountDropdownDesktop) {
        if (data.success && data.user) {
            accountTextDesktop.textContent = data.user.hovaten || 'Tài khoản';
            accountDropdownDesktop.setAttribute('data-bs-toggle', 'dropdown');
        } else {
 
            accountTextDesktop.textContent = 'Đăng nhập';
            accountDropdownDesktop.removeAttribute('data-bs-toggle');
        }
    }

    // Cập nhật giao diện cho mobile
    const mobileLoginLink = document.getElementById('mobileLoginLink');
    const navbarToggler = document.getElementById('navbarToggler');
    if (mobileLoginLink && navbarToggler) {
        if (data.success && data.user) {
            mobileLoginLink.style.display = 'none'; // Ẩn nút đăng nhập
            navbarToggler.style.display = 'block'; // Hiển thị hamburger
            navbarToggler.setAttribute('data-bs-toggle', 'offcanvas');
            navbarToggler.setAttribute('data-bs-target', '#navbarOffcanvas');
        } else {
            mobileLoginLink.style.display = 'flex'; // Hiển thị nút đăng nhập
            navbarToggler.style.display = 'none'; // Ẩn hamburger
            navbarToggler.removeAttribute('data-bs-toggle');
            navbarToggler.removeAttribute('data-bs-target');
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
    
    fetch("../../controllers/AuthController.php",{
        method: "POST",
        headers: {"Content-Type" : "application/json" },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data =>{

        if(data.success){
            dataCookie=undefined;
            toast({
                title: 'Thành công',
                message: 'Đăng xuất thành công!',
                type: 'success',
                duration: 3000
            });
            checkLoginStatus(data);
        } else {
            toast({
                title: 'Lỗi',
                message: 'Đăng xuất thất bại, vui lòng thử lại!',
                type: 'error',
                duration: 3000
            });
        }
    })
}