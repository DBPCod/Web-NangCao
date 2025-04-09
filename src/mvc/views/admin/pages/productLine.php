<?php include '../includes/header.php'; ?>
<div class="container-fluid">
    <h2>Quản lý khuyến mãi</h2>
    <table class="table">
        <thead>
            <tr>
                <th>ID Khuyến mãi</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày kết thúc</th>
                <th>Phần trăm giảm</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody id="promotionTableBody"></tbody>
    </table>

    <!-- Modal Xem chi tiết dòng sản phẩm -->
    <div class="modal fade" id="productLineModal" tabindex="-1" aria-labelledby="productLineModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="productLineModalLabel">Danh sách dòng sản phẩm áp dụng khuyến mãi</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
</div>

<script src="/smartstation/src/public/js/admin/promotion.js"></script>