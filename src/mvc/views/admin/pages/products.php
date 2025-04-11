<?php include '../includes/header.php'; ?>
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Quản lý sản phẩm</h2>
        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addProductModal">Thêm sản phẩm</button>
    </div>
    <table class="table">
        <thead>
            <tr>
                <th>Tên dòng sản phẩm</th>
                <th>RAM</th>
                <th>ROM</th>
                <th>Màu sắc</th>
                <th>Giá</th>
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody id="productTableBody"></tbody>
    </table>
</div>

<!-- Modal Thêm Sản phẩm -->
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
                        <label for="idDongSanPham" class="form-label">Dòng sản phẩm</label>
                        <select class="form-control" id="idDongSanPham" required>
                            <option value="">Chọn dòng sản phẩm</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="idCHSP" class="form-label">Cấu hình sản phẩm</label>
                        <select class="form-control" id="idCHSP" required>
                            <option value="">Chọn cấu hình</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Thông tin cấu hình</label>
                        <p><strong>RAM:</strong> <span id="addRam"></span></p>
                        <p><strong>ROM:</strong> <span id="addRom"></span></p>
                        <p><strong>Màn hình:</strong> <span id="addManHinh"></span></p>
                        <p><strong>Pin:</strong> <span id="addPin"></span></p>
                        <p><strong>Màu sắc:</strong> <span id="addMauSac"></span></p>
                        <p><strong>Camera:</strong> <span id="addCamera"></span></p>
                    </div>
                    <div class="mb-3">
                        <label for="soLuong" class="form-label">Số lượng</label>
                        <input type="number" class="form-control" id="soLuong" min="0" value="0" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary" onclick="submitAddProduct()">Lưu</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal Chi tiết Sản phẩm -->
<div class="modal fade" id="productDetailModal" tabindex="-1" aria-labelledby="productDetailModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="productDetailModalLabel">Chi tiết sản phẩm</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6">
                        <h6>Ảnh sản phẩm</h6>
                        <div id="productImageCarousel" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-inner" id="productImages"></div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#productImageCarousel" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#productImageCarousel" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h6>Thông tin chi tiết</h6>
                        <p><strong>Tên dòng:</strong> <span id="detailTenDong"></span></p>
                        <p><strong>Số lượng:</strong> <span id="detailSoLuong"></span></p>
                        <p><strong>Giá:</strong> <span id="detailGia"></span></p>
                        <p><strong>Thương hiệu:</strong> <span id="detailThuongHieu"></span></p>
                        <p><strong>RAM:</strong> <span id="detailRam"></span></p>
                        <p><strong>ROM:</strong> <span id="detailRom"></span></p>
                        <p><strong>Màn hình:</strong> <span id="detailManHinh"></span></p>
                        <p><strong>Pin:</strong> <span id="detailPin"></span></p>
                        <p><strong>Màu sắc:</strong> <span id="detailMauSac"></span></p>
                        <p><strong>Camera:</strong> <span id="detailCamera"></span></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            </div>
        </div>
    </div>
</div>

<style>
    /* Tùy chỉnh màu nút điều hướng carousel thành màu xám đậm */
    .carousel-control-prev-icon,
    .carousel-control-next-icon {
        background-image: none; /* Xóa hình nền mặc định */
        width: 30px;
        height: 30px;
        position: relative;
    }

    .carousel-control-prev-icon::before,
    .carousel-control-next-icon::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: solid #555555; /* Màu xám đậm */
        border-width: 0 3px 3px 0;
        display: inline-block;
        padding: 5px;
    }

    .carousel-control-prev-icon::before {
        transform: translate(-50%, -50%) rotate(135deg); /* Mũi tên trái */
    }

    .carousel-control-next-icon::before {
        transform: translate(-50%, -50%) rotate(-45deg); /* Mũi tên phải */
    }

    .carousel-control-prev:hover .carousel-control-prev-icon::before,
    .carousel-control-next:hover .carousel-control-next-icon::before {
        border-color: #333333; /* Màu gần đen khi hover */
    }
</style>

<script src="/smartstation/src/public/js/admin/products.js"></script>