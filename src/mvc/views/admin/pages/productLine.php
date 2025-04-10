<?php include '../includes/header.php'; ?>
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Quản lý dòng sản phẩm</h2>
        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#productLineModal" onclick="openAddModal()">Thêm dòng sản phẩm</button>
    </div>
    <table class="table">
        <thead>
            <tr>
                <th>ID Dòng sản phẩm</th>
                <th>Tên dòng</th>
                <th>Số lượng</th>
                <th>ID Thương hiệu</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody id="productLineTableBody"></tbody>
    </table>
</div>

<!-- Modal để thêm/sửa dòng sản phẩm -->
<div class="modal fade" id="productLineModal" tabindex="-1" aria-labelledby="productLineModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="productLineModalLabel">Thêm dòng sản phẩm</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="productLineForm">
                    <div class="mb-3">
                        <label for="idDongSanPham" class="form-label">ID Dòng sản phẩm</label>
                        <input type="text" class="form-control" id="idDongSanPham" required>
                    </div>
                    <div class="mb-3">
                        <label for="tenDong" class="form-label">Tên dòng</label>
                        <input type="text" class="form-control" id="tenDong" required>
                    </div>
                    <div class="mb-3">
                        <label for="soLuong" class="form-label">Số lượng</label>
                        <input type="number" class="form-control" id="soLuong" required>
                    </div>
                    <div class="mb-3">
                        <label for="idThuongHieu" class="form-label">ID Thương hiệu</label>
                        <input type="number" class="form-control" id="idThuongHieu">
                    </div>
                    <div class="mb-3">
                        <label for="trangThai" class="form-label">Trạng thái</label>
                        <select class="form-control" id="trangThai" required>
                            <option value="1">Hoạt động</option>
                            <option value="0">Ngừng hoạt động</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary" onclick="saveProductLine()">Lưu</button>
            </div>
        </div>
    </div>
</div>

<script src="/smartstation/src/public/js/admin/productLine.js"></script>