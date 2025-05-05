// Số lượng dòng sản phẩm mỗi trang
var PRODUCT_LINES_PER_PAGE = 8;
var currentPage = 1;
var allProductLines = []; // Lưu trữ toàn bộ dữ liệu dòng sản phẩm
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

// Hàm lấy danh sách thương hiệu và trả về ánh xạ Id -> Tên
async function fetchBrandsMap() {
    try {
        const response = await fetch("/smartstation/src/mvc/controllers/ThuongHieuController.php", {
            method: "GET",
        });
        if (!response.ok) throw new Error("Network error: " + response.status);
        const brands = await response.json();
        const brandMap = {};
        brands.forEach(brand => {
            brandMap[brand.IdThuongHieu] = brand.TenThuongHieu;
        });
        return brandMap;
    } catch (error) {
        console.error("Error fetching brands:", error);
        toast({
            title: "Lỗi",
            message: "Không thể tải danh sách thương hiệu",
            type: "error",
            duration: 3000,
        });
        return {};
    }
}

// Hàm lấy danh sách thương hiệu và điền vào dropdown
function loadBrands() {


    fetch("/smartstation/src/mvc/controllers/ThuongHieuController.php", {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((brands) => {
            const select = document.getElementById("idThuongHieu");
            select.innerHTML = '<option value="">Chọn thương hiệu</option>';
            brands.forEach((brand) => {
                select.innerHTML += `<option value="${brand.IdThuongHieu}">${brand.TenThuongHieu}</option>`;
            });
        })
        .catch((error) => {
            console.error("Error loading brands:", error);
            toast({
                title: "Lỗi",
                message: "Không thể tải danh sách thương hiệu",
                type: "error",
                duration: 3000,
            });
        });
}

// Hàm tải danh sách dòng sản phẩm và hiển thị tên thương hiệu
async function loadProductLines() {

    await loadPermissions();

    try {
        const brandMap = await fetchBrandsMap();
        const response = await fetch("/smartstation/src/mvc/controllers/DongSanPhamController.php", {
            method: "GET",
        });
        if (!response.ok) throw new Error("Network error: " + response.status);
        const productLines = await response.json();

        allProductLines = productLines; // Lưu dữ liệu vào biến toàn cục
        renderProductLinesByPage(currentPage); // Render trang đầu tiên
        renderPagination(); // Render nút phân trang

        if (!hasPermission('Dòng sản phẩm', 'them')) {
            document.querySelector('.btn-success[data-bs-target="#productLineModal"]').style.display = 'none';
        }
    } catch (error) {
        console.error("Fetch error:", error);
        document.getElementById("productLineTableBody").innerHTML =
            '<tr><td colspan="5">Đã xảy ra lỗi khi tải dữ liệu.</td></tr>';
    }
}

// Render danh sách dòng sản phẩm theo trang
async function renderProductLinesByPage(page) {
    const tbody = document.getElementById("productLineTableBody");
    let rows = '';

    if (!allProductLines || allProductLines.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">Không có dòng sản phẩm nào</td></tr>';
        return;
    }

    // Tính toán chỉ số bắt đầu và kết thúc của dữ liệu trên trang hiện tại
    const startIndex = (page - 1) * PRODUCT_LINES_PER_PAGE;
    const endIndex = startIndex + PRODUCT_LINES_PER_PAGE;
    const productLinesToDisplay = allProductLines.slice(startIndex, endIndex);

    const hasEditPermission = hasPermission('Dòng sản phẩm', 'sua');
    const hasDeletePermission = hasPermission('Dòng sản phẩm', 'xoa');

    const brandMap = await fetchBrandsMap();
    productLinesToDisplay.forEach((productLine) => {
        const brandName = productLine.IdThuongHieu ? brandMap[productLine.IdThuongHieu] || "Không xác định" : "Không có";
        let actionButtons = '';
        if (hasEditPermission) {
            actionButtons += `
                 <button class="btn btn-primary" onclick="openEditModal(${productLine.IdDongSanPham})">Sửa</button>
            `;
        }
        if (hasDeletePermission) {
            actionButtons += `
                <button class="btn btn-danger" onclick="deleteProductLine(${productLine.IdDongSanPham})">Xóa</button>
            `;
        }
        rows += `
            <tr>
                <td>${productLine.IdDongSanPham}</td>
                <td>${productLine.TenDong}</td>
                <td>${productLine.SoLuong}</td>
                <td>${brandName}</td>
                <td class="text-center">
                    ${actionButtons || 'Không có quyền'}
                </td>
            </tr>`;
    });
    tbody.innerHTML = rows;
}

// Render nút phân trang
function renderPagination() {
    const totalPages = Math.ceil(allProductLines.length / PRODUCT_LINES_PER_PAGE);
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
                renderProductLinesByPage(currentPage);
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

function openAddModal() {
    document.getElementById("productLineModalLabel").innerText = "Thêm dòng sản phẩm";
    document.getElementById("productLineForm").reset();
    document.getElementById("tenDong").dataset.idDSP = "";
    document.getElementById("soLuongField").style.display = "none"; // Sửa lỗi cú pháp
    loadBrands();
}

function openEditModal(idDSP) {
    fetch(`/smartstation/src/mvc/controllers/DongSanPhamController.php?idDSP=${idDSP}`, {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((productLine) => {
            document.getElementById("productLineModalLabel").innerText = "Sửa dòng sản phẩm";
            document.getElementById("tenDong").value = productLine.TenDong;
            document.getElementById("tenDong").dataset.idDSP = productLine.IdDongSanPham;
            document.getElementById("soLuong").value = productLine.SoLuong;
            document.getElementById("soLuong").dataset.originalSoLuong = productLine.SoLuong;
            document.getElementById("soLuongField").style.display = "block";
            loadBrands();
            setTimeout(() => {
                document.getElementById("idThuongHieu").value = productLine.IdThuongHieu || "";
            }, 100);
            new bootstrap.Modal(document.getElementById("productLineModal")).show();
        })
        .catch((error) => console.error("Fetch error:", error));
}

function saveProductLine() {
    const tenDong = document.getElementById("tenDong").value.trim();
    const idThuongHieu = document.getElementById("idThuongHieu").value;

    if (!idThuongHieu) {
        toast({
            title: "Cảnh báo",
            message: "Vui lòng chọn thương hiệu!",
            type: "warning",
            duration: 3000,
        });
        return;
    }

    if (!tenDong) {
        toast({
            title: "Cảnh báo",
            message: "Vui lòng nhập tên dòng sản phẩm!",
            type: "warning",
            duration: 3000,
        });
        return;
    }

    const isEdit = document.getElementById("tenDong").dataset.idDSP;
    const soLuong = isEdit 
        ? parseInt(document.getElementById("soLuong").dataset.originalSoLuong)
        : 0;

    const data = {
        TenDong: tenDong,
        SoLuong: soLuong,
        IdThuongHieu: parseInt(idThuongHieu),
        TrangThai: 1
    };

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit 
        ? `/smartstation/src/mvc/controllers/DongSanPhamController.php?idDSP=${isEdit}` 
        : "/smartstation/src/mvc/controllers/DongSanPhamController.php";

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
            bootstrap.Modal.getInstance(document.getElementById("productLineModal")).hide();
            loadProductLines();
        })
        .catch((error) => {
            console.error("Error:", error);
            toast({
                title: "Lỗi",
                message: "Đã xảy ra lỗi khi lưu dòng sản phẩm",
                type: "error",
                duration: 3000,
            });
        });
}

function deleteProductLine(idDSP) {
    if (confirm("Bạn có chắc muốn ngừng hoạt động dòng sản phẩm này?")) {
        fetch(`/smartstation/src/mvc/controllers/DongSanPhamController.php?idDSP=${idDSP}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((productLine) => {
                if (productLine.SoLuong === 0) {
                    if (productLine.TrangThai == 1) {
                        return fetch(`/smartstation/src/mvc/controllers/DongSanPhamController.php?idDSP=${idDSP}`, {
                            method: "DELETE",
                        });
                    } else {
                        throw new Error("Dòng sản phẩm không còn hoạt động.");
                    }
                } else {
                    throw new Error("Chỉ được ngừng hoạt động khi số lượng bằng 0");
                }
            })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((err) => {
                        throw new Error(err.message);
                    });
                }
                return response.json();
            })
            .then((data) => {
                toast({
                    title: "Thành công",
                    message: data.message,
                    type: "success",
                    duration: 3000,
                });
                loadProductLines();
            })
            .catch((error) => {
                console.error("Error:", error);
                const message = error.message.includes("đang được sử dụng")
                    ? "Không thể xóa vì dòng sản phẩm đang được sử dụng trong sản phẩm."
                    : error.message;
                toast({
                    title: error.message.includes("số lượng") || error.message.includes("đang được sử dụng") ? "Cảnh báo" : "Lỗi",
                    message: message,
                    type: error.message.includes("số lượng") || error.message.includes("đang được sử dụng") ? "warning" : "error",
                    duration: 3000,
                });
            });
    }
}

// Gọi khi script được tải
loadProductLines();
