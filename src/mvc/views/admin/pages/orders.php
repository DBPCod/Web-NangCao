<?php include '../includes/header.php'; ?>
<div class="container-fluid">
    <div class="row">
        <h2>Quản lý đơn hàng</h2>
        <!-- Bộ lọc -->
        <div class="mb-4">
            <form id="filterForm" class="row g-3">
                <div class="col-md-3">
                    <label for="filterTinhTrang" class="form-label">Tình trạng</label>
                    <select id="filterTinhTrang" class="form-select">
                        <option value="">Tất cả</option>
                        <option value="1">Chưa xác nhận</option>
                        <option value="2">Đã xác nhận</option>
                        <option value="3">Đã giao (Thành công)</option>
                        <option value="4">Đã giao (Hủy)</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label for="filterFromDate" class="form-label">Từ ngày</label>
                    <input type="date" id="filterFromDate" class="form-control">
                </div>
                <div class="col-md-3">
                    <label for="filterToDate" class="form-label">Đến ngày</label>
                    <input type="date" id="filterToDate" class="form-control">
                </div>
                <div class="col-md-3">
                    <label for="filterDiaChi" class="form-label">Địa điểm giao hàng</label>
                    <input type="text" id="filterDiaChi" class="form-control" placeholder="Quận/Huyện/Thành phố">
                </div>
                <div class="col-md-12 mt-3">
                    <button type="submit" class="btn btn-primary">Lọc</button>
                    <button type="button" id="resetFilter" class="btn btn-secondary">Xóa bộ lọc</button>
                </div>
            </form>
        </div>
        <!-- Bảng đơn hàng -->
        <table class="table table-bordered table-hover">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Khách hàng</th>
                    <th>Tổng tiền</th>
                    <th>Tình trạng</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody id="orderTableBody"></tbody>
        </table>
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
                    <select class="form-select" id="viewTinhTrang" onchange="confirmUpdateStatusModal(this)">
                        <!-- Điền động bằng JS -->
                    </select>
                    <small class="form-text text-muted" id="tinhTrangHint"></small>
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

<style>
    .modal-content {
        border-radius: 10px;
    }
    .modal-header {
        border-bottom: none;
    }
    .modal-footer {
        border-top: none;
    }
    tr:hover {
        background-color: #f8f9fa;
    }
    .form-label {
        font-size: 14px;
        color: #333;
    }
    .form-control, .form-select {
        font-size: 14px;
    }
    .table th, .table td {
        vertical-align: middle;
    }
    /* Màu sắc cho dropdown trạng thái */
    #viewTinhTrang option[value="1"] { color: #6c757d; } /* Chưa xác nhận: Xám */
    #viewTinhTrang option[value="2"] { color: #007bff; } /* Đã xác nhận: Xanh dương */
    #viewTinhTrang option[value="3"] { color: #28a745; } /* Thành công: Xanh lá */
    #viewTinhTrang option[value="4"] { color: #dc3545; } /* Hủy: Đỏ */
    /* Màu sắc cho trạng thái trong bảng */
    .status-1 { color: #6c757d; font-weight: bold; } /* Chưa xác nhận */
    .status-2 { color: #007bff; font-weight: bold; } /* Đã xác nhận */
    .status-3 { color: #28a745; font-weight: bold; } /* Thành công */
    .status-4 { color: #dc3545; font-weight: bold; } /* Hủy */
    /* Nút hành động */
    .action-btn {
        margin-right: 5px;
        font-size: 12px;
        padding: 4px 8px;
    }
</style>

<script src="/smartstation/src/public/js/admin/orders.js"></script>