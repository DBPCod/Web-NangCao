// Số lượng bảo hành mỗi trang
var WARRANTIES_PER_PAGE = 8;
var currentPage = 1;
var allWarranties = []; // Lưu trữ toàn bộ dữ liệu bảo hành
var permissions = [];

// Hàm lấy dữ liệu quyền từ API
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

// Hàm tải danh sách bảo hành
async function loadWarranties() {

    await loadPermissions();

    fetch("/smartstation/src/mvc/controllers/BaohanhController.php", {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((warranties) => {
            allWarranties = warranties; // Lưu dữ liệu vào biến toàn cục
            renderWarrantiesByPage(currentPage); // Render trang đầu tiên
            renderPagination(); // Render nút phân trang
            if (!hasPermission('Bảo hành', 'them')) {
                document.querySelector('.btn-success[data-bs-target="#addWarrantyModal"]').style.display = 'none';
            }
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            document.getElementById("warrantyTableBody").innerHTML =
                '<tr><td colspan="4">Đã xảy ra lỗi khi tải dữ liệu.</td></tr>';
            toast({
                title: "Lỗi",
                message: "Không thể tải danh sách bảo hành",
                type: "error",
                duration: 3000,
            });
        });
}

// Render danh sách bảo hành theo trang
function renderWarrantiesByPage(page) {
    const tbody = document.getElementById("warrantyTableBody");
    rows = "";

    if (!allWarranties || allWarranties.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">Không có bảo hành nào</td></tr>';
        return;
    }

    // Tính toán chỉ số bắt đầu và kết thúc của dữ liệu trên trang hiện tại
    const startIndex = (page - 1) * WARRANTIES_PER_PAGE;
    const endIndex = startIndex + WARRANTIES_PER_PAGE;
    const warrantiesToDisplay = allWarranties.slice(startIndex, endIndex);

    const hasEditPermission = hasPermission('Bảo hành', 'sua');
    const hasDeletePermission = hasPermission('Bảo hành', 'xoa');


    warrantiesToDisplay.forEach((warranty) => {
        let actionButtons = '';
        if (hasEditPermission) {
            actionButtons += `
                <button class="btn btn-primary" onclick="editWarranty('${warranty.IdBaoHanh}')">Sửa</button>
            `;
        }
        if (hasDeletePermission) {
            actionButtons += `
                <button class="btn btn-danger" onclick="deleteWarranty('${warranty.IdBaoHanh}')">Xóa</button>
            `;
        }
        rows += `
            <tr>
                <td>${warranty.IdBaoHanh}</td>
                <td>${warranty.ThoiGianBaoHanh}</td>
                <td>${warranty.TrangThai == 1 ? "Hoạt động" : "Ngừng hoạt động"}</td>
                <td class="text-center">
                    ${actionButtons || 'Không có quyền'}
                </td>
            </tr>`;
    });
    tbody.innerHTML = rows;
}

// Render nút phân trang
function renderPagination() {
    const totalPages = Math.ceil(allWarranties.length / WARRANTIES_PER_PAGE);
    const paginationContainer = document.querySelector("#pagination");
    paginationContainer.innerHTML = "";

    // Nút Previous - thay thành «
    const prevButton = document.createElement("button");
    prevButton.className = "btn btn-secondary mx-1";
    prevButton.textContent = "«";
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderWarrantiesByPage(currentPage);
            renderPagination();
        }
    });
    paginationContainer.appendChild(prevButton);

    // Nút số trang
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.className = `btn mx-1 ${i === currentPage ? "btn-primary" : "btn-secondary"}`;
        pageButton.textContent = i;
        pageButton.addEventListener("click", () => {
            currentPage = i;
            renderWarrantiesByPage(currentPage);
            renderPagination();
        });
        paginationContainer.appendChild(pageButton);
    }

    // Nút Next - thay thành »
    const nextButton = document.createElement("button");
    nextButton.className = "btn btn-secondary mx-1";
    nextButton.textContent = "»";
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderWarrantiesByPage(currentPage);
            renderPagination();
        }
    });
    paginationContainer.appendChild(nextButton);
}

function addWarranty() {
    const form = document.getElementById("addWarrantyForm");
    const thoiGianBaoHanh = form.querySelector("#thoiGianBaoHanh").value;

    if (!thoiGianBaoHanh || isNaN(thoiGianBaoHanh) || thoiGianBaoHanh <= 0) {
        toast({
            title: "Lỗi",
            message: "Thời gian bảo hành phải là một số dương hợp lệ.",
            type: "error",
            duration: 3000,
        });
        return;
    }

    fetch("/smartstation/src/mvc/controllers/BaohanhController.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ThoiGianBaoHanh: parseInt(thoiGianBaoHanh),
            TrangThai: 1,
        }),
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((data) => {
            toast({
                title: "Thành công",
                message: data.message,
                type: "success",
                duration: 3000,
            });
            loadWarranties();
            bootstrap.Modal.getInstance(document.getElementById("addWarrantyModal")).hide();
            form.reset();
        })
        .catch((error) => {
            console.error("Error:", error);
            toast({
                title: "Lỗi",
                message: "Thêm bảo hành thất bại.",
                type: "error",
                duration: 3000,
            });
        });
}

