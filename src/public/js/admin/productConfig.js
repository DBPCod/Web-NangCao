// Số lượng cấu hình sản phẩm mỗi trang
var CONFIGS_PER_PAGE = 8;
var currentPage = 1;
var allProductConfigs = []; // Lưu trữ toàn bộ dữ liệu cấu hình sản phẩm
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

// Tải danh sách cấu hình sản phẩm
async function loadProductConfigs() {

    await loadPermissions();

    console.log("A");
    fetch("/smartstation/src/mvc/controllers/CauHinhSanPhamController.php", {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((productConfigs) => {
            allProductConfigs = productConfigs; // Lưu dữ liệu vào biến toàn cục
            renderProductConfigsByPage(currentPage); // Render trang đầu tiên
            renderPagination(); // Render nút phân trang
            if (!hasPermission('Cấu hình sản phẩm', 'them')) {
                document.querySelector('.btn-success[data-bs-target="#productConfigModal"]').style.display = 'none';
            }
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            document.getElementById("productConfigTableBody").innerHTML =
                '<tr><td colspan="8">Đã xảy ra lỗi khi tải dữ liệu.</td></tr>';
        });
}

// Render danh sách cấu hình sản phẩm theo trang
function renderProductConfigsByPage(page) {
    const tbody = document.getElementById("productConfigTableBody");
    rows = "";

    if (!allProductConfigs || allProductConfigs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8">Không có cấu hình sản phẩm nào</td></tr>';
        return;
    }

    // Tính toán chỉ số bắt đầu và kết thúc của dữ liệu trên trang hiện tại
    const startIndex = (page - 1) * CONFIGS_PER_PAGE;
    const endIndex = startIndex + CONFIGS_PER_PAGE;
    const configsToDisplay = allProductConfigs.slice(startIndex, endIndex);

    const hasEditPermission = hasPermission('Cấu hình sản phẩm', 'sua');
    const hasDeletePermission = hasPermission('Cấu hình sản phẩm', 'xoa');

    configsToDisplay.forEach((config) => {
        let actionButtons = '';
        if (hasEditPermission) {
            actionButtons += `
                <button class="btn btn-primary" onclick="openEditModal(${config.IdCHSP})">Sửa</button>
            `;
        }
        if (hasDeletePermission) {
            actionButtons += `
                 <button class="btn btn-danger" onclick="deleteProductConfig(${config.IdCHSP})">Xóa</button>
            `;
        }
        rows += `
            <tr>
                <td>${config.IdCHSP}</td>
                <td>${config.Ram || "Không có"}</td>
                <td>${config.Rom || "Không có"}</td>
                <td>${config.ManHinh || "Không có"}</td>
                <td>${config.Pin || "Không có"}</td>
                <td>${config.MauSac || "Không có"}</td>
                <td>${config.Camera || "Không có"}</td>
                <td class="text-center">
                    ${actionButtons || 'Không có quyền'}
                </td>
            </tr>`;
    });
    tbody.innerHTML = rows;
}

// Render nút phân trang
function renderPagination() {
    const totalPages = Math.ceil(allProductConfigs.length / CONFIGS_PER_PAGE);
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
                renderProductConfigsByPage(currentPage);
                renderPagination();
            });
        }
        paginationContainer.appendChild(btn);
    };

    // Nút "Prev"
    addPage("« Prev", currentPage - 1, false, currentPage === 1);

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

    // Nút "Next"
    addPage("Next »", currentPage + 1, false, currentPage === totalPages);
}

// Mở modal thêm mới
function openAddModal() {
    document.getElementById("productConfigModalLabel").innerText = "Thêm cấu hình sản phẩm";
    document.getElementById("productConfigForm").reset();
    delete document.getElementById("productConfigForm").dataset.idCHSP; // Xóa idCHSP nếu có
}

