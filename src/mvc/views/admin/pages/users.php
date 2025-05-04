<?php include '../includes/header.php'; ?> 
<div class="container-fluid">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h2>Quản lý quản trị</h2>
    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addRoleModal">Thêm vai trò</button>
  </div>
  <table class="table table-hover">
    <thead>
      <tr>
        <th>ID tên quyền</th>
        <th>Tên quyền</th>
        <th class="text-center" style="width: 140px">Hành động</th>
      </tr>
    </thead>
    <tbody id="RolesBody">
      <tr>
        <td>1</td>
        <td>Admin</td>
        <td class="text-center">
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editRoleModal">Sửa</button>
            <button class="btn btn-danger">Xóa</button>
          </td>
      </tr>
    </tbody>
  </table>
</div>

<!--- Model thêm ----->
<div class="modal fade" id="addRoleModal" tabindex="-1" aria-labelledby="addRoleModalLabel" aria-hidden="true">
    <div class="modal-dialog custom-modal">
        <div class="modal-content">
            <div class="modal-header bg-green text-white">
                <h5 class="modal-title" id="addRoleModalLabel">Thêm vai trò</h5>
                <button type="button" class="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="addRoleForm">
                    <div class="mb-3">
                        <label for="tenVaitro" class="form-label">Tên vai trò</label>
                        <input type="text" class="form-control form-control-sm w-25" id="tenVaitro" name="tenVaitro" required>
                    </div>
                    <h5 class="mb-3 mt-3">Bảng phân quyền</h5>
                  <table class="table table-hover table-bordered">
                <thead class="text-center">
                    <tr>
                        <th class="text-start" style="width:21%"><input type="checkbox"> Tên quyền</th>
                        <th style="width:12%"><input type="checkbox"> Xem</th>
                        <th style="width:12%"><input type="checkbox"> Thêm mới</th>
                        <th style="width:12%"><input type="checkbox"> Sửa</th>
                        <th style="width:12%"><input type="checkbox"> Xóa</th>
                    </tr>
                </thead>
                <tbody class="text-center">
                <tr>
                  <td class="text-start"><input type="checkbox"> Dashboards</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Trang tổng quan</td>
                  <td><input type="checkbox"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Khách hàng</td>
                  <td><input type="checkbox"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Danh sách sản phẩm</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Dòng sản phẩm</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Cấu hình sản phẩm</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Thương hiệu</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Khuyến mãi</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Bảo hành</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Danh sách phiếu nhập</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td></td>
                  <td><input type="checkbox"></td>
                
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Nhà cung cấp</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Đơn hàng</td>
                  <td><input type="checkbox"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Thống kê</td>
                  <td><input type="checkbox"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  
                </tr>
              </tbody>
        </table>

              </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary" id="saveRoleBtn">Lưu</button>
            </div>
        </div>
    </div>
</div>

<!-- Model edit -->
<div class="modal fade" id="editRoleModal" tabindex="-1" aria-labelledby="editRoleModalLabel" aria-hidden="true">
    <div class="modal-dialog custom-modal">
        <div class="modal-content">
            <div class="modal-header bg-green">
                <h5 class="modal-title text-white" id="editRoleModalLabel">Chỉnh sửa vai trò</h5>
                <button type="button" class="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
               <form id="editRoleForm">
               <div class="mb-3">
                        <label for="tenVaitroEdit" class="form-label">Tên vai trò</label>
                        <input type="text" class="form-control form-control-sm w-25" id="tenVaitroEdit" name="tenVaitroEdit" value="Admin" readonly>
                    </div>
                    <h5 class="mb-3 mt-3">Bảng phân quyền</h5>
                  <table class="table table-hover table-bordered">
                <thead class="text-center">
                    <tr>
                        <th class="text-start" style="width:21%"><input type="checkbox"> Tên quyền</th>
                        <th style="width:12%"><input type="checkbox"> Xem</th>
                        <th style="width:12%"><input type="checkbox"> Thêm mới</th>
                        <th style="width:12%"><input type="checkbox"> Sửa</th>
                        <th style="width:12%"><input type="checkbox"> Xóa</th>
                    </tr>
                </thead>
                <tbody class="text-center">
                <tr>
                  <td class="text-start"><input type="checkbox"> Dashboards</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Trang tổng quan</td>
                  <td><input type="checkbox"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Khách hàng</td>
                  <td><input type="checkbox"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Danh sách sản phẩm</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Dòng sản phẩm</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Cấu hình sản phẩm</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Thương hiệu</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Khuyến mãi</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Bảo hành</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Danh sách phiếu nhập</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td></td>
                  <td><input type="checkbox"></td>
                
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Nhà cung cấp</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Đơn hàng</td>
                  <td><input type="checkbox"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Thống kê</td>
                  <td><input type="checkbox"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  
                </tr>
              </tbody>
        </table>
               </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary">Lưu</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal chi tiết(chưa xử lý script) -->
<div class="modal fade" id="viewRoleModal" tabindex="-1" aria-labelledby="viewRoleModalLabel" aria-hidden="true">
    <div class="modal-dialog custom-modal">
        <div class="modal-content">
            <div class="modal-header bg-green">
                <h5 class="modal-title text-white" id="viewRoleModalLabel">Chỉ tiết vai trò</h5>
                <button type="button" class="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
               <div class="mb-3">
                        <label for="tenVaitroView" class="form-label">Tên vai trò</label>
                        <input type="text" class="form-control form-control-sm w-25" id="tenVaitroView" name="tenVaitroView" value="Admin" readonly>
                    </div>
                    <h5 class="mb-3 mt-3">Bảng phân quyền</h5>
                  <table class="table table-hover table-bordered">
                <thead class="text-center">
                    <tr>
                        <th class="text-start" style="width:21%"><input type="checkbox"> Tên quyền</th>
                        <th style="width:12%"><input type="checkbox"> Xem</th>
                        <th style="width:12%"><input type="checkbox"> Thêm mới</th>
                        <th style="width:12%"><input type="checkbox"> Sửa</th>
                        <th style="width:12%"><input type="checkbox"> Xóa</th>
                    </tr>
                </thead>
                <tbody class="text-center">
                <tr>
                  <td class="text-start"><input type="checkbox"> Dashboards</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Trang tổng quan</td>
                  <td><input type="checkbox"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Khách hàng</td>
                  <td><input type="checkbox"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Danh sách sản phẩm</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Dòng sản phẩm</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Cấu hình sản phẩm</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Thương hiệu</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Khuyến mãi</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Bảo hành</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Danh sách phiếu nhập</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td></td>
                  <td><input type="checkbox"></td>
                
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Nhà cung cấp</td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                  <td><input type="checkbox"></td>
                
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Đơn hàng</td>
                  <td><input type="checkbox"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  
                </tr>
                <tr>
                  <td class="text-start"><input type="checkbox"> Thống kê</td>
                  <td><input type="checkbox"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  
                </tr>
              </tbody>
        </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            </div>
        </div>
    </div>
</div>

<style>
    .bg-green {
        background-color: #218838;
    }
    .custom-modal {
    max-width: 60%;
    }
</style>





