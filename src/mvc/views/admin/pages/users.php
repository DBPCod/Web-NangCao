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
                        <th class="text-start" style="width:21%"> Tên quyền</th>
                        <th style="width:12%"> Xem</th>
                        <th style="width:12%"> Thêm mới</th>
                        <th style="width:12%"> Sửa</th>
                        <th style="width:12%"> Xóa</th>
                    </tr>
                </thead>
                <tbody id="addPermissionsBody" class="text-center">
                
              </tbody>
        </table>

              </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary" id="addRoleBtn" onclick="addRole()">Lưu</button>
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
                        <input type="text" class="form-control form-control-sm w-25" id="tenVaitroEdit" name="tenVaitroEdit">
                    </div>
                    <h5 class="mb-3 mt-3">Bảng phân quyền</h5>
                  <table class="table table-hover table-bordered">
                <thead class="text-center">
                    <tr>
                        <th class="text-start" style="width:21%"> Tên quyền</th>
                        <th style="width:12%"> Xem</th>
                        <th style="width:12%"> Thêm mới</th>
                        <th style="width:12%"> Sửa</th>
                        <th style="width:12%"> Xóa</th>
                    </tr>
                </thead>
                <tbody id="editPermissionsBody" class="text-center">
                
              </tbody>
        </table>
               </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary" id="saveRoleBtn" onclick="editRole()">Lưu</button>
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
                    <input type="hidden" id="idVaitroEdit" name="idVaitroEdit">
                    <h5 class="mb-3 mt-3">Bảng phân quyền</h5>
                  <table class="table table-hover table-bordered">
                <thead class="text-center">
                    <tr>
                        <th class="text-start" style="width:21%"> Tên quyền</th>
                        <th style="width:12%"> Xem</th>
                        <th style="width:12%"> Thêm mới</th>
                        <th style="width:12%"> Sửa</th>
                        <th style="width:12%"> Xóa</th>
                    </tr>
                </thead>
                <tbody id="viewPermissionsBody" class="text-center">
              
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

<script src="/smartstation/src/public/js/admin/role.js"></script>