// Mở modal sửa
function openEditModal(idCHSP) {
    fetch(`/smartstation/src/mvc/controllers/CauHinhSanPhamController.php?idCHSP=${idCHSP}`, {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((config) => {
            document.getElementById("productConfigModalLabel").innerText = "Sửa cấu hình sản phẩm";
            // Tách số từ chuỗi có đơn vị
            document.getElementById("ram").value = config.Ram ? parseFloat(config.Ram.replace("GB", "")) : "";
            document.getElementById("rom").value = config.Rom ? parseFloat(config.Rom.replace("GB", "")) : "";
            document.getElementById("manHinh").value = config.ManHinh ? parseFloat(config.ManHinh.replace(" inch", "")) : "";
            document.getElementById("pin").value = config.Pin ? parseFloat(config.Pin.replace("mAh", "")) : "";
            document.getElementById("mauSac").value = config.MauSac || "";
            document.getElementById("camera").value = config.Camera ? parseFloat(config.Camera.replace("MP", "")) : "";
            // Lưu idCHSP vào dataset
            document.getElementById("productConfigForm").dataset.idCHSP = idCHSP;
            new bootstrap.Modal(document.getElementById("productConfigModal")).show();
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            toast({
                title: "Lỗi",
                message: "Không thể tải cấu hình sản phẩm",
                type: "error",
                duration: 3000,
            });
        });
}

// Lưu cấu hình (thêm hoặc sửa)
function saveProductConfig() {
    const idCHSP = document.getElementById("productConfigForm").dataset.idCHSP;
    const data = {
        Ram: document.getElementById("ram").value ? `${document.getElementById("ram").value}GB` : null,
        Rom: document.getElementById("rom").value ? `${document.getElementById("rom").value}GB` : null,
        ManHinh: document.getElementById("manHinh").value ? `${document.getElementById("manHinh").value} inch` : null,
        Pin: document.getElementById("pin").value ? `${document.getElementById("pin").value}mAh` : null,
        MauSac: document.getElementById("mauSac").value || null,
        Camera: document.getElementById("camera").value ? `${document.getElementById("camera").value}MP` : null,
        TrangThai: 1,
    };

    const method = idCHSP ? "PUT" : "POST";
    const url = idCHSP
        ? `/smartstation/src/mvc/controllers/CauHinhSanPhamController.php?idCHSP=${idCHSP}`
        : "/smartstation/src/mvc/controllers/CauHinhSanPhamController.php";

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((result) => {
            toast({
                title: "Thành công",
                message: result.message,
                type: "success",
                duration: 3000,
            });
            bootstrap.Modal.getInstance(document.getElementById("productConfigModal")).hide();
            delete document.getElementById("productConfigForm").dataset.idCHSP;
            loadProductConfigs(); // Tải lại danh sách với phân trang
        })
        .catch((error) => {
            console.error("Error:", error);
            toast({
                title: "Lỗi",
                message: "Đã xảy ra lỗi khi lưu cấu hình sản phẩm",
                type: "error",
                duration: 3000,
            });
        });
}

// Xóa cấu hình
function deleteProductConfig(idCHSP) {
    if (confirm("Bạn có chắc muốn ngừng hoạt động cấu hình sản phẩm này?")) {
        fetch(`/smartstation/src/mvc/controllers/CauHinhSanPhamController.php?idCHSP=${idCHSP}`, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) throw new Error("Network error: " + response.status);
                return response.json();
            })
            .then((config) => {
                if (config && config.TrangThai == 1) {
                    return fetch(`/smartstation/src/mvc/controllers/CauHinhSanPhamController.php?idCHSP=${idCHSP}`, {
                        method: "DELETE",
                    });
                } else {
                    throw new Error("Cấu hình sản phẩm không còn hoạt động.");
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
                loadProductConfigs(); // Tải lại danh sách với phân trang
            })
            .catch((error) => {
                console.error("Error:", error);
                toast({
                    title: "Lỗi",
                    message: error.message || "Đã xảy ra lỗi khi xóa cấu hình",
                    type: "error",
                    duration: 3000,
                });
            });
    }
}

// Gọi khi script được tải
loadProductConfigs();
