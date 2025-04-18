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
    try {
        const brandMap = await fetchBrandsMap();
        const response = await fetch("/smartstation/src/mvc/controllers/DongSanPhamController.php", {
            method: "GET",
        });
        if (!response.ok) throw new Error("Network error: " + response.status);
        const productLines = await response.json();

        const tbody = document.getElementById("productLineTableBody");
        tbody.innerHTML = "";
        if (!productLines || productLines.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">Không có dòng sản phẩm nào</td></tr>';
        } else {
            productLines.forEach((productLine) => {
                const brandName = productLine.IdThuongHieu ? brandMap[productLine.IdThuongHieu] || "Không xác định" : "Không có";
                tbody.innerHTML += `
                    <tr>
                        <td>${productLine.IdDongSanPham}</td>
                        <td>${productLine.TenDong}</td>
                        <td>${productLine.SoLuong}</td>
                        <td>${brandName}</td>
                        <td class="text-center">
                            <button class="btn btn-primary" onclick="openEditModal(${productLine.IdDongSanPham})">Sửa</button>
                            <button class="btn btn-danger" onclick="deleteProductLine(${productLine.IdDongSanPham})">Xóa</button>
                        </td>
                    </tr>`;
            });
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

function openAddModal() {
    document.getElementById("productLineModalLabel").innerText = "Thêm dòng sản phẩm";
    document.getElementById("productLineForm").reset();
    document.getElementById("tenDong").dataset.idDSP = "";
    document.getElementById("soLuongField").style.display = "none";
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