<!-- multiProductCheckout.php -->
<div class="modal fade" id="checkoutModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Thanh toán giỏ hàng</h5>
                <button type="button" class="btn-close" onclick="handleCloseModal('checkoutModal')"></button>
            </div>
            <div class="modal-body" id="checkoutModalBody">
                <div class="container mt-3">
                    <div class="row mb-4">
                        <div class="col-md-3">
                            <label>Họ và tên *</label>
                            <input type="text" class="form-control" placeholder="Họ và tên" id="checkoutFullName" disabled>
                        </div>
                        <div class="col-md-3">
                            <label>Email *</label>
                            <input type="email" class="form-control" placeholder="Email" id="checkoutEmail" disabled>
                        </div>
                        <div class="col-md-3">
                            <label>Số điện thoại *</label>
                            <input type="tel" class="form-control" placeholder="Nhập số điện thoại" id="checkoutTel" disabled>
                        </div>
                        <div class="col-md-3">
                            <div class="mb-3">
                                <label>Địa chỉ *</label>
                                <input type="text" class="form-control" id="checkoutAddressInput" placeholder="Địa chỉ" disabled>
                                <div class="form-check mt-2">
                                    <input class="form-check-input" type="radio" name="edit-address" id="checkoutEditAddress" value="edit">
                                    <label class="form-check-label" for="checkoutEditAddress">Chỉnh sửa địa chỉ</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <h5>Danh sách sản phẩm</h5>
                            <div class="product-list" id="product-list">
                                <div class="product-details" data-config='{
                                    "RAM": "64GB",
                                    "Bộ nhớ trong": "128GB",
                                    "Màn hình": "6.4 inch",
                                    "Dung lượng pin": "4000mAh",
                                    "Màu sắc": "Xanh",
                                    "Độ phân giải": "48MP"
                                    }' data-price="30190000" data-idCHSP="1" data-idDSP="1">
                                    <img src="https://via.placeholder.com/80x100" alt="iPhone 16 Pro Max" class="product-image" style="width: 80px;">
                                    <div class="flex-grow-1">
                                        <h6>iPhone 16 Pro Max</h6>
                                        <p class="text-success mb-0">30,190,000 đ</p>
                                    </div>
                                    <div class="quantity-selector">
                                        <button class="btn-decrement">-</button>
                                        <span class="quantity-value">1</span>
                                        <button class="btn-increment">+</button>
                                    </div>
                                    <button class="details-btn">Xem chi tiết</button>
                                    <button class="delete-btn">Xóa</button>
                                </div>
                                <div class="product-details" data-config='{
                                    "RAM": "12GB",
                                    "Bộ nhớ trong": "256GB",
                                    "Màn hình": "6.1 inch",
                                    "Dung lượng pin": "3700mAh",
                                    "Màu sắc": "Trắng",
                                    "Độ phân giải": "50MP"
                                }' data-price="19490000" data-idCHSP="2" data-idDSP="2">
                                    <img src="https://via.placeholder.com/80x100" alt="Google Pixel 8" class="product-image" style="width: 80px;">
                                    <div class="flex-grow-1">
                                        <h6>Google Pixel 8</h6>
                                        <p class="text-success mb-0">19,490,000 đ</p>
                                    </div>
                                    <div class="quantity-selector">
                                        <button class="btn-decrement">-</button>
                                        <span class="quantity-value">1</span>
                                        <button class="btn-increment">+</button>
                                    </div>
                                    <button class="details-btn">Xem chi tiết</button>
                                    <button class="delete-btn">Xóa</button>
                                </div>
                                <div class="product-details" data-config='{
                                    "RAM": "16GB",
                                    "Bộ nhớ trong": "512GB",
                                    "Màn hình": "6.7 inch",
                                    "Dung lượng pin": "5000mAh",
                                    "Màu sắc": "Xám",
                                    "Độ phân giải": "64MP"
                                }' data-price="18990000" data-idCHSP="3" data-idDSP="3">
                                    <img src="https://via.placeholder.com/80x100" alt="OnePlus 11" class="product-image" style="width: 80px;">
                                    <div class="flex-grow-1">
                                        <h6>OnePlus 11</h6>
                                        <p class="text-success mb-0">18,990,000 đ</p>
                                    </div>
                                    <div class="quantity-selector">
                                        <button class="btn-decrement">-</button>
                                        <span class="quantity-value">1</span>
                                        <button class="btn-increment">+</button>
                                    </div>
                                    <button class="details-btn">Xem chi tiết</button>
                                    <button class="delete-btn">Xóa</button>
                                </div>
                                <div class="product-details" data-config='{
                                    "RAM": "12GB",
                                    "Bộ nhớ trong": "256GB",
                                    "Màn hình": "6.5 inch",
                                    "Dung lượng pin": "4500mAh",
                                    "Màu sắc": "Vàng",
                                    "Độ phân giải": "108MP"
                                }' data-price="17490000" data-idCHSP="4" data-idDSP="4">
                                    <img src="https://via.placeholder.com/80x100" alt="Xiaomi 14" class="product-image" style="width: 80px;">
                                    <div class="flex-grow-1">
                                        <h6>Xiaomi 14</h6>
                                        <p class="text-success mb-0">17,490,000 đ</p>
                                    </div>
                                    <div class="quantity-selector">
                                        <button class="btn-decrement">-</button>
                                        <span class="quantity-value">1</span>
                                        <button class="btn-increment">+</button>
                                    </div>
                                    <button class="details-btn">Xem chi tiết</button>
                                    <button class="delete-btn">Xóa</button>
                                </div>
                            </div>
                            <div class="total-price" id="total-price-products">Tổng tiền: 0 đ</div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12">
                            <h5>Chi tiết cấu hình</h5>
                            <div class="config-container" id="config-container">
                                <p>Chọn một sản phẩm để xem chi tiết cấu hình.</p>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-4">
                        <div class="col-12">
                            <button class="btn checkout-btn w-100" onclick="handleMultiProductCheckout()">Thanh toán</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>