<?php include '../includes/header.php'; ?>
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Quản lý cấu hình sản phẩm</h2>
        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#productConfigModal" onclick="openAddModal()">Thêm cấu hình sản phẩm</button>
    </div>
    <table class="table">
        <thead>
            <tr>
                <th>ID Cấu hình</th>
                <th>Ram</th>
                <th>Rom</th>
                <th>Màn hình</th>
                <th>Pin</th>
                <th>Màu sắc</th>
                <th>Camera</th>
                <th class="text-center" style="width: 140px">Hành động</th>
            </tr>
        </thead>
        <tbody id="productConfigTableBody"></tbody>
    </table>
</div>

<!-- Modal để thêm/sửa cấu hình sản phẩm -->
<div class="modal fade" id="productConfigModal" tabindex="-1" aria-labelledby="productConfigModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header bg-green">
                <h5 class="modal-title text-white" id="productConfigModalLabel">Thêm cấu hình sản phẩm</h5>
                <button type="button" class="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="productConfigForm">
                    <div class="mb-3">
                        <label for="ram" class="form-label">Ram (GB)</label>
                        <input type="number" class="form-control" id="ram" min="0" step="1" required>
                    </div>
                    <div class="mb-3">
                        <label for="rom" class="form-label">Rom (GB)</label>
                        <input type="number" class="form-control" id="rom" min="0" step="1" required>
                    </div>
                    <div class="mb-3">
                        <label for="manHinh" class="form-label">Màn hình (inch)</label>
                        <input type="number" class="form-control" id="manHinh" min="0" step="0.1" required>
                    </div>
                    <div class="mb-3">
                        <label for="pin" class="form-label">Pin (mAh)</label>
                        <input type="number" class="form-control" id="pin" min="0" step="1" required>
                    </div>
                    <div class="mb-3">
                        <label for="mauSac" class="form-label">Màu sắc</label>
                        <input type="text" class="form-control" id="mauSac" required>
                    </div>
                    <div class="mb-3">
                        <label for="camera" class="form-label">Camera (MP)</label>
                        <input type="number" class="form-control" id="camera" min="0" step="1" required>
                    </div>
                    <!-- <div class="mb-3">
                        <label for="trangThai" class="form-label">Trạng thái</label>
                        <select class="form-control" id="trangThai" required>
                            <option value="1">Hoạt động</option>
                            <option value="0">Ngừng hoạt động</option>
                        </select>
                    </div> -->
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary" onclick="saveProductConfig()">Lưu</button>
            </div>
        </div>
    </div>
</div>

<style>
    .bg-green {
        background-color: #218838;
    }
</style>

<script src="/smartstation/src/public/js/admin/productConfig.js"></script>