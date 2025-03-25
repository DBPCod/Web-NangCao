<!-- views/cart_popup.php -->
<div id="cartPopup" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content custom-modal">
            <button type="button" class="btn-close custom-close" data-bs-dismiss="modal" aria-label="Close"></button>
            <div class="modal-body">
                <h5 class="modal-title text-center mb-4">Giỏ hàng của bạn</h5>
                <div class="text-center cart-empty" style="display: none;">
                    <p>Giỏ hàng của bạn đang trống!</p>
                    <a href="#" class="btn btn-primary custom-btn" data-bs-dismiss="modal">Tiếp tục mua sắm</a>
                </div>
                <div class="cart-items">
                    <div class="cart-item d-flex align-items-center mb-3">
                        <img src="./src/public/img/ip16_1.png" alt="Product" class="img-thumbnail me-3" style="width: 60px;">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">Tên sản phẩm</h6>
                            <p class="mb-0 text-muted">100.000 VNĐ x 1</p>
                        </div>
                        <button class="btn btn-sm btn-danger ms-3">Xóa</button>
                    </div>
                    <div class="cart-item d-flex align-items-center mb-3">
                        <img src="./src/public/img/ip16_1.png" alt="Product" class="img-thumbnail me-3" style="width: 60px;">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">Tên sản phẩm</h6>
                            <p class="mb-0 text-muted">100.000 VNĐ x 1</p>
                        </div>
                        <button class="btn btn-sm btn-danger ms-3">Xóa</button>
                    </div>
                    <div class="cart-item d-flex align-items-center mb-3">
                        <img src="./src/public/img/ip16_1.png" alt="Product" class="img-thumbnail me-3" style="width: 60px;">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">Tên sản phẩm</h6>
                            <p class="mb-0 text-muted">100.000 VNĐ x 1</p>
                        </div>
                        <button class="btn btn-sm btn-danger ms-3">Xóa</button>
                    </div>
                    <div class="cart-item d-flex align-items-center mb-3">
                        <img src="./src/public/img/ip16_1.png" alt="Product" class="img-thumbnail me-3" style="width: 60px;">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">Tên sản phẩm</h6>
                            <p class="mb-0 text-muted">100.000 VNĐ x 1</p>
                        </div>
                        <button class="btn btn-sm btn-danger ms-3">Xóa</button>
                    </div>
                    <div class="cart-item d-flex align-items-center mb-3">
                        <img src="./src/public/img/ip16_1.png" alt="Product" class="img-thumbnail me-3" style="width: 60px;">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">Tên sản phẩm</h6>
                            <p class="mb-0 text-muted">100.000 VNĐ x 1</p>
                        </div>
                        <button class="btn btn-sm btn-danger ms-3">Xóa</button>
                    </div>
                    <div class="cart-item d-flex align-items-center mb-3">
                        <img src="./src/public/img/ip16_1.png" alt="Product" class="img-thumbnail me-3" style="width: 60px;">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">Tên sản phẩm</h6>
                            <p class="mb-0 text-muted">100.000 VNĐ x 1</p>
                        </div>
                        <button class="btn btn-sm btn-danger ms-3">Xóa</button>
                    </div>
                    <div class="cart-item d-flex align-items-center mb-3">
                        <img src="./src/public/img/ip16_1.png" alt="Product" class="img-thumbnail me-3" style="width: 60px;">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">Tên sản phẩm</h6>
                            <p class="mb-0 text-muted">100.000 VNĐ x 1</p>
                        </div>
                        <button class="btn btn-sm btn-danger ms-3">Xóa</button>
                    </div>
                    <div class="cart-item d-flex align-items-center mb-3">
                        <img src="./src/public/img/ip16_1.png" alt="Product" class="img-thumbnail me-3" style="width: 60px;">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">Tên sản phẩm</h6>
                            <p class="mb-0 text-muted">100.000 VNĐ x 1</p>
                        </div>
                        <button class="btn btn-sm btn-danger ms-3">Xóa</button>
                    </div>
                    <div class="cart-item d-flex align-items-center mb-3">
                        <img src="./src/public/img/ip16_1.png" alt="Product" class="img-thumbnail me-3" style="width: 60px;">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">Tên sản phẩm</h6>
                            <p class="mb-0 text-muted">100.000 VNĐ x 1</p>
                        </div>
                        <button class="btn btn-sm btn-danger ms-3">Xóa</button>
                    </div>
                    <div class="cart-item d-flex align-items-center mb-3">
                        <img src="./src/public/img/ip16_1.png" alt="Product" class="img-thumbnail me-3" style="width: 60px;">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">Tên sản phẩm</h6>
                            <p class="mb-0 text-muted">100.000 VNĐ x 1</p>
                        </div>
                        <button class="btn btn-sm btn-danger ms-3">Xóa</button>
                    </div>
                </div>
                <p class="text-end mt-3">Tổng cộng: <strong>100.000 VNĐ</strong></p>
                
                <!-- Phần radio button và trường nhập địa chỉ -->
                <div class="address-selection mt-4 mb-4">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="addressOption" id="defaultAddress" value="default" checked>
                        <label class="form-check-label" for="defaultAddress">
                            Sử dụng địa chỉ mặc định
                        </label>
                    </div>
                    <div class="form-check mt-2">
                        <input class="form-check-input" type="radio" name="addressOption" id="otherAddress" value="other">
                        <label class="form-check-label" for="otherAddress">
                            Chọn địa chỉ khác
                        </label>
                    </div>
                    <div class="mt-2" id="customAddressField" style="display: none;">
                        <textarea class="form-control" rows="3" placeholder="Nhập địa chỉ mới" id="customAddressInput"></textarea>
                    </div>
                </div>

                <a href="#" class="btn btn-success w-100 custom-btn">Thanh toán</a>
            </div>
        </div>
    </div>
</div>