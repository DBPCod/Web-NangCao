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

<script src="/smartstation/src/public/js/admin/customer.js"></script>