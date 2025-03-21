<!-- Slider Section -->
<section class="slider-section">
    <div class="container">
        <div id="promoCarousel" class="carousel slide" data-bs-ride="carousel">
            <!-- Indicators -->
            <div class="carousel-indicators">
                <button
                    type="button"
                    data-bs-target="#promoCarousel"
                    data-bs-slide-to="0"
                    class="active"
                    aria-current="true"
                    aria-label="Slide 1"></button>
                <button
                    type="button"
                    data-bs-target="#promoCarousel"
                    data-bs-slide-to="1"
                    aria-label="Slide 2"></button>
                <button
                    type="button"
                    data-bs-target="#promoCarousel"
                    data-bs-slide-to="2"
                    aria-label="Slide 3"></button>
            </div>

            <!-- Slides -->
            <div class="carousel-inner">
                <!-- Slide 1 -->
                <div class="carousel-item active">
                    <div class="carousel-content">
                        <div class="brand">SAMSUNG</div>
                        <div class="d-flex align-items-center">
                            <span class="new-badge">NEW</span>
                            <span class="title">Galaxy S24 Ultra</span>
                        </div>
                        <div class="subtitle">
                            Camera Mắt thần bóng đêm - Bật cận nét idol với Zoom 100x
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="price">28.999 Triệu đồng</span>
                            <span class="discount">Giá chỉ từ 0% đến 12 tháng</span>
                        </div>
                        <div class="installment">Ưu đãi đặc quyền XANH TITAN</div>
                        <div class="offer">Chỉ từ 14.03 đến 17.03.2025</div>
                    </div>
                    <!-- Placeholder for the image -->
                    <img
                        src="./src/public/img/bancho.jpg"
                        alt="Person with phone"
                        class="carousel-image" />
                </div>

                <!-- Slide 2 (Placeholder) -->
                <div class="carousel-item">
                    <div class="carousel-content">
                        <div class="brand">SAMSUNG</div>
                        <div class="d-flex align-items-center">
                            <span class="new-badge">NEW</span>
                            <span class="title">Galaxy S25 Ultra</span>
                        </div>
                        <div class="subtitle">
                            Camera Mắt thần bóng đêm - Bật cận nét idol với Zoom 100x
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="price">28.999 Triệu đồng</span>
                            <span class="discount">Giá chỉ từ 0% đến 12 tháng</span>
                        </div>
                        <div class="installment">Ưu đãi đặc quyền XANH TITAN</div>
                        <div class="offer">Chỉ từ 14.03 đến 17.03.2025</div>
                    </div>
                    <img
                        src="./src/public/img/bancho.jpg"
                        alt="Person with phone"
                        class="carousel-image" />
                </div>

                <!-- Slide 3 (Placeholder) -->
                <div class="carousel-item">
                    <div class="carousel-content">
                        <div class="brand">SAMSUNG</div>
                        <div class="d-flex align-items-center">
                            <span class="new-badge">NEW</span>
                            <span class="title">Galaxy S26 Ultra</span>
                        </div>
                        <div class="subtitle">
                            Camera Mắt thần bóng đêm - Bật cận nét idol với Zoom 100x
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="price">28.999 Triệu đồng</span>
                            <span class="discount">Giá chỉ từ 0% đến 12 tháng</span>
                        </div>
                        <div class="installment">Ưu đãi đặc quyền XANH TITAN</div>
                        <div class="offer">Chỉ từ 14.03 đến 17.03.2025</div>
                    </div>
                    <img
                        src="./src/public/img/bancho.jpg"
                        alt="Person with phone"
                        class="carousel-image" />
                </div>
            </div>

            <!-- Controls -->
            <button
                class="carousel-control-prev"
                type="button"
                data-bs-target="#promoCarousel"
                data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button
                class="carousel-control-next"
                type="button"
                data-bs-target="#promoCarousel"
                data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </div>
</section>

<!-- Product Section with Filter -->
<section class="product-section py-5">
    <div class="container">
        <div class="row">
            <!-- Filter Sidebar -->
            <div class="col-lg-3 col-md-4">
                <div class="filter-section">
                    <h5>LỰA CHỌN HÀNG</h5>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="apple" />
                        <label class="form-check-label" for="apple">Apple</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="samsung" />
                        <label class="form-check-label" for="samsung">Samsung</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="xiaomi" />
                        <label class="form-check-label" for="xiaomi">Xiaomi</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="tecno" />
                        <label class="form-check-label" for="tecno">Tecno</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="oppo" />
                        <label class="form-check-label" for="oppo">Oppo</label>
                    </div>
                    <!-- Add more brands as needed -->

                    <h5 class="mt-4">MỨC GIÁ</h5>
                    <div class="price-range">
                        <input
                            type="range"
                            class="form-range"
                            min="400000"
                            max="48500000"
                            step="100000"
                            value="400000" />
                        <div class="d-flex justify-content-between">
                            <span>400,000 đ</span>
                            <span>48,500,000 đ</span>
                        </div>
                    </div>

                    <h5 class="mt-4">ỨNG DỤNG</h5>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="app1" />
                        <label class="form-check-label" for="app1">Dưới 1 triệu</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="app2" />
                        <label class="form-check-label" for="app2">1 đến 3 triệu</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="app3" />
                        <label class="form-check-label" for="app3">3 đến 5 triệu</label>
                    </div>
                </div>
            </div>

            <!-- Product Grid -->
            <div class="col-lg-9 col-md-8">
                <!-- Sorting Options -->
                <div class="d-flex justify-content-between mb-3">
                    <div>
                        <button class="btn btn-outline-secondary">Sắp xếp theo</button>
                        <button class="btn btn-outline-secondary">Liên quan</button>
                        <button class="btn btn-outline-secondary">Mới nhất</button>
                        <button class="btn btn-outline-secondary">Bán chạy</button>
                    </div>
                    <div>
                        <button class="btn btn-outline-secondary">
                            Giá tiền <i class="bi bi-chevron-down"></i>
                        </button>
                    </div>
                </div>

                <!-- Product Grid -->
                <div
                    class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 product-grid">
                    <!-- Sản phẩm sẽ được load bằng AJAX -->
                </div>

                <!-- Pagination -->
                <nav aria-label="Page navigation">
                    <ul class="pagination">
                        <li class="page-item active">
                            <a class="page-link page-btn" href="#" data-page="1">1</a>
                        </li>
                        <li class="page-item">
                            <a class="page-link page-btn" href="#" data-page="2">2</a>
                        </li>
                        <li class="page-item">
                            <a class="page-link page-btn" href="#" data-page="3">3</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</section>