<div id="orderHistory" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content custom-modal">
            <div class="modal-header bg-info text-white">
                <h5 class="modal-title" style="color: white;">Lịch sử mua hàng</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <!-- Status filter dropdown -->
                <div class="mb-3">
                    <label for="statusFilter" class="form-label fw-bold">Lọc theo tình trạng</label>
                    <select id="statusFilter" class="form-select">
                        <option value="" selected>Tất cả</option>
                        <option value="1">Chưa xác nhận</option>
                        <option value="2">Đã xác nhận</option>
                        <option value="3">Thành công</option>
                        <option value="4">Hủy</option>
                    </select>
                </div>
                <!-- Bảng đơn hàng -->
                <table class="table table-bordered">
                    <thead class="table-dark" id="oderHistoryTable">
                        <tr>
                            <th>Ngày tạo</th>
                            <th>Tổng tiền</th>
                            <th>Tình trạng</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody id="orderHistoryTableBody"></tbody>
                </table>
                <div id="orderHistoryEmpty" class="text-center" style="display: none;">
                    <p>Bạn chưa có đơn hàng nào.</p>
                </div>
                <!-- Phân trang -->
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center" id="pagination"></ul>
                </nav>
            </div>
        </div>
    </div>
</div>

<!-- Modal Chi tiết Hóa đơn -->
<div class="modal fade" id="viewOrderModal" tabindex="-1" aria-labelledby="viewOrderModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header bg-info text-white">
                <h5 class="modal-title" id="viewOrderModalLabel">Chi tiết hóa đơn</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label fw-bold">ID Hóa đơn</label>
                    <input type="text" class="form-control" id="viewIdHoaDon" readonly>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Khách hàng</label>
                    <input type="text" class="form-control" id="viewTenKhachHang" readonly>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Ngày tạo</label>
                    <input type="text" class="form-control" id="viewNgayTao" readonly>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Tổng tiền</label>
                    <input type="text" class="form-control" id="viewThanhTien" readonly>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Trạng thái</label>
                    <input type="text" class="form-control" id="viewTrangThai" readonly>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Tình trạng đơn hàng</label>
                    <input type="text" class="form-control" id="viewTinhTrang" readonly>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Danh sách sản phẩm</label>
                    <table class="table table-bordered">
                        <thead class="table-light">
                            <tr>
                                <th>Dòng sản phẩm</th>
                                <th>Cấu hình</th>
                                <th>IMEI</th>
                                <th>Số lượng</th>
                                <th>Giá bán</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody id="viewProductList"></tbody>
                    </table>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            </div>
        </div>
    </div>
</div>