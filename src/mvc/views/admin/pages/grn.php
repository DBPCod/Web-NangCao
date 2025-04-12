<?php include '../includes/header.php'; ?>
<div class="container-fluid">
    <div class="row">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h2>Quản lý phiếu nhập</h2>
            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addGRNModal">Thêm phiếu nhập</button>
        </div>
        <table class="table table-bordered table-hover">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Nhà cung cấp</th>
                    <th>Tổng tiền</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody id="grnTableBody"></tbody>
        </table>
    </div>
</div>

<!-- Modal Thêm Phiếu nhập -->
<div class="modal fade" id="addGRNModal" tabindex="-1" aria-labelledby="addGRNModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title" id="addGRNModalLabel">Thêm phiếu nhập</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="addGRNForm">
                    <div class="mb-3">
                        <label class="form-label fw-bold">Người thêm</label>
                        <input type="text" class="form-control" id="nguoiThem" value="<?php 
                            echo isset($_SESSION['admin_info']['hovaten']) ? htmlspecialchars($_SESSION['admin_info']['hovaten']) : 
                                (isset($_COOKIE['admin_hovaten']) ? htmlspecialchars($_COOKIE['admin_hovaten']) : 'Không xác định'); 
                        ?>" readonly>
                    </div>
                    <div class="mb-3">
                        <label for="idNCC" class="form-label fw-bold">Nhà cung cấp</label>
                        <select class="form-control" id="idNCC" required>
                            <option value="">Chọn nhà cung cấp</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="ngayNhap" class="form-label fw-bold">Ngày nhập</label>
                        <input type="date" class="form-control" id="ngayNhap" readonly>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Danh sách sản phẩm</label>
                        <div id="productList" class="product-list p-3 bg-light rounded"></div>
                        <button type="button" class="btn btn-primary btn-sm mt-2" onclick="addProductRow()">Thêm sản phẩm</button>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Tổng số lượng</label>
                        <input type="text" class="form-control" id="totalQuantity" readonly>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Tổng giá nhập</label>
                        <input type="text" class="form-control" id="totalPriceIn" readonly>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary" onclick="submitAddGRN()">Lưu</button>
            </div>
        </div>
    </div>
</div>

<style>
    .product-list {
        max-height: 400px;
        overflow-y: auto;
        border: 1px solid #e0e0e0;
        padding: 15px;
        background-color: #f8f9fa;
        border-radius: 8px;
    }
    .product-row {
        margin-bottom: 15px;
        padding: 15px;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        position: relative;
        background-color: #ffffff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        transition: all 0.2s ease;
    }
    .product-row:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .product-row .row {
        align-items: center;
    }
    .product-row select, .product-row input {
        height: 38px;
        font-size: 14px;
        border-radius: 4px;
    }
    .product-row .product-details {
        font-size: 13px;
        line-height: 1.5;
        color: #555;
    }
    .product-row .btn-danger {
        font-size: 12px;
        padding: 5px 10px;
        border-radius: 4px;
    }
    .form-label {
        font-size: 14px;
        color: #333;
    }
    .modal-content {
        border-radius: 10px;
    }
    .modal-header {
        border-bottom: none;
    }
    .modal-footer {
        border-top: none;
    }
</style>

<script src="/smartstation/src/public/js/admin/grn.js"></script>