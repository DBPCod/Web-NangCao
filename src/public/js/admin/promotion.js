var allProductLines = [];
var selectedProductLines = new Set();
var allPromotions = []; // Lưu trữ toàn bộ dữ liệu khuyến mãi
var PROMOTIONS_PER_PAGE = 8; // Số lượng khuyến mãi mỗi trang
var currentPage = 1; // Trang hiện tại
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

// Hàm tải danh sách khuyến mãi
async function loadPromotions() {

    await loadPermissions();

    fetch("/smartstation/src/mvc/controllers/KhuyenMaiController.php", {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((promotions) => {
            allPromotions = promotions; // Lưu dữ liệu vào biến toàn cục
            renderPromotionsByPage(currentPage); // Render trang đầu tiên
            renderPagination(); // Render nút phân trang
            if (!hasPermission('Khuyến mãi', 'them')) {
                document.querySelector('.btn-success[data-bs-target="#addPromotionModal"]').style.display = 'none';
            }
        })
        .catch((error) => {
            console.error("Fetch error in loadPromotions:", error);
            document.getElementById("promotionTableBody").innerHTML =
                '<tr><td colspan="6">Đã xảy ra lỗi khi tải dữ liệu.</td></tr>';
            toast({
                title: "Lỗi",
                message: "Không thể tải danh sách khuyến mãi",
                type: "error",
                duration: 3000,
            });
        });
}

// Render danh sách khuyến mãi theo trang
function renderPromotionsByPage(page) {
    const tbody = document.getElementById("promotionTableBody");
    rows = "";

    if (!allPromotions || allPromotions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Không có khuyến mãi nào</td></tr>';
        return;
    }

    // Tính toán chỉ số bắt đầu và kết thúc của dữ liệu trên trang hiện tại
    const startIndex = (page - 1) * PROMOTIONS_PER_PAGE;
    const endIndex = startIndex + PROMOTIONS_PER_PAGE;
    const promotionsToDisplay = allPromotions.slice(startIndex, endIndex);
    
    const hasDeletePermission = hasPermission('Khuyến mãi', 'xoa');

    promotionsToDisplay.forEach((promotion) => {
        let actionButtons = '';
        if (hasDeletePermission) {
            actionButtons += `
                  <button class="btn btn-danger" onclick="deletePromotion('${promotion.IdKhuyenMai}'); event.stopPropagation();">Xóa</button>
            `;
        }
        rows += `
            <tr onclick="viewPromotionDetails('${promotion.IdKhuyenMai}')" style="cursor: pointer;">
                <td>${promotion.IdKhuyenMai}</td>
                <td>${promotion.NgayBatDau}</td>
                <td>${promotion.NgayKetThuc}</td>
                <td>${promotion.PhanTramGiam}%</td>
                <td>${promotion.TrangThai == 1 ? "Hoạt động" : "Ngừng hoạt động"}</td>
                <td class="text-center">
                     ${actionButtons || 'Không có quyền'}
                </td>
            </tr>`;
    });
    tbody.innerHTML = rows;
}

// Render nút phân trang
function renderPagination() {
    const totalPages = Math.ceil(allPromotions.length / PROMOTIONS_PER_PAGE);
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
                renderPromotionsByPage(currentPage);
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

function viewPromotionDetails(idKhuyenMai) {
    console.log("viewPromotionDetails called with idKhuyenMai:", idKhuyenMai);
    fetch(`/smartstation/src/mvc/controllers/KhuyenMaiController.php?idKhuyenMai=${idKhuyenMai}&action=getProductLines`, {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((productLines) => {
            console.log("Product lines received:", productLines);
            const list = document.getElementById("productLineList");
            if (!list) {
                console.error("Element #productLineList not found!");
                toast({
                    title: "Lỗi",
                    message: "Không tìm thấy danh sách dòng sản phẩm",
                    type: "error",
                    duration: 3000,
                });
                return;
            }
            list.innerHTML = "";
            if (!productLines || productLines.length === 0) {
                list.innerHTML = '<li class="list-group-item">Không có dòng sản phẩm nào được áp dụng</li>';
            } else {
                productLines.forEach((line) => {
                    list.innerHTML += `<li class="list-group-item">${line.TenDong}</li>`;
                });
            }
            const modalElement = document.getElementById("productLineModal");
            if (!modalElement) {
                console.error("Modal element #productLineModal not found!");
                toast({
                    title: "Lỗi",
                    message: "Không tìm thấy modal chi tiết khuyến mãi",
                    type: "error",
                    duration: 3000,
                });
                return;
            }
            new bootstrap.Modal(modalElement).show();
        })
        .catch((error) => {
            console.error("Error in viewPromotionDetails:", error);
            toast({
                title: "Lỗi",
                message: "Có lỗi khi tải dữ liệu khuyến mãi",
                type: "error",
                duration: 3000,
            });
        });
}

function deletePromotion(idKhuyenMai) {
    if (confirm("Bạn có chắc muốn ngừng hoạt động khuyến mãi này?")) {
        fetch(`/smartstation/src/mvc/controllers/KhuyenMaiController.php?idKhuyenMai=${idKhuyenMai}`, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) throw new Error("Network error: " + response.status);
                return response.json();
            })
            .then((promotion) => {
                if (promotion.TrangThai == 1) {
                    return fetch(`/smartstation/src/mvc/controllers/KhuyenMaiController.php?idKhuyenMai=${idKhuyenMai}`, {
                        method: "DELETE",
                    });
                } else {
                    throw new Error("Khuyến mãi không còn hoạt động.");
                }
            })
            .then((response) => {
                if (!response.ok) throw new Error("Network error: " + response.status);
                return response.json();
            })
            .then((data) => {
                toast({
                    title: "Thành công",
                    message: "Xóa thành công",
                    type: "success",
                    duration: 3000,
                });
                // Không xóa allProductLines, thay vào đó làm mới nếu cần
                loadPromotions();
            })
            .catch((error) => {
                console.error("Error in deletePromotion:", error);
                toast({
                    title: "Cảnh báo",
                    message: error.message.includes("Khuyến mãi không còn hoạt động")
                        ? "Khuyến mãi không còn hoạt động."
                        : "Xóa khuyến mãi thất bại.",
                    type: "warning",
                    duration: 3000,
                });
            });
    }
}

function loadProductLinesForAdd() {
    fetch("/smartstation/src/mvc/controllers/DongSanPhamController.php", {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((productLines) => {
            allProductLines = productLines;
            renderProductLines(productLines);
        })
        .catch((error) => {
            console.error("Error loading product lines:", error);
            toast({
                title: "Lỗi",
                message: "Không thể tải danh sách dòng sản phẩm",
                type: "error",
                duration: 3000,
            });
        });
}

function renderProductLines(productLines) {
    const tbody = document.getElementById("productLineTableBody");
    tbody.innerHTML = "";
    productLines.forEach((line) => {
        const isChecked = selectedProductLines.has(line.IdDongSanPham) ? "checked" : "";
        tbody.innerHTML += `
            <tr>
                <td><input class="form-check-input product-line-checkbox" type="checkbox" value="${line.IdDongSanPham}" id="productLine_${line.IdDongSanPham}" ${isChecked}></td>
                <td>${line.TenDong}</td>
            </tr>`;
    });

    document.querySelectorAll(".product-line-checkbox").forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            const id = this.value;
            if (this.checked) {
                selectedProductLines.add(id);
            } else {
                selectedProductLines.delete(id);
            }
        });
    });
}

document.getElementById("productLineSearch").addEventListener("input", function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredLines = allProductLines.filter((line) =>
        line.TenDong.toLowerCase().includes(searchTerm)
    );
    renderProductLines(filteredLines);
});

