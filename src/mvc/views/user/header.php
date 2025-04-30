<!-- navbar.php -->
<nav class="navbar navbar-expand-md bg-light">
    <div class="container">
        <!-- Logo và Slogan -->
        <a class="navbar-brand d-flex align-items-center" href="">
            <img src="../../../public/img/logo.png" alt="logo" class="logo me-2" style="height: 40px; width: 40px;" />
            <span class="logo-text">SMART STATION</span>
        </a>

        <!-- Nút đăng nhập trên mobile khi chưa đăng nhập -->
        <a href="#" id="mobileLoginLink" class="icon-link d-md-none ms-auto" style="display: none;">
            <i class="bi bi-person"></i> <span id="accountTextMobile">Đăng nhập</span>
        </a>

        <!-- Hamburger button (chỉ hiển thị khi đã đăng nhập trên mobile) -->
        <button id="navbarToggler" class="navbar-toggler d-md-none ms-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#navbarOffcanvas" aria-controls="navbarOffcanvas" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Nội dung navbar trên desktop -->
        <div class="collapse navbar-collapse" id="navbarContent">
            <!-- Search Bar -->
            <div class="mx-auto d-flex justify-content-center flex-grow-1">
                <div class="input-group search-bar">
                    <input type="text" class="form-control" placeholder="Hôm nay bạn muốn tìm kiếm gì?" />
                    <button class="btn btn-outline-secondary" type="button" aria-label="Tìm kiếm" onclick="handleClickSearch()">
                        <i class="bi bi-search"></i>
                    </button>
                </div>
            </div>

            <!-- Icons -->
            <div class="d-flex align-items-center ms-3">
                <!-- Account - Dropdown trên desktop -->
                <div class="account-container">
                    <div class="dropdown">
                        <a href="#" id="accountDropdownDesktop" class="icon-link account-icon" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-person"></i> <span id="accountTextDesktop">Đăng nhập</span>
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="accountDropdownDesktop">
                            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#updateProfile">Cập nhật thông tin</a></li>
                            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#orderHistory">Lịch sử mua hàng</a></li>
                            <li><a class="dropdown-item" href="#" id="logoutLinkDesktop">Đăng xuất</a></li>
                        </ul>
                    </div>
                </div>

                <!-- Cart Icon (chỉ hiển thị trên desktop) -->
                <a href="#" class="icon-link cart-icon ms-3 d-none d-md-inline-block" data-bs-toggle="modal" data-bs-target="#cartPopup">
                    <i class="bi bi-cart"></i>
                    <span class="cart-badge">0</span>
                </a>
            </div>
        </div>
    </div>
</nav>

<!-- Offcanvas Menu cho mobile (khi đã đăng nhập) -->
<div class="offcanvas offcanvas-end" tabindex="-1" id="navbarOffcanvas" aria-labelledby="navbarOffcanvasLabel">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="navbarOffcanvasLabel">Menu</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
        <!-- Search Bar trong offcanvas -->
        <div class="input-group search-bar mb-3">
            <input type="text" class="form-control" placeholder="Hôm nay bạn muốn tìm kiếm gì?" />
            <button class="btn btn-outline-secondary" type="button" aria-label="Tìm kiếm">
                <i class="bi bi-search"></i>
            </button>
        </div>
        <!-- Cart Icon trong offcanvas -->
        <a href="#" class="btn btn-outline-secondary mb-3 d-flex align-items-center justify-content-center" data-bs-toggle="modal" data-bs-target="#cartPopup" data-bs-dismiss="offcanvas">
            <i class="bi bi-cart me-2"></i> Giỏ hàng
             <!-- <span class="cart-badge ms-2">0</span> -->
        </a>
        <!-- Các tùy chọn menu -->
        <div class="d-grid gap-2">
            <a href="#" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#updateProfile" data-bs-dismiss="offcanvas">Cập nhật thông tin</a>
            <a href="#" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#orderHistory" data-bs-dismiss="offcanvas">Lịch sử mua hàng</a>
            <a href="#" class="btn btn-outline-danger" id="logoutLinkMobile" data-bs-dismiss="offcanvas">Đăng xuất</a>
        </div>
    </div>
</div>