// Số lượng người dùng mỗi trang
var USERS_PER_PAGE = 8;
var currentPage = 1;
var allUsers = []; // Lưu trữ toàn bộ dữ liệu người dùng

// Hàm để lấy và render danh sách người dùng
function fetchAndRenderUsers() {
    fetch("/smartstation/src/mvc/controllers/NguoiDungController.php", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            allUsers = data; // Lưu dữ liệu vào biến toàn cục
            renderUsersByPage(currentPage); // Render trang đầu tiên
            renderPagination(); // Render nút phân trang
        })
        .catch((error) => {
            console.error("Error fetching users:", error);
            document.querySelector("tbody").innerHTML =
                '<tr><td colspan="8" class="text-center">Đã xảy ra lỗi khi tải dữ liệu.</td></tr>';
        });
}

// Hàm để render dữ liệu người dùng theo trang
function renderUsersByPage(page) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    if (allUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">Không có khách hàng nào.</td></tr>';
        return;
    }

    // Tính toán chỉ số bắt đầu và kết thúc của dữ liệu trên trang hiện tại
    const startIndex = (page - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    const usersToDisplay = allUsers.slice(startIndex, endIndex);

    const userPromises = usersToDisplay.map((user) => {
        // Lấy thông tin tài khoản
        const accountPromise = fetch(`/smartstation/src/mvc/controllers/TaiKhoanController.php?idNguoiDung=${user.IdNguoiDung}`)
            .then((response) => response.json())
            .catch(() => ({ TaiKhoan: "Lỗi khi lấy tài khoản" }));
        
        // Kết hợp promise
        return accountPromise.then(accountData => {
            // Nếu có IdVaiTro trong tài khoản, lấy thông tin vai trò
            if (accountData.IdVaiTro) {
                return fetch(`/smartstation/src/mvc/controllers/VaiTroController.php?idVaiTro=${accountData.IdVaiTro}`)
                    .then(response => response.json())
                    .then(vaiTroData => {
                        return {
                            ...user,
                            TaiKhoan: accountData.TaiKhoan || "Chưa có",
                            VaiTro: vaiTroData.TenVaiTro || "Chưa có vai trò"
                        };
                    })
                    .catch(() => {
                        return {
                            ...user,
                            TaiKhoan: accountData.TaiKhoan || "Chưa có",
                            VaiTro: "Không xác định"
                        };
                    });
            } else {
                return {
                    ...user,
                    TaiKhoan: accountData.TaiKhoan || "Chưa có",
                    VaiTro: "Chưa có vai trò"
                };
            }
        });
    });

    
    Promise.all(userPromises).then((usersWithData) => {
        console.log(usersWithData);
        usersWithData.forEach((user) => {
            const tr = document.createElement("tr");
            const buttonText = user.TrangThai == 1 ? "Khóa" : "Mở khóa";
            const buttonClass = user.TrangThai == 1 ? "btn-danger" : "btn-success";
            tr.innerHTML = `
                <td>${user.IdNguoiDung}</td>
                <td>${user.HoVaTen}</td>
                <td>${user.Email}</td>
                <td>${user.DiaChi || "Chưa có"}</td>
                <td>${user.SoDienThoai || "Chưa có"}</td>
                <td class="status">${user.TrangThai == 1 ? "Đang hoạt động" : "Ngừng hoạt động"}</td>
                <td>${user.TaiKhoan}</td>
                <td>${user.VaiTro}</td>
                <td>
                    <button class="btn ${buttonClass} btn-toggle-lock" data-id="${user.IdNguoiDung}" data-status="${user.TrangThai}">
                        ${buttonText}
                    </button>
                    <button class="btn btn-primary btn-edit-role" data-id="${user.IdNguoiDung}" data-account="${user.TaiKhoan}">
                        Sửa vai trò
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Gắn sự kiện sau khi render
        attachEventListeners();
    });
}

// Hàm để render nút phân trang
function renderPagination() {
    const totalPages = Math.ceil(allUsers.length / USERS_PER_PAGE);
    const paginationContainer = document.querySelector("#pagination");
    paginationContainer.innerHTML = "";

    // Helper để thêm nút
    const addPage = (text, page, isActive = false, isDisabled = false) => {
        const btn = document.createElement("button");
        btn.innerText = text;
        btn.className = `btn mx-1 ${isActive ? 'btn-primary' : 'btn-secondary'}`;
        
        if (isDisabled) {
            btn.disabled = true;
        } else {
            btn.addEventListener("click", () => {
                currentPage = page;
                renderUsersByPage(currentPage);
                renderPagination();
            });
        }
        paginationContainer.appendChild(btn);
    };

    // Nút "Prev" - chỉ giữ lại «
    addPage("«", currentPage - 1, false, currentPage === 1);

    // Luôn hiển thị trang đầu tiên
    addPage("1", 1, currentPage === 1);

    // Dấu ... nếu cần
    if (currentPage > 4) {
        const dots = document.createElement("span");
        dots.innerText = "...";
        dots.className = "mx-1";
        paginationContainer.appendChild(dots);
    }

    // Các trang gần currentPage
    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
        addPage(i.toString(), i, currentPage === i);
    }

    // Dấu ... nếu cần
    if (currentPage < totalPages - 3) {
        const dots = document.createElement("span");
        dots.innerText = "...";
        dots.className = "mx-1";
        paginationContainer.appendChild(dots);
    }

    // Luôn hiển thị trang cuối cùng nếu có nhiều hơn 1 trang
    if (totalPages > 1) {
        addPage(totalPages.toString(), totalPages, currentPage === totalPages);
    }

    // Nút "Next" - chỉ giữ lại »
    addPage("»", currentPage + 1, false, currentPage === totalPages);
}

// Hàm gắn sự kiện cho các nút
function attachEventListeners() {
    // Sự kiện cho nút khóa/mở khóa
    document.querySelectorAll(".btn-toggle-lock").forEach((button) => {
        button.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            const currentStatus = parseInt(this.getAttribute("data-status"));
            const newStatus = currentStatus === 1 ? 0 : 1;
            const action = newStatus === 0 ? "khóa" : "mở khóa";

            if (confirm(`Bạn có chắc muốn ${action} khách hàng này?`)) {
                toggleUserLock(id, newStatus, this);
            }
        });
    });

    // Sự kiện cho nút sửa vai trò
    document.querySelectorAll(".btn-edit-role").forEach((button) => {
        button.addEventListener("click", function() {
            const userId = this.getAttribute("data-id");
            const accountName = this.getAttribute("data-account");
            openEditRoleModal(userId, accountName);
        });
    });
}

// Hàm thay đổi trạng thái khóa/mở khóa
function toggleUserLock(id, newStatus, button) {
    fetch(`/smartstation/src/mvc/controllers/NguoiDungController.php?idNguoiDung=${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            TrangThai: newStatus,
        }),
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                // Cập nhật giao diện ngay lập tức
                button.textContent = newStatus === 1 ? "Khóa" : "Mở khóa";
                button.classList.remove(newStatus === 1 ? "btn-success" : "btn-danger");
                button.classList.add(newStatus === 1 ? "btn-danger" : "btn-success");
                button.setAttribute("data-status", newStatus);

                // Cập nhật cột Trạng thái
                const statusCell = button.closest("tr").querySelector(".status");
                statusCell.textContent = newStatus === 1 ? "Đang hoạt động" : "Ngừng hoạt động";

                // Cập nhật dữ liệu trong allUsers
                const userIndex = allUsers.findIndex((user) => user.IdNguoiDung == id);
                if (userIndex !== -1) {
                    allUsers[userIndex].TrangThai = newStatus;
                }

                alert(data.message);
            } else {
                alert("Thay đổi trạng thái thất bại: " + data.message);
            }
        })
        .catch((error) => {
            console.error("Error toggling user lock:", error);
            alert("Đã xảy ra lỗi khi thay đổi trạng thái.");
        });
}

