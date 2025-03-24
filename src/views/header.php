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
                <!-- Account - Desktop: Dropdown, Mobile: Offcanvas trigger -->
                <div class="account-container">
                    <!-- Desktop: Dropdown -->
                    <div class="d-none d-md-block">
                        <div class="dropdown">
                            <a href="#" id="accountDropdownDesktop" class="icon-link account-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-person"></i> <span id="accountTextDesktop">Đăng nhập</span>
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="accountDropdownDesktop">
                                <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#updateProfile">Cập nhật thông tin</a></li>
                                <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#orderHistory">Lịch sử mua hàng</a></li>
                                <li><a class="dropdown-item" href="#" id="logoutLinkDesktop">Đăng xuất</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <!-- Mobile: Offcanvas trigger -->
                    <div class="d-md-none">
                        <a href="#" class="icon-link account-icon" data-bs-toggle="offcanvas" data-bs-target="#accountOffcanvas" aria-controls="accountOffcanvas">
                            <i class="bi bi-person"></i> <span id="accountTextMobile">Đăng nhập</span>
                        </a>
                    </div>
                </div>
                
                <!-- Cart Icon - Same for both desktop and mobile -->
                <a href="#" class="icon-link cart-icon ms-3" data-bs-toggle="modal" data-bs-target="#cartPopup">
                    <i class="bi bi-cart"></i>
                    <span class="cart-badge">0</span>
                </a>
            </div>
        </div>
    </div>
</header>

<!-- Mobile Offcanvas Menu -->
<div class="offcanvas offcanvas-end" tabindex="-1" id="accountOffcanvas" aria-labelledby="accountOffcanvasLabel">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="accountOffcanvasLabel">Tài khoản</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
        <div class="d-grid gap-2">
            <a href="#" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#updateProfile" data-bs-dismiss="offcanvas">Cập nhật thông tin</a>
            <a href="#" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#orderHistory" data-bs-dismiss="offcanvas">Lịch sử mua hàng</a>
            <a href="#" class="btn btn-outline-danger" id="logoutLinkMobile">Đăng xuất</a>
        </div>
    </div>
</div>