document.getElementById("selectAll").addEventListener("change", function (e) {
    const checkboxes = document.querySelectorAll(".product-line-checkbox");
    checkboxes.forEach((checkbox) => {
        checkbox.checked = e.target.checked;
        const id = checkbox.value;
        if (e.target.checked) {
            selectedProductLines.add(id);
        } else {
            selectedProductLines.delete(id);
        }
    });
});

document.getElementById("addPromotionForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const promotionData = {
        NgayBatDau: document.getElementById("startDate").value,
        NgayKetThuc: document.getElementById("endDate").value,
        PhanTramGiam: document.getElementById("discountPercent").value,
        TrangThai: 1
    };

    fetch("/smartstation/src/mvc/controllers/KhuyenMaiController.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promotionData),
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((data) => {
            if (data.message === "Thêm khuyến mãi thành công") {
                const newIdKhuyenMai = data.khuyenmai.IdKhuyenMai;
                const selectedProductLinesArray = Array.from(selectedProductLines);

                if (selectedProductLinesArray.length === 0) {
                    toast({
                        title: "Thành công",
                        message: "Thêm khuyến mãi thành công (không có dòng sản phẩm được chọn)",
                        type: "success",
                        duration: 3000,
                    });
                    selectedProductLines.clear();
                    loadPromotions();
                    document.getElementById("addPromotionModal").querySelector(".btn-close").click();
                    return;
                }

                const promises = selectedProductLinesArray.map((idDongSanPham) => {
                    console.log("Adding CTKhuyenMai for IdDongSanPham:", idDongSanPham);
                    return fetch("/smartstation/src/mvc/controllers/CTKhuyenMaiController.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            IdKhuyenMai: newIdKhuyenMai,
                            IdDongSanPham: idDongSanPham
                        }),
                    });
                });

                Promise.all(promises)
                    .then(() => {
                        toast({
                            title: "Thành công",
                            message: "Thêm khuyến mãi và dòng sản phẩm thành công",
                            type: "success",
                            duration: 3000,
                        });
                        selectedProductLines.clear();
                        loadPromotions();
                        document.getElementById("addPromotionModal").querySelector(".btn-close").click();
                    })
                    .catch((error) => {
                        console.error("Error adding product lines:", error);
                        toast({
                            title: "Lỗi",
                            message: "Thêm dòng sản phẩm khuyến mãi thất bại",
                            type: "error",
                            duration: 3000,
                        });
                    });
            } else {
                toast({
                    title: "Lỗi",
                    message: "Thêm khuyến mãi thất bại",
                    type: "error",
                    duration: 3000,
                });
            }
        })
        .catch((error) => {
            console.error("Error adding promotion:", error);
            toast({
                title: "Lỗi",
                message: "Thêm khuyến mãi thất bại",
                type: "error",
                duration: 3000,
            });
        });
});

document.getElementById("addPromotionModal").addEventListener("show.bs.modal", function () {
    const today = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().split('T')[0];
    document.getElementById("startDate").value = today;
    document.getElementById("endDate").value = "";
    document.getElementById("discountPercent").value = "";
    document.getElementById("productLineSearch").value = "";
    const selectAllCheckbox = document.getElementById("selectAll");
    selectAllCheckbox.checked = false;
    selectedProductLines.clear();
    loadProductLinesForAdd();
});

// Gọi khi script được tải
loadPromotions();
