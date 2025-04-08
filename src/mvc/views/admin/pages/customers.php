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
                <th>Mật khẩu</th>
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>Nguyễn Văn A</td>
                <td>nva@example.com</td>
                <td>5 nguyen trai</td>
                <td>0908701337</td>
                <td>Đang hoạt động</td>
                <td>sieunhan123</td>
                <td>123siu123</td>
                <td>
                    <button class="btn btn-primary">Sửa</button>
                    <button class="btn btn-danger">Xóa</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<script src="/smartstation/src/public/js/admin/customer.js"></script>