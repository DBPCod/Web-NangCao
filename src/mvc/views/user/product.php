<!-- Carousel -->
<?php include 'carousel.php' ?>
<!-- Product Section with Filter -->
<section class="product-section py-5">
    <div class="container">
        <div class="row">
            <!-- Filter -->
             <?php include 'filter.php' ?>

            <!-- Product Grid -->
            <div class="col-lg-9 col-md-8">
                <!-- Sorting Options -->
                <?php include 'sortPrice.php' ?>

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
                                            <!-- RAM chọn -->
                                            <p><strong>RAM:</strong>
                                                <span id="modalProductRam" class="d-inline-flex gap-2"></span>
                                            </p>
                                            <!-- <p><strong>RAM:</strong> <span id="modalProductRam"></span></p> -->
                                            <p><strong>ROM:</strong> <span id="modalProductRom"></span></p>
                                            <p><strong>Màn hình:</strong> <span id="modalProductManHinh"></span></p>
                                            <p><strong>Pin:</strong> <span id="modalProductPin"></span></p>
                                            <!-- <p><strong>Màu sắc:</strong> <span id="modalProductMauSac"></span></p> -->
                                             <!-- Màu sắc chọn -->
                                            <p><strong>Màu sắc:</strong>
                                                <span id="modalProductMauSac" class="d-inline-flex gap-2"></span>
                                            </p>
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