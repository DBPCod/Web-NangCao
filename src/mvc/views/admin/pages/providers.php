<?php include '../includes/header.php'; ?>
<div class="container-fluid">
    <h2>Quản lý nhà cung cấp</h2>
    <table class="table">
        <thead>
            <tr>
                <th>ID Nhà cung cấp</th>
                <th>Tên nhà cung cấp</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody id="providerTableBody"></tbody>
    </table>
</div>

<script src="/smartstation/src/public/js/admin/provider.js"></script>