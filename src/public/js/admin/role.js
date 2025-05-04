var isLoading = false;
var permissions = [];
//-------------------------Thêm-----------------------------
// Hàm lấy dữ liệu quyền từ server
async function loadPermissions() {
    try {
        const response = await fetch('/smartstation/src/mvc/controllers/get_permissions.php', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Lỗi khi lấy quyền: ' + response.status);
        permissions = await response.json();
        console.log('Permissions loaded:', permissions);
    } catch (error) {
        console.error('Lỗi khi lấy quyền:', error);
        toast({
            title: "Lỗi",
            message: "Không thể tải dữ liệu quyền!",
            type: "error",
            duration: 3000,
        });
    }
}

// Hàm kiểm tra quyền
function hasPermission(permissionName, action) {
    return permissions.some(permission => 
        permission.TenQuyen === permissionName && permission[action]
    );
}
//------------------------------------------------
// function loadRoles() {
//     fetch("/smartstation/src/mvc/controllers/VaiTroController.php", {
//         method: "GET",
//     })
//         .then((response) => {
//             if (!response.ok) throw new Error("Network error: " + response.status);
//             return response.json();
//         })
//         .then((roles) => {
//             const tbody = document.getElementById("RolesBody");
//             let rows = '';
//             if (!roles || roles.length === 0) {
//                 rows = '<tr><td colspan="4">Không có vai trò nào</td></tr>';
//             } else {
//                 roles.forEach((role) => {
//                     rows += `
//                         <tr onclick="viewRole(${role.IdVaiTro})" style="cursor: pointer;">
//                             <td>${role.IdVaiTro}</td>
//                             <td>${role.TenVaiTro}</td>
//                             <td class="text-center">
//                                 <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editRoleModal"
//                                     data-id="${role.IdVaiTro}" data-name="${role.TenVaiTro}" onclick="event.stopPropagation()">Sửa</button>
//                                 <button class="btn btn-danger" onclick="event.stopPropagation(); deleteRole(${role.IdVaiTro})">Xóa</button>
//                             </td>
//                         </tr>`;
//                 });
//             }
//             tbody.innerHTML = rows;
//         })
//         .catch((error) => console.error("Fetch error:", error));
// }

//----------------------------------------
async function loadRoles() {
    // Chờ lấy quyền trước khi tải vai trò
    await loadPermissions();

    fetch("/smartstation/src/mvc/controllers/VaiTroController.php", {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((roles) => {
            console.log('Roles received:', roles);
            const tbody = document.getElementById("RolesBody");
            let rows = '';
            if (!roles || roles.length === 0) {
                rows = '<tr><td colspan="4">Không có vai trò nào</td></tr>';
            } else {
                const hasEditPermission = hasPermission('Quản trị', 'sua');
                const hasDeletePermission = hasPermission('Quản trị', 'xoa');
                roles.forEach((role) => {
                    let actionButtons = '';
                    if (hasEditPermission) {
                        actionButtons += `
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editRoleModal"
                                data-id="${role.IdVaiTro}" data-name="${role.TenVaiTro}" onclick="event.stopPropagation()">Sửa</button>
                        `;
                    }
                    if (hasDeletePermission) {
                        actionButtons += `
                            <button class="btn btn-danger" onclick="event.stopPropagation(); deleteRole(${role.IdVaiTro})">Xóa</button>
                        `;
                    }
                    rows += `
                        <tr onclick="viewRole(${role.IdVaiTro})" style="cursor: pointer;">
                            <td>${role.IdVaiTro}</td>
                            <td>${role.TenVaiTro}</td>
                            <td class="text-center">
                                ${actionButtons || 'Không có hành động'}
                            </td>
                        </tr>`;
                });
            }
            tbody.innerHTML = rows;

            // Ẩn nút "Thêm vai trò" nếu không có quyền them
            if (!hasPermission('Quản trị', 'them')) {
                document.querySelector('.btn-success[data-bs-target="#addRoleModal"]').style.display = 'none';
            }
        })
        .catch((error) => console.error("Fetch error:", error));
}
//-----------------

var viewOnlyPermissions = ['Khách hàng', 'Đơn hàng', 'Thống kê'];
var notEditPermissions = ['Danh sách phiếu nhập'];

function loadPermissionTable(tbodyId, idVaiTro = null) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) {
        console.error(`Tbody with ID ${tbodyId} not found!`);
        return;
    }

    fetch("/smartstation/src/mvc/controllers/VaiTroController.php?allQuyen=true", {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) throw new Error('Lỗi khi lấy danh sách quyền: ' + response.status);
            return response.json();
        })
        .then(permissions => {
            const isViewMode = tbodyId === 'viewPermissionsBody';
            let rows = '';
            if (!permissions || permissions.length === 0) {
                console.warn('No permissions found!');
                rows = '<tr><td colspan="5">Không có quyền nào</td></tr>';
            } else {
                permissions.forEach(perm => {
                    const isViewOnly = viewOnlyPermissions.includes(perm.TenQuyen);
                    const isNotEdit = notEditPermissions.includes(perm.TenQuyen);
                    rows += `
                        <tr>
                            <td class="text-start">${perm.TenQuyen}</td>
                            <td><input type="checkbox" name="permissions[${perm.IdQuyen}][xem]" value="1" ${isViewMode ? 'disabled' : ''}></td>
                            <td>${isViewOnly ? '' : `<input type="checkbox" name="permissions[${perm.IdQuyen}][them]" value="1" ${isViewMode ? 'disabled' : ''}>`}</td>
                            <td>${isViewOnly || isNotEdit ? '' : `<input type="checkbox" name="permissions[${perm.IdQuyen}][sua]" value="1" ${isViewMode ? 'disabled' : ''}>`}</td>
                            <td>${isViewOnly ? '' : `<input type="checkbox" name="permissions[${perm.IdQuyen}][xoa]" value="1" ${isViewMode ? 'disabled' : ''}>`}</td>
                        </tr>
                    `;
                });
            }
            tbody.innerHTML = rows;

            if (idVaiTro) {
                fetch(`/smartstation/src/mvc/controllers/VaiTroController.php?permissions=true&idVaiTro=${idVaiTro}`, {
                    method: 'GET'
                })
                    .then(response => {
                        if (!response.ok) throw new Error('Lỗi khi lấy quyền của vai trò: ' + response.status);
                        return response.json();
                    })
                    .then(rolePermissions => {
                        rolePermissions.forEach(perm => {
                            const xemCheckbox = document.querySelector(`#${tbodyId} input[name="permissions[${perm.IdQuyen}][xem]"]`);
                            const themCheckbox = document.querySelector(`#${tbodyId} input[name="permissions[${perm.IdQuyen}][them]"]`);
                            const suaCheckbox = document.querySelector(`#${tbodyId} input[name="permissions[${perm.IdQuyen}][sua]"]`);
                            const xoaCheckbox = document.querySelector(`#${tbodyId} input[name="permissions[${perm.IdQuyen}][xoa]"]`);

                            if (xemCheckbox) xemCheckbox.checked = perm.xem == 1;
                            if (themCheckbox) themCheckbox.checked = perm.them == 1;
                            if (suaCheckbox) suaCheckbox.checked = perm.sua == 1;
                            if (xoaCheckbox) xoaCheckbox.checked = perm.xoa == 1;
                        });
                    })
                    .catch(error => {
                        console.error('Lỗi khi lấy quyền của vai trò:', error);
                    });
            }
        })
        .catch(error => {
            console.error('Lỗi khi lấy danh sách quyền:', error);
            toast({
                title: "Lỗi",
                message: "Không thể tải danh sách quyền!",
                type: "error",
                duration: 3000,
            });
        });
}

function viewRole(idVaiTro) {
    if (isLoading) return;
    isLoading = true;
    fetch(`/smartstation/src/mvc/controllers/VaiTroController.php?idVaiTro=${idVaiTro}`, {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) throw new Error('Lỗi khi lấy thông tin vai trò');
            return response.json();
        })
        .then(role => {
            document.getElementById('tenVaitroView').value = role.TenVaiTro;
            loadPermissionTable('viewPermissionsBody', idVaiTro);
            const modal = new bootstrap.Modal(document.getElementById("viewRoleModal"));
            modal.show();
        })
        .catch(error => {
            console.error('Lỗi khi xem vai trò:', error);
            toast({
                title: "Lỗi",
                message: "Không thể tải thông tin vai trò!",
                type: "error",
                duration: 3000,
            });
        })
        .finally(() => {
            isLoading = false;
        });
}

function addRole() {
  const tenVaiTro = document.getElementById('tenVaitro').value;
  const permissions = [];
  document.querySelectorAll('#addPermissionsBody tr').forEach(row => {
      const idQuyen = row.querySelector('input[name^=permissions]').name.match(/\d+/)[0];
      const isViewOnly = viewOnlyPermissions.includes(row.cells[0].textContent);
      const isNotEdit = notEditPermissions.includes(row.cells[0].textContent);
      permissions.push({
          idQuyen: idQuyen,
          tenQuyen: row.cells[0].textContent,
          xem: row.querySelector(`input[name="permissions[${idQuyen}][xem]"]`).checked ? 1 : 0,
          them: isViewOnly ? 0 : (row.querySelector(`input[name="permissions[${idQuyen}][them]"]`)?.checked ? 1 : 0),
          sua: isViewOnly || isNotEdit ? 0 : (row.querySelector(`input[name="permissions[${idQuyen}][sua]"]`)?.checked ? 1 : 0),
          xoa: isViewOnly ? 0 : (row.querySelector(`input[name="permissions[${idQuyen}][xoa]"]`)?.checked ? 1 : 0)
      });
  });

  fetch('/smartstation/src/mvc/controllers/VaiTroController.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify({
          TenVaiTro: tenVaiTro,
          TrangThai: 1,
          permissions: permissions
      })
  })
      .then(response => {
          if (!response.ok) throw new Error('Lỗi khi thêm vai trò');
          return response.json();
      })
      .then(result => {
        if (result.message === "Tên vai trò không hợp lệ"){
            toast({
                title: "Cảnh báo",
                message: "Nhập tên vai trò",
                type: "warning",
                duration: 3000,
            });
          }
          else if (result.message === "Tên vai trò đã tồn tại") {
            toast({
                title: "Lỗi",
                message: "Tên vai trò đã tồn tại",
                type: "error",
                duration: 3000,
                });
            }
            else if (result.message === "Vui lòng chọn ít nhất một quyền"){
                toast({
                    title: "Cảnh báo",
                    message: "Vui lòng chọn ít nhất một quyền",
                    type: "warning",
                    duration: 3000,
              });
                }
          
          else if (result.message === "Thêm vai trò thành công"){
            toast({
                title: "Thành công",
                message: "Thêm vai trò thành công",
                type: "success",
                duration: 3000,
          });
            }
          if (result.vaitro) {
              bootstrap.Modal.getInstance(document.getElementById('addRoleModal')).hide();
              document.getElementById('addRoleForm').reset();
              loadRoles();
          }
      })
      .catch(error => {
          console.error('Lỗi khi thêm vai trò:', error);
          toast({
            title: "Lỗi",
            message: "Lỗi không thể thêm vai trò",
            type: "error",
            duration: 3000,
      });
      });
}

function editRole() {
    if (isLoading) return;
    isLoading = true;

    const idVaiTro = document.getElementById('idVaitroEdit').value;
    const tenVaiTro = document.getElementById('tenVaitroEdit').value;
    const permissions = [];
    document.querySelectorAll('#editPermissionsBody tr').forEach(row => {
        const idQuyen = row.querySelector('input[name^=permissions]').name.match(/\d+/)[0];
        const isViewOnly = viewOnlyPermissions.includes(row.cells[0].textContent);
        const isNotEdit = notEditPermissions.includes(row.cells[0].textContent);
        permissions.push({
            idQuyen: idQuyen,
            tenQuyen: row.cells[0].textContent,
            xem: row.querySelector(`input[name="permissions[${idQuyen}][xem]"]`).checked ? 1 : 0,
            them: isViewOnly ? 0 : (row.querySelector(`input[name="permissions[${idQuyen}][them]"]`)?.checked ? 1 : 0),
            sua: isViewOnly || isNotEdit ? 0 : (row.querySelector(`input[name="permissions[${idQuyen}][sua]"]`)?.checked ? 1 : 0),
            xoa: isViewOnly ? 0 : (row.querySelector(`input[name="permissions[${idQuyen}][xoa]"]`)?.checked ? 1 : 0)
        });
    });

    fetch(`/smartstation/src/mvc/controllers/VaiTroController.php?idVaiTro=${idVaiTro}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            TenVaiTro: tenVaiTro,
            TrangThai: 1,
            permissions: permissions
        })
    })
        .then(response => {
            if (!response.ok) throw new Error('Lỗi khi sửa vai trò');
            return response.json();
        })
        .then(result => {
          if(result.message === "Tên vai trò đã tồn tại"){
            toast({
                title: "Lỗi",
                message: "Tên vai trò đã tồn tại",
                type: "error",
                duration: 3000,
          });
          }else if(result.message === "Tên vai trò không hợp lệ"){
            toast({
                title: "Cảnh báo",
                message: "Nhập tên vai trò",
                type: "warning",
                duration: 3000,
            });
          }
          else if (result.message === "Cập nhật vai trò thành công"){
            toast({
                title: "Thành công",
                message: "Cập nhật vai trò thành công",
                type: "success",
                duration: 3000,
          });
          }
          if (result.message.includes('thành công')) {
              bootstrap.Modal.getInstance(document.getElementById('editRoleModal')).hide();
              loadRoles();
          }
      })
      .catch(error => {
          console.error('Lỗi khi sửa vai trò:', error);
          toast({
            title: "Lỗi",
            message: "Không thể sửa vai trò",
            type: "error",
            duration: 3000,
      });
      })
      .finally(() => {
          isLoading = false;
      });
}

function deleteRole(idVaiTro) {
    if (!confirm('Bạn có chắc chắn muốn xóa vai trò này?')) return;

    fetch(`/smartstation/src/mvc/controllers/VaiTroController.php?idVaiTro=${idVaiTro}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) throw new Error('Lỗi khi xóa vai trò');
            return response.json();
        })
        .then(result => {
            toast({
                title: "Thành công",
                message: "Xóa vai trò thành công",
                type: "success",
                duration: 3000,
            });
            if (result.message.includes('thành công')) {
                loadRoles();
            }
        })
        .catch(error => {
            console.error('Lỗi khi xóa vai trò:', error);
            toast({
                title: "Lỗi",
                message: "Không thể xóa vai trò",
                type: "error",
                duration: 3000,
            });
        });
}

document.addEventListener('show.bs.modal', function (event) {
    const targetId = event.target.id;

    if (targetId === 'addRoleModal') {
        loadPermissionTable('addPermissionsBody', null);
    }

    if (targetId === 'editRoleModal') {
        const button = event.relatedTarget;
        const idVaiTro = button.getAttribute('data-id');
        const tenVaiTro = button.getAttribute('data-name');

        document.getElementById('tenVaitroEdit').value = tenVaiTro;
        document.getElementById('idVaitroEdit').value = idVaiTro;

        loadPermissionTable('editPermissionsBody', idVaiTro);
    }
});



loadRoles();