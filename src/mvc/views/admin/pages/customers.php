<?php include '../includes/header.php'; ?>
<div class="container-fluid">
    <h2>Quản lý khách hàng</h2>
    <table class="table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Tên khách hàng</th>
                <th>Email</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Trạng thái</th>
                <th>Tài khoản</th>
                <th>Vai trò</th>
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody>
            <!-- Dữ liệu sẽ được render bằng JavaScript -->
        </tbody>
    </table>
    <!-- Container cho các nút phân trang -->
    <div id="pagination" class="d-flex justify-content-center mt-3"></div>
</div>

<!-- Modal chỉnh sửa vai trò -->
<div id="editRoleModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); justify-content: center; align-items: center;">
    <div class="modal-content" style="background-color: white; padding: 20px; border-radius: 5px; width: 400px;">
        <h3>Chỉnh sửa vai trò</h3>
        <div class="mb-3">
            <label for="roleSelect" class="form-label">Chọn vai trò:</label>
            <select id="roleSelect" class="form-select"></select>
        </div>
        <button id="saveRoleBtn" class="btn btn-primary">Lưu</button>
        <button id="closeModalBtn" class="btn btn-secondary">Đóng</button>
    </div>
</div>

<!-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"> -->
<script src="/smartstation/src/public/js/admin/customer.js"></script>