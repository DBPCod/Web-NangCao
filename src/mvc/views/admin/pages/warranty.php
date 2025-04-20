<?php include '../includes/header.php'; ?>
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Quản lý bảo hành</h2>
        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addWarrantyModal">Thêm bảo hành</button>
    </div>
    <table class="table">
        <thead>
            <tr>
                <th>ID Bảo hành</th>
                <th>Thời gian bảo hành (tháng)</th>
                <th>Trạng thái</th>
                <th class="text-center" style="width: 140px;">Hành động</th>
            </tr>
        </thead>
        <tbody id="warrantyTableBody"></tbody>
    </table>

    <!-- Modal Thêm Bảo Hành -->
    <div class="modal fade" id="addWarrantyModal" tabindex="-1" aria-labelledby="addWarrantyModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-green">
                    <h5 class="modal-title text-white" id="addWarrantyModalLabel">Thêm bảo hành mới</h5>
                    <button type="button" class="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="addWarrantyForm">
                        <div class="mb-3">
                            <label for="thoiGianBaoHanh" class="form-label">Thời gian bảo hành (tháng)</label>
                            <input type="number" class="form-control" id="thoiGianBaoHanh" name="ThoiGianBaoHanh" required min="1">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" onclick="addWarranty()">Thêm</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Sửa Bảo Hành -->
    <div class="modal fade" id="editWarrantyModal" tabindex="-1" aria-labelledby="editWarrantyModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-green">
                    <h5 class="modal-title text-white" id="editWarrantyModalLabel">Sửa thời gian bảo hành</h5>
                    <button type="button" class="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editWarrantyForm">
                        <input type="hidden" id="editIdBaoHanh" name="IdBaoHanh">
                        <div class="mb-3">
                            <label for="editThoiGianBaoHanh" class="form-label">Thời gian bảo hành (tháng)</label>
                            <input type="number" class="form-control" id="editThoiGianBaoHanh" name="ThoiGianBaoHanh" required min="1">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" onclick="updateWarranty()">Cập nhật</button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .bg-green {
        background-color: #218838;
    }
</style>

<script src="/smartstation/src/public/js/admin/warranty.js"></script>