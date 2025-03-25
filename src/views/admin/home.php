<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - VY Food</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-3 col-lg-2 sidebar">
                <div class="text-center mb-4">
                    <img src="../../public/img/logo.png" alt="VY Food Logo" width="50">
                    <h4>Smart Station</h4>
                </div>
                <nav class="nav flex-column">
                    <a class="nav-link active" href="#" data-section="dashboard">Trang tổng quan</a>
                    <a class="nav-link" href="#" data-section="users">Quản lý user</a>
                    <a class="nav-link" href="#" data-section="products">Quản lý sản phẩm</a>
                    <a class="nav-link" href="#" data-section="orders">Quản lý đơn hàng</a>
                    <a class="nav-link" href="#" data-section="statistics">Thống kê</a>
                    <a class="nav-link" href="./logout.php">Đăng xuất</a>
                </nav>
            </div>

            <!-- Main Content -->
            <div class="col-md-9 col-lg-10">
                <div class="header">
                    DASHBOARD SMART STATION
                </div>
                <div class="content-area" id="contentArea">
                    <!-- Default Dashboard Content -->
                    <div class="row">
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body text-center">
                                    <h5>Khách hàng</h5>
                                    <h2>0</h2>
                                    <p>Số lượng khách hàng hiện tại.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body text-center">
                                    <h5>Sản phẩm</h5>
                                    <h2>60</h2>
                                    <p>Số lượng sản phẩm đang hiển thị.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body text-center">
                                    <h5>Doanh thu</h5>
                                    <h2>0 đ</h2>
                                    <p>Doanh thu hiện tại.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal for Adding Product -->
    <div class="modal fade" id="addProductModal" tabindex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addProductModalLabel">Thêm sản phẩm</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="addProductForm">
                        <div class="mb-3">
                            <label for="productName" class="form-label">Tên sản phẩm</label>
                            <input type="text" class="form-control" id="productName" required>
                        </div>
                        <div class="mb-3">
                            <label for="productCategory" class="form-label">Phân loại</label>
                            <select class="form-select" id="productCategory" required>
                                <option value="">Chọn phân loại</option>
                                <option value="food">Thực phẩm</option>
                                <option value="drink">Đồ uống</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="productImage" class="form-label">Hình ảnh</label>
                            <input type="file" class="form-control" id="productImage" accept="image/*" required>
                            <img id="imagePreview" src="#" alt="Image Preview" class="img-fluid mt-2" style="display: none; max-height: 200px;">
                        </div>
                        <button type="submit" class="btn btn-primary">Thêm</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        $(document).ready(function() {
            $('.nav-link').click(function(e) {
                e.preventDefault();
                $('.nav-link').removeClass('active');
                $(this).addClass('active');

                const section = $(this).data('section');
                loadContent(section);
            });

            function loadContent(section) {
                let content = '';
                switch(section) {
                    case 'dashboard':
                        content = `
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-body text-center">
                                            <h5>Khách hàng</h5>
                                            <h2>0</h2>
                                            <p>Số lượng khách hàng hiện tại.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-body text-center">
                                            <h5>Sản phẩm</h5>
                                            <h2>60</h2>
                                            <p>Số lượng sản phẩm đang hiển thị.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-body text-center">
                                            <h5>Doanh thu</h5>
                                            <h2>0 đ</h2>
                                            <p>Doanh thu hiện tại.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        break;
                    case 'users':
                        content = `
                            <h3>Quản lý user</h3>
                            <button class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#addUserModal">Thêm user</button>
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tên</th>
                                        <th>Email</th>
                                        <th>Trạng thái</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody id="userTableBody">
                                    <!-- Users will be loaded dynamically -->
                                </tbody>
                            </table>`;
                        break;
                    case 'products':
                        content = `
                            <h3>Quản lý sản phẩm</h3>
                            <button class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#addProductModal">Thêm sản phẩm</button>
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Phân loại</th>
                                        <th>Hình ảnh</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody id="productTableBody">
                                    <!-- Products will be loaded dynamically -->
                                </tbody>
                            </table>`;
                        break;
                    case 'orders':
                        content = `
                            <h3>Quản lý đơn hàng</h3>
                            <div class="mb-3">
                                <label>Lọc theo trạng thái:</label>
                                <select class="form-select d-inline-block w-auto">
                                    <option>Chưa xác nhận</option>
                                    <option>Đã xác nhận</option>
                                    <option>Đã giao</option>
                                    <option>Huỷ đơn</option>
                                </select>
                                <label class="ms-3">Từ ngày:</label>
                                <input type="date" class="form-control d-inline-block w-auto">
                                <label class="ms-3">Đến ngày:</label>
                                <input type="date" class="form-control d-inline-block w-auto">
                            </div>
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Khách hàng</th>
                                        <th>Ngày đặt</th>
                                        <th>Trạng thái</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody id="orderTableBody">
                                    <!-- Orders will be loaded dynamically -->
                                </tbody>
                            </table>`;
                        break;
                    case 'statistics':
                        content = `
                            <h3>Thống kê</h3>
                            <div class="mb-3">
                                <label>Từ ngày:</label>
                                <input type="date" class="form-control d-inline-block w-auto">
                                <label class="ms-3">Đến ngày:</label>
                                <input type="date" class="form-control d-inline-block w-auto">
                                <button class="btn btn-primary ms-3">Thống kê</button>
                            </div>
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Khách hàng</th>
                                        <th>Tổng tiền</th>
                                        <th>Đơn hàng</th>
                                    </tr>
                                </thead>
                                <tbody id="statsTableBody">
                                    <!-- Statistics will be loaded dynamically -->
                                </tbody>
                            </table>`;
                        break;
                }
                $('#contentArea').html(content);
            }
        });

        // Image Preview for Add Product Modal
        document.getElementById('productImage').addEventListener('change', function(e) {
            const file = e.target.files[0];
            const preview = document.getElementById('imagePreview');
            if (file) {
                preview.src = URL.createObjectURL(file);
                preview.style.display = 'block';
            }
        });

        // Handle form submission for Add Product Modal (replace with actual backend logic)
        document.getElementById('addProductForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Product added successfully!');
            $('#addProductModal').modal('hide');
        });
    </script>
</body>
</html>