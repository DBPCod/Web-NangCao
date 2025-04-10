<?php include '../includes/header.php'; ?>
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Quản lý thương hiệu sản phẩm</h2>
        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addBrandModal">Thêm thương hiệu</button>
    </div>
    <table class="table">
        <thead>
            <tr>
                <th>ID Thương hiệu</th>
                <th>Tên thương hiệu</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody id="brandTableBody"></tbody>
    </table>
</div>

<!-- Modal Thêm Thương Hiệu -->
<div class="modal fade" id="addBrandModal" tabindex="-1" aria-labelledby="addBrandModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addBrandModalLabel">Thêm thương hiệu mới</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="addBrandForm">
                    <div class="mb-3">
                        <label for="tenThuongHieu" class="form-label">Tên thương hiệu</label>
                        <input type="text" class="form-control" id="tenThuongHieu" name="tenThuongHieu" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary" onclick="submitAddBrand()">Thêm</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal Sửa Thương Hiệu -->
<div class="modal fade" id="editBrandModal" tabindex="-1" aria-labelledby="editBrandModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editBrandModalLabel">Sửa thương hiệu</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="editBrandForm">
                    <input type="hidden" id="editIdThuongHieu" name="idThuongHieu">
                    <div class="mb-3">
                        <label for="editTenThuongHieu" class="form-label">Tên thương hiệu</label>
                        <input type="text" class="form-control" id="editTenThuongHieu" name="tenThuongHieu" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary" onclick="submitEditBrand()">Lưu</button>
            </div>
        </div>
    </div>
</div>

<script src="/smartstation/src/public/js/admin/brand.js"></script>