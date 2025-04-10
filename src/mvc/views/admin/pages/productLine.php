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
                <th>Số lượng</th>
                <th>ID Thương hiệu</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody id="productLineTableBody"></tbody>
    </table>
</div>

<!-- Modal -->
<div class="modal fade" id="providerModal" tabindex="-1" aria-labelledby="providerModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="providerModalLabel">Thêm nhà cung cấp</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="providerForm">
                    <div class="mb-3">
                        <label for="tenNCC" class="form-label">Tên nhà cung cấp</label>
                        <input type="text" class="form-control" id="tenNCC" name="TenNCC" required>
                    </div>
                    <div class="mb-3">
                        <label for="diaChi" class="form-label">Địa chỉ</label>
                        <input type="text" class="form-control" id="diaChi" name="DiaChi" required>
                    </div>
                    <div class="mb-3">
                        <label for="soDienThoai" class="form-label">Số điện thoại</label>
                        <input type="text" class="form-control" id="soDienThoai" name="SoDienThoai" required>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" name="Email" required>
                    </div>
                    <div class="mb-3">
                        <label for="trangThai" class="form-label">Trạng thái</label>
                        <select class="form-select" id="trangThai" name="TrangThai" required>
                            <option value="1">Hoạt động</option>
                            <option value="0">Ngừng hoạt động</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary" id="saveProviderBtn">Lưu</button>
            </div>
        </div>
    </div>
</div>

<script src="/smartstation/src/public/js/admin/productLine.js"></script>    