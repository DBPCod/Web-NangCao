<div id="cartPopup" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content custom-modal">
            <button type="button" class="btn-close custom-close" data-bs-dismiss="modal" aria-label="Close"></button>
            <div class="modal-body">
                <h5 class="modal-title text-center mb-4">Giỏ hàng của bạn</h5>
                <div class="text-center cart-empty" style="display: none;">
                    <p>Giỏ hàng của bạn đang trống!</p>
                    <a href="#" class="btn btn-primary custom-btn" data-bs-dismiss="modal">Tiếp tục mua sắm</a>
                </div>
                <div class="cart-items">
                    <!-- <div class="cart-item d-flex align-items-center mb-3">
                        <div class="cart-item-info d-flex align-items-center">
                            <img src="../../../public/img/ip16_1.png" alt="Product" class="img-thumbnail me-3" style="width: 70px;">
                            <div class="flex-grow-1">
                                <h6 class="mb-1">Iphone 7 - 128GB - Màu Xanh</h6>
                                <span>10.000VND</span>
                            </div>
                        </div>
                        <div class="cart-item-controls d-flex align-items-center ms-auto">
                            <div class="input-group input-group-sm quantity-group" style="width: 110px;">
                                <button class="btn btn-outline-secondary btn-decrease" type="button">-</button>
                                <input type="number" class="form-control text-center quantity-input" min="1" value="1">
                                <button class="btn btn-outline-secondary btn-increase" type="button">+</button>
                            </div>
                            <button class="btn btn-sm btn-danger ms-3">Xóa</button>
                        </div>
                    </div>
                    <div class="cart-item d-flex align-items-center mb-3">
                        <div class="cart-item-info d-flex align-items-center">
                            <img src="../../../public/img/ip16_1.png" alt="Product" class="img-thumbnail me-3" style="width: 70px;">
                            <div class="flex-grow-1">
                                <h6 class="mb-1">Iphone 7 - 128GB - Màu Xanh</h6>
                                <span>10.000VND</span>
                            </div>
                        </div>
                        <div class="cart-item-controls d-flex align-items-center ms-auto">
                            <div class="input-group input-group-sm quantity-group" style="width: 110px;">
                                <button class="btn btn-outline-secondary btn-decrease" type="button">-</button>
                                <input type="number" class="form-control text-center quantity-input" min="1" value="1">
                                <button class="btn btn-outline-secondary btn-increase" type="button">+</button>
                            </div>
                            <button class="btn btn-sm btn-danger ms-3">Xóa</button>
                        </div>
                    </div> -->
                </div>
                <p class="text-end mt-3">Tổng cộng: <strong id="totalPrice"></strong></p>
                <a href="#" class="btn btn-success w-100 custom-btn">Thanh toán</a>
            </div>
        </div>
    </div>
</div>