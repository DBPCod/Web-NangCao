<!-- header.php -->
<header class="header">
    <div class="container">
        <div class="row align-items-center flex-column flex-md-row">
            <!-- Logo và Slogan -->
            <div class="col-12 col-md-3 text-center text-md-start">
                <div class="logo-container">
                    <img src="./src/public/img/logo.png" alt="logo" class="logo" />
                    <span class="logo-text">SMART STATION</span>
                </div>
            </div>

            <!-- Search Bar -->
            <div class="col-12 col-md-6 d-flex justify-content-center mt-2 mt-md-0">
                <div class="input-group search-bar">
                    <input type="text" class="form-control" placeholder="Hôm nay bạn muốn tìm kiếm gì?" />
                    <button class="btn btn-outline-secondary" type="button">
                        <i class="bi bi-search"></i>
                    </button>
                </div>
            </div>

            <!-- Icons -->
            <div class="col-12 col-md-3 d-flex justify-content-end align-items-center mt-2 mt-md-0">
                <div class="account-container">
                    <a href="#" id="accountLink" class="icon-link account-icon" data-bs-toggle="modal" data-bs-target="#loginPopup">
                        <i class="bi bi-person"></i> <span id="accountText">Đăng nhập</span>
                    </a>
                    <div id="accountDropdown" class="dropdown-menu" style="display: none;">
                        <a href="#" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#updateProfile">Cập nhật thông tin</a>
                        <a href="#" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#orderHistory">Lịch sử mua hàng</a>
                        <a href="#" class="dropdown-item" id="logoutLink">Đăng xuất</a>
                    </div>
                </div>
                <a href="#" class="icon-link cart-icon" data-bs-toggle="modal" data-bs-target="#cartPopup">
                    <i class="bi bi-cart"></i>
                    <span class="cart-badge">0</span>
                </a>
            </div>
        </div>
    </div>
</header>