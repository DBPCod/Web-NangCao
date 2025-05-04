<?php include '../includes/header.php'; ?>
<div class="container-fluid">
  <div class="mb-3">
    <h2>Thống kê</h2>
    <div class="row align-items-end">
      <div class="col-md-3">
        <label for="fromDate" class="form-label">Từ ngày:</label>
        <input type="date" id="fromDate" class="form-control">
      </div>
      <div class="col-md-3">
        <label for="toDate" class="form-label">Đến ngày:</label>
        <input type="date" id="toDate" class="form-control">
      </div>
      <div class="col-md-4">
        <label class="form-label invisible">Lọc</label>
        <div class="d-flex gap-2">
          <button class="btn btn-primary" onclick="filterTopUsers()">Chọn</button>
          <button class="btn btn-secondary" onclick="resetTopUsers()">Bỏ lọc</button>
        </div>
      </div>
      <div class="col-md-2 ms-auto">
        <div class="d-flex justify-content-end">
          <select id="sortOrder" class="form-select w-auto" onchange="sortOrder()">
            <option value="desc">Tăng dần</option>
            <option value="asc">Giảm dần</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <table class="table table-hover">
    <thead>
      <tr>
        <th>STT</th>
        <th>Tên khách hàng</th>
        <th>Số điện thoại</th>
        <th>Tổng tiền</th>
        <th>Hành động</th>
      </tr>
    </thead>
    <tbody id="topCustomersBody">
      <!----------------Render-------->
    </tbody>
  </table>

  <!-- Modal Danh sách đơn hàng -->
  <div class="modal fade" id="orderListModal" tabindex="-1" aria-labelledby="orderListModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header bg-green text-white">
          <h5 class="modal-title" id="orderListModalLabel">Danh sách đơn hàng của khách hàng:</h5>
          <button type="button" class="btn-close bg-light" data-bs-dismiss="modal" aria-label="Đóng"></button>
        </div>
        <div class="modal-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="table-dark">
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Xem chi tiết</th>
                </tr>
              </thead>
              <tbody id="orderListBody">
                <!----------------Render-------->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 🔹 Modal 2: Chi tiết đơn hàng -->
  <div class="modal fade" id="orderDetailModal" tabindex="-1" aria-labelledby="orderDetailModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header bg-green text-white">
          <h5 class="modal-title" id="orderDetailModalLabel">Chi tiết đơn hàng:</h5>
          <button type="button" class="btn-close bg-light" data-bs-dismiss="modal" aria-label="Đóng"></button>
        </div>
        <div class="modal-body">

          <p id="orderDate"><strong>Ngày đặt:</strong></p>
          <p id="orderStatus"><strong>Trạng thái:</strong></p>
          <p id="orderPayment"><strong>Phương thức thanh toán:</strong> Chuyển khoản</p>
          <p id="adress"><strong>Địa chỉ giao hàng:</strong> 123 Trần Hưng Đạo, Q1, TP.HCM</p>

          <div class="table-responsive mt-3">
            <table class="table">
              <thead class="table-secondary">
                <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody id="orderDetailBody">
                <!----------------Render-------->
              </tbody>
            </table>
          </div>

        </div>
        <div class="modal-footer">
          <!-- Nút quay lại danh sách -->
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#orderListModal">
            Quay lại danh sách
          </button>
        </div>
      </div>
    </div>


  </div>
  <style>
    .modal-header {
      border-bottom: none;
      background-color: #218838;
    }
  </style>
  <script src="/smartstation/src/public/js/admin/statistics.js"></script>