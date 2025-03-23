<!-- Slider Section -->
<section class="slider-section">
    <div class="container">
        <div id="promoCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
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
                    <!-- Placeholder for the image -->
                    <img
                        src="./src/public/img/slider1.jpg"
                        alt="Person with phone"
                        class="carousel-image" />
                </div>

                <!-- Slide 2 (Placeholder) -->
                <div class="carousel-item">
                    <img
                        src="./src/public/img/slider2.png"
                        alt="Person with phone"
                        class="carousel-image" />
                </div>

                <!-- Slide 3 (Placeholder) -->
                <div class="carousel-item">
                    <img
                        src="./src/public/img/slider3.png"
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
                        <span class="me-2" style="font-weight: 500; color:#333">Sắp xếp theo:</span>
                        <button class="btn btn-outline-secondary">Mới nhất</button>
                        <button class="btn btn-outline-secondary">Bán chạy</button>
                    </div>
                    <div>
                        <button class="btn btn-outline-secondary" style="white-space: nowrap;">
                            Giá tiền <i class="bi bi-chevron-down"></i>
                        </button>
                    </div>
                </div>

                <!-- Product Grid -->
                <div
                    class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 product-grid">
                    <!-- Sản phẩm sẽ được load bằng AJAX -->
                </div>

                <!-- Modal -->
                <div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header border-0 position-relative">
                                <h5 class="modal-title" id="productModalLabel">Thông tin sản phẩm</h5>
                                <button type="button" class="btn-close position-absolute top-0 end-0 m-2" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <!-- Ảnh sản phẩm -->
                                    <div class="col-md-5">
                                        <img id="modalProductImage" src="" alt="" class="img-fluid">
                                        <!-- Hàng ảnh nhỏ -->
                                        <div class="thumbnail-gallery d-flex gap-2 mt-2">
                                            <!-- Thumbnails will be dynamically added here -->
                                        </div>
                                    </div>
                                    <!-- Thông tin sản phẩm -->
                                    <div class="col-md-7">
                                        <h5 id="modalProductName" class="product-name"></h5>
                                        <p id="modalProductSpecs" class="product-specs"></p>
                                        <p id="modalProductPrice" class="product-price"></p>
                                        <p id="modalProductDiscount" class="product-discount text-warning"></p>
                                        <p id="modalProductPoints" class="product-points"></p>
                                        <!-- Thông số kỹ thuật -->
                                        <div class="product-specs-details">
                                            <p><strong>RAM:</strong> <span id="modalProductRam"></span></p>
                                            <p><strong>ROM:</strong> <span id="modalProductRom"></span></p>
                                            <p><strong>Màn hình:</strong> <span id="modalProductManHinh"></span></p>
                                            <p><strong>Pin:</strong> <span id="modalProductPin"></span></p>
                                            <p><strong>Màu sắc:</strong> <span id="modalProductMauSac"></span></p>
                                            <p><strong>Camera:</strong> <span id="modalProductCamera"></span></p>
                                            <p><strong>Trạng thái:</strong> <span id="modalProductTrangThai"></span></p>
                                        </div>
                                        <!-- Nút MUA NGAY và THÊM VÀO GIỎ HÀNG -->
                                        <div class="d-flex gap-2 mt-3">
                                            <button class="btn btn-success btn-buy-now">MUA NGAY</button>
                                            <button class="btn btn-primary btn-add-to-cart">THÊM VÀO GIỎ HÀNG</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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