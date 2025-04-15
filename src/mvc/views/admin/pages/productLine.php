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
                <th>Thương hiệu</th>
                <th class="text-center" style="width: 140px">Hành động</th>
            </tr>
        </thead>
        <tbody id="productLineTableBody"></tbody>
    </table>
</div>

<!-- Modal để thêm/sửa dòng sản phẩm -->
<div class="modal fade" id="productLineModal" tabindex="-1" aria-labelledby="productLineModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header bg-green">
                <h5 class="modal-title text-white" id="productLineModalLabel">Thêm dòng sản phẩm</h5>
                <button type="button" class="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="productLineForm">
                    <div class="mb-3">
                        <label for="tenDong" class="form-label">Tên dòng</label>
                        <input type="text" class="form-control" id="tenDong" required>
                    </div>
                    <div class="mb-3">
                        <label for="idThuongHieu" class="form-label">Thương hiệu</label>
                        <select class="form-control" id="idThuongHieu" required>
                            <option value="">Chọn thương hiệu</option>
                            <!-- Options sẽ được thêm bằng JavaScript -->
                        </select>
                    </div>
                    <div class="mb-3" id="soLuongField" style="display: none;">
                        <label for="soLuong" class="form-label">Số lượng</label>
                        <input type="number" class="form-control" id="soLuong" disabled>
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

<style>
    .bg-green {
        background-color: #218838;
    }
</style>

<script src="/smartstation/src/public/js/admin/productLine.js"></script>