// Gọi hàm để tải danh sách người dùng khi trang được tải
fetchAndRenderUsers();

// Hàm mở modal chỉnh sửa vai trò
function openEditRoleModal(userId, accountName) {
    // Lấy danh sách vai trò
    fetch("/smartstation/src/mvc/controllers/VaiTroController.php", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.json())
    .then(roles => {
        // Lấy thông tin tài khoản hiện tại để biết vai trò hiện tại
        fetch(`/smartstation/src/mvc/controllers/TaiKhoanController.php?idNguoiDung=${userId}`)
        .then(response => response.json())
        .then(accountData => {
            const roleSelect = document.getElementById("roleSelect");
            roleSelect.innerHTML = "";
            
            // Thêm các option cho select
            roles.forEach(role => {
                const option = document.createElement("option");
                option.value = role.IdVaiTro;
                option.textContent = role.TenVaiTro;
                
                // Nếu là vai trò hiện tại thì chọn sẵn
                if (accountData.IdVaiTro == role.IdVaiTro) {
                    option.selected = true;
                }
                
                roleSelect.appendChild(option);
            });
            
            // Lưu userId vào nút lưu để sử dụng khi lưu
            document.getElementById("saveRoleBtn").setAttribute("data-user-id", userId);
            document.getElementById("saveRoleBtn").setAttribute("data-account", accountName);
            
            // Hiển thị modal
            const modal = document.getElementById("editRoleModal");
            modal.style.display = "flex";
            
            // Gắn lại sự kiện cho các nút
            setupModalButtons();
        });
    })
    .catch(error => {
        console.error("Error loading roles:", error);
        alert("Đã xảy ra lỗi khi tải danh sách vai trò.");
    });
}

