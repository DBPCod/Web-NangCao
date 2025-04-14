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
            <div class="col-md-3">
                <label class="form-label invisible"></label>
                <div class="d-flex justify-content-start">
                    <button class="btn btn-primary">Chọn</button>
                </div>
            </div>

            <div class="col-md-3 ms-auto">
                <div class="d-flex justify-content-end">
                    <select id="sortOrder" class="form-select w-auto">
                        <option value="asc">Tăng dần</option>
                        <option value="desc">Giảm dần</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>STT</th>
                <th>Tên khách hàng</th>
                <th>Tổng tiền</th>
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>Nguyễn Văn A</td>
                <td>10,000,000 đ</td>
                <td>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#orderListModal">
                    Xem
                    </button>
                </td>
            </tr>
            <tr>
                <td>2</td>
                <td>Nguyễn Văn B</td>
                <td>10,000,000 đ</td>
                <td>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#orderListModal">
                    Xem
                    </button>
                </td>
            </tr>
            <tr>
                <td>3</td>
                <td>Nguyễn Văn C</td>
                <td>10,000,000 đ</td>
                <td>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#orderListModal">
                    Xem
                    </button>
                </td>
            </tr>
            <tr>
                <td>4</td>
                <td>Nguyễn Văn D</td>
                <td>10,000,000 đ</td>
                <td>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#orderListModal">
                    Xem
                    </button>
                </td>
            </tr>
            <tr>
                <td>5</td>
                <td>Nguyễn Văn E</td>
                <td>10,000,000 đ</td>
                <td>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#orderListModal">
                    Xem
                    </button>
                </td>
            </tr>

        </tbody>
    </table>

    <!-- Modal Danh sách đơn hàng -->
    <div class="modal fade" id="orderListModal" tabindex="-1" aria-labelledby="orderListModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="orderListModalLabel">Danh sách đơn hàng của khách hàng: Nguyễn Văn A</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
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
            <tbody>
              <tr>
                <td>HD001</td>
                <td>02/03/2025</td>
                <td>5,000,000 VNĐ</td>
                <td>Đã giao</td>
                <td>
                  <!-- Nút mở Modal Chi tiết -->
                  <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#orderDetailModal" data-bs-dismiss="modal">
                    Xem chi tiết
                  </button>
                </td>
              </tr>
              <tr>
                <td>HD002</td>
                <td>02/03/2025</td>
                <td>5,000,000 VNĐ</td>
                <td>Đã giao</td>
                <td>
                  <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#orderDetailModal" data-bs-dismiss="modal">
                    Xem chi tiết
                  </button>
                </td>
              </tr>
              <tr>
                <td>HD003</td>
                <td>02/03/2025</td>
                <td>5,000,000 VNĐ</td>
                <td>Đã giao</td>
                <td>
                  <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#orderDetailModal" data-bs-dismiss="modal">
                    Xem chi tiết
                  </button>
                </td>
              </tr>
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
      <div class="modal-header">
        <h5 class="modal-title" id="orderDetailModalLabel">Chi tiết đơn hàng: HD001</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
      </div>
      <div class="modal-body">

        <p><strong>Ngày đặt:</strong> 02/03/2025</p>
        <p><strong>Trạng thái:</strong> Đã giao</p>
        <p><strong>Phương thức thanh toán:</strong> Chuyển khoản</p>
        <p><strong>Địa chỉ giao hàng:</strong> 123 Trần Hưng Đạo, Q1, TP.HCM</p>

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
            <tbody>
              <tr>
                <td>IP16 ProMax</td>
                <td>2</td>
                <td>25,000,000</td>
                <td>50,000,000</td>
              </tr>
              <tr>
                <td>Samsung Ultra</td>
                <td>1</td>
                <td>10,000,000</td>
                <td>10,000,000</td>
              </tr>
              <tr>
                <td>Vertu</td>
                <td>1</td>
                <td>1,000,000,000</td>
                <td>1,000,000,000</td>
              </tr>
              <tr class="table-warning">
                <td colspan="3" class="text-end"><strong>Tổng cộng:</strong></td>
                <td><strong>10,000,000,000</strong></td>
              </tr>
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