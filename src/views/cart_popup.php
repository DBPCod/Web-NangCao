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
                        <img src="./src/public/img/product-sample.jpg" alt="Product" class="img-thumbnail me-3" style="width: 60px;">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">Tên sản phẩm</h6>
                            <p class="mb-0 text-muted">100.000 VNĐ x 1</p>
                        </div>
                        <button class="btn btn-sm btn-danger ms-3">Xóa</button>
                    </div>
                </div>
                <p class="text-end mt-3">Tổng cộng: <strong>100.000 VNĐ</strong></p>
                <a href="#" class="btn btn-success w-100 custom-btn">Thanh toán</a>
            </div>
        </div>
    </div>
</div>