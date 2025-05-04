// Số lượng cấu hình sản phẩm mỗi trang
var CONFIGS_PER_PAGE = 8;
var currentPage = 1;
var allProductConfigs = []; // Lưu trữ toàn bộ dữ liệu cấu hình sản phẩm

// Tải danh sách cấu hình sản phẩm
function loadProductConfigs() {
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
    tbody.innerHTML = "";

    if (!allProductConfigs || allProductConfigs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8">Không có cấu hình sản phẩm nào</td></tr>';
        return;
    }

    // Tính toán chỉ số bắt đầu và kết thúc của dữ liệu trên trang hiện tại
    const startIndex = (page - 1) * CONFIGS_PER_PAGE;
    const endIndex = startIndex + CONFIGS_PER_PAGE;
    const configsToDisplay = allProductConfigs.slice(startIndex, endIndex);

    configsToDisplay.forEach((config) => {
        tbody.innerHTML += `
            <tr>
                <td>${config.IdCHSP}</td>
                <td>${config.Ram || "Không có"}</td>
                <td>${config.Rom || "Không có"}</td>
                <td>${config.ManHinh || "Không có"}</td>
                <td>${config.Pin || "Không có"}</td>
                <td>${config.MauSac || "Không có"}</td>
                <td>${config.Camera || "Không có"}</td>
                <td class="text-center">
                    <button class="btn btn-primary" onclick="openEditModal(${config.IdCHSP})">Sửa</button>
                    <button class="btn btn-danger" onclick="deleteProductConfig(${config.IdCHSP})">Xóa</button>
                </td>
            </tr>`;
    });
}

// Render nút phân trang
function renderPagination() {
    const totalPages = Math.ceil(allProductConfigs.length / CONFIGS_PER_PAGE);
    const paginationContainer = document.querySelector("#pagination");
    paginationContainer.innerHTML = "";

    // Nút Previous
    const prevButton = document.createElement("button");
    prevButton.className = "btn btn-secondary mx-1";
    prevButton.textContent = "Previous";
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderProductConfigsByPage(currentPage);
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
            renderProductConfigsByPage(currentPage);
            renderPagination();
        });
        paginationContainer.appendChild(pageButton);
    }

    // Nút Next
    const nextButton = document.createElement("button");
    nextButton.className = "btn btn-secondary mx-1";
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderProductConfigsByPage(currentPage);
            renderPagination();
        }
    });
    paginationContainer.appendChild(nextButton);
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