// Hàm sửa bảo hành (hiển thị modal)
function editWarranty(idBaoHanh) {
    fetch(`/smartstation/src/mvc/controllers/BaohanhController.php?idBaoHanh=${idBaoHanh}`, {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((warranty) => {
            // Điền dữ liệu hiện tại vào form
            document.getElementById("editIdBaoHanh").value = warranty.IdBaoHanh;
            document.getElementById("editThoiGianBaoHanh").value = warranty.ThoiGianBaoHanh;

            // Hiển thị modal
            const modal = new bootstrap.Modal(document.getElementById("editWarrantyModal"));
            modal.show();
        })
        .catch((error) => {
            console.error("Error:", error);
            toast({
                title: "Lỗi",
                message: "Không thể tải thông tin bảo hành.",
                type: "error",
                duration: 3000,
            });
        });
}

// Hàm cập nhật bảo hành
function updateWarranty() {
    const form = document.getElementById("editWarrantyForm");
    const idBaoHanh = form.querySelector("#editIdBaoHanh").value;
    const thoiGianBaoHanh = form.querySelector("#editThoiGianBaoHanh").value;

    if (!thoiGianBaoHanh || isNaN(thoiGianBaoHanh) || thoiGianBaoHanh <= 0) {
        toast({
            title: "Lỗi",
            message: "Thời gian bảo hành phải là một số dương hợp lệ.",
            type: "error",
            duration: 3000,
        });
        return;
    }

    // Lấy TrangThai hiện tại để giữ nguyên
    fetch(`/smartstation/src/mvc/controllers/BaohanhController.php?idBaoHanh=${idBaoHanh}`, {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((warranty) => {
            fetch(`/smartstation/src/mvc/controllers/BaohanhController.php?idBaoHanh=${idBaoHanh}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    IdBaoHanh: parseInt(idBaoHanh),
                    ThoiGianBaoHanh: parseInt(thoiGianBaoHanh),
                    TrangThai: parseInt(warranty.TrangThai), // Giữ nguyên TrangThai
                }),
            })
                .then((response) => {
                    if (!response.ok) throw new Error("Network error: " + response.status);
                    return response.json();
                })
                .then((data) => {
                    toast({
                        title: "Thành công",
                        message: data.message,
                        type: "success",
                        duration: 3000,
                    });
                    loadWarranties();
                    bootstrap.Modal.getInstance(document.getElementById("editWarrantyModal")).hide();
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast({
                        title: "Lỗi",
                        message: "Cập nhật bảo hành thất bại.",
                        type: "error",
                        duration: 3000,
                    });
                });
        })
        .catch((error) => {
            console.error("Error:", error);
            toast({
                title: "Lỗi",
                message: "Không thể tải thông tin bảo hành.",
                type: "error",
                duration: 3000,
            });
        });
}

function deleteWarranty(idBaoHanh) {
    if (confirm("Bạn có chắc muốn xóa bảo hành này? (Trạng thái sẽ được đặt về Ngừng hoạt động)")) {
        fetch(`/smartstation/src/mvc/controllers/BaohanhController.php?idBaoHanh=${idBaoHanh}`, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) throw new Error("Network error: " + response.status);
                return response.json();
            })
            .then((warranty) => {
                if (warranty.TrangThai == 1) {
                    return fetch(`/smartstation/src/mvc/controllers/BaohanhController.php?idBaoHanh=${idBaoHanh}`, {
                        method: "DELETE",
                    });
                } else {
                    toast({
                        title: "Lỗi",
                        message: "Bảo hành đã ngừng hoạt động, không thể xóa.",
                        type: "error",
                        duration: 3000,
                    });
                    throw new Error("Bảo hành đã ngừng hoạt động.");
                }
            })
            .then((response) => {
                if (!response.ok) throw new Error("Network error: " + response.status);
                return response.json();
            })
            .then((data) => {
                toast({
                    title: "Thành công",
                    message: data.message,
                    type: "success",
                    duration: 3000,
                });
                loadWarranties();
            })
            .catch((error) => {
                console.error("Error:", error);
                toast({
                    title: "Lỗi",
                    message: "Xóa bảo hành thất bại.",
                    type: "error",
                    duration: 3000,
                });
            });
    }
}

// Gọi khi script được tải
loadWarranties();
