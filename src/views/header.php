<!-- header.php -->
<header class="header">
    <div class="container">
        <div class="row align-items-center">
            <!-- Logo and Slogan -->
            <div class="col-3">
                <div class="logo-container">
                    <img src="./src/public/img/logo.png" alt="logo" class="logo" />
                    <span class="logo-text">SMART STATION</span>
                </div>
            </div>

            <!-- Search Bar -->
            <div class="col-6 d-flex justify-content-center">
                <div class="input-group search-bar">
                    <input
                        type="text"
                        class="form-control"
                        placeholder="Hôm nay bạn muốn tìm kiếm gì?" />
                    <button class="btn btn-outline-secondary" type="button">
                        <i class="bi bi-search"></i>
                    </button>
                </div>
            </div>

            <!-- Icons -->
            <div class="col-3 text-end">
                <a href="#" class="icon-link" data-bs-toggle="modal" data-bs-target="#loginPopup">
                    <i class="bi bi-person"></i> Tài khoản
                </a>
                <a href="#" class="icon-link cart-icon" data-bs-toggle="modal" data-bs-target="#cartPopup">
                    <i class="bi bi-cart"></i>
                    <span class="cart-badge">0</span>
                </a>
            </div>
        </div>
    </div>
</header>