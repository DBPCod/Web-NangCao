<!-- singleProductCheckout.php -->
<div class="modal fade" id="buyNowModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Mua ngay</h5>
                <button type="button" class="btn-close" onclick="handleCloseModal('buyNowModal')"></button>
            </div>
            <div class="modal-body" id="buyNowModalBody">
                <div class="container mt-3">
                    <div class="row">
                        <div class="col-md-6">
                            //render thong tin san pham
                        </div>
                        <div class="col-md-6">
                            <h3>Đặt hàng sản phẩm</h3>
                            <div class="mb-3">
                                <label>Số lượng</label>
                                <div class="quantity-selector">
                                    <button class="btn-decrement">-</button>
                                    <span class="quantity-value">1</span>
                                    <button class="btn-increment">+</button>
                                </div>
                            </div>
                            <div class="total-price" id="total-price">Tổng tiền: 0 đ</div>
                            <div class="mb-3">
                                <label>Họ và tên *</label>
                                <input type="text" class="form-control" placeholder="Họ và tên" id="FullName" disabled>
                            </div>
                            <div class="mb-3">
                                <label>Số điện thoại *</label>
                                <input type="text" class="form-control" placeholder="Số điện thoại" id="PhoneNumber" disabled>
                                <label class="mt-2">Email *</label>
                                <input type="email" class="form-control" placeholder="Email" id="Email" disabled>
                            </div>
                            <div class="mb-3">
                                <label>Địa chỉ *</label>
                                <input type="text" class="form-control" id="address-input" placeholder="Địa chỉ" disabled>
                                <div class="form-check mt-2">
                                    <input class="form-check-input" type="radio" name="edit-address" id="edit-address" value="edit">
                                    <label class="form-check-label" for="edit-address">Chỉnh sửa địa chỉ</label>
                                </div>
                            </div>
                            <button class="btn btn-secondary w-100" onclick="handleCheckout()">Thanh toán</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>