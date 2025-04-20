<?php include '../includes/header.php'; ?>
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Quản lý khuyến mãi</h2>
        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addPromotionModal">Thêm khuyến mãi</button>
    </div>
    <table class="table table-hover">
        <thead>
            <tr>
                <th>ID Khuyến mãi</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày kết thúc</th>
                <th>Phần trăm giảm</th>
                <th>Trạng thái</th>
                <th class="text-center" style="width: 120px">Hành động</th>
            </tr>
        </thead>
        <tbody id="promotionTableBody"></tbody>
    </table>

    <!-- Modal Xem chi tiết dòng sản phẩm -->
    <div class="modal fade" id="productLineModal" tabindex="-1" aria-labelledby="productLineModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-green">
                    <h5 class="modal-title text-white" id="productLineModalLabel">Danh sách dòng sản phẩm áp dụng khuyến mãi</h5>
                    <button type="button" class="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ul id="productLineList" class="list-group"></ul>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Thêm khuyến mãi -->
    <div class="modal fade" id="addPromotionModal" tabindex="-1" aria-labelledby="addPromotionModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-green">
                    <h5 class="modal-title text-white" id="addPromotionModalLabel">Thêm khuyến mãi mới</h5>
                    <button type="button" class="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="addPromotionForm">
                        <div class="mb-3">
                            <label for="startDate" class="form-label">Ngày bắt đầu</label>
                            <input type="date" class="form-control" id="startDate" required>
                        </div>
                        <div class="mb-3">
                            <label for="endDate" class="form-label">Ngày kết thúc</label>
                            <input type="date" class="form-control" id="endDate" required>
                        </div>
                        <div class="mb-3">
                            <label for="discountPercent" class="form-label">Phần trăm giảm</label>
                            <input type="number" class="form-control" id="discountPercent" min="0" max="100" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Dòng sản phẩm áp dụng</label>
                            <input type="text" class="form-control mb-2" id="productLineSearch" placeholder="Tìm kiếm dòng sản phẩm...">
                            <div class="table-responsive" style="max-height: 200px; overflow-y: auto;">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th><input type="checkbox" id="selectAll"></th>
                                            <th>Tên dòng sản phẩm</th>
                                        </tr>
                                    </thead>
                                    <tbody id="productLineTableBody"></tbody>
                                </table>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Lưu</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .bg-green {
        background-color: #218838;
    }
    .product-row:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
</style>

<script src="/smartstation/src/public/js/admin/promotion.js"></script>