// Hàm đóng modal
function closeEditRoleModal() {
    const modal = document.getElementById("editRoleModal");
    modal.style.display = "none";
}

// Hàm lưu vai trò mới
function saveRole() {
    const roleSelect = document.getElementById("roleSelect");
    const newRoleId = roleSelect.value;
    const userId = document.getElementById("saveRoleBtn").getAttribute("data-user-id");
    const accountName = document.getElementById("saveRoleBtn").getAttribute("data-account");
    console.log("Saving role:", newRoleId, "for account:", accountName);
    
    // Gọi API để cập nhật vai trò
    fetch(`/smartstation/src/mvc/controllers/TaiKhoanController.php?taikhoan=${accountName}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            IdVaiTro: newRoleId
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Cập nhật vai trò thành công!");
            closeEditRoleModal();
            // Tải lại danh sách người dùng để cập nhật giao diện
            fetchAndRenderUsers();
        } else {
            alert("Cập nhật vai trò thất bại: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error updating role:", error);
        alert("Đã xảy ra lỗi khi cập nhật vai trò.");
    });
}

// Gắn sự kiện cho các nút trong modal
document.addEventListener("DOMContentLoaded", function() {
    // Nút đóng modal
    document.getElementById("closeModalBtn").addEventListener("click", closeEditRoleModal);
    
    // Nút lưu vai trò - gắn sự kiện trực tiếp
    document.getElementById("saveRoleBtn").addEventListener("click", saveRole);
    
    // Gọi hàm để tải danh sách người dùng khi trang được tải
    fetchAndRenderUsers();
});

// Thêm một cách gắn sự kiện khác để đảm bảo nút lưu hoạt động
function setupModalButtons() {
    // Gắn sự kiện cho nút lưu vai trò
    const saveRoleBtn = document.getElementById("saveRoleBtn");
    if (saveRoleBtn) {
        // Xóa tất cả event listeners cũ
        const newSaveBtn = saveRoleBtn.cloneNode(true);
        saveRoleBtn.parentNode.replaceChild(newSaveBtn, saveRoleBtn);
        
        // Thêm event listener mới
        newSaveBtn.addEventListener("click", function() {
            console.log("Save button clicked");
            saveRole();
        });
    }
    
    // Gắn sự kiện cho nút đóng modal
    const closeModalBtn = document.getElementById("closeModalBtn");
    if (closeModalBtn) {
        // Xóa tất cả event listeners cũ
        const newCloseBtn = closeModalBtn.cloneNode(true);
        closeModalBtn.parentNode.replaceChild(newCloseBtn, closeModalBtn);
        
        // Thêm event listener mới
        newCloseBtn.addEventListener("click", function() {
            closeEditRoleModal();
        });
    }
}
