// Số lượng thương hiệu mỗi trang
var BRANDS_PER_PAGE = 5;
var currentPage = 1;
var allBrands = []; // Lưu trữ toàn bộ dữ liệu thương hiệu

// Hàm tải danh sách thương hiệu
function loadBrands() {
    fetch("/smartstation/src/mvc/controllers/ThuongHieuController.php", {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((brands) => {
            allBrands = brands; // Lưu dữ liệu vào biến toàn cục
            renderBrandsByPage(currentPage); // Render trang đầu tiên
            renderPagination(); // Render nút phân trang
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            document.getElementById("brandTableBody").innerHTML =
                '<tr><td colspan="3">Đã xảy ra lỗi khi tải dữ liệu.</td></tr>';
        });
}

// Render danh sách thương hiệu theo trang
function renderBrandsByPage(page) {
    const tbody = document.getElementById("brandTableBody");
    tbody.innerHTML = "";

    if (!allBrands || allBrands.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">Không có thương hiệu nào</td></tr>';
        return;
    }

    // Tính toán chỉ số bắt đầu và kết thúc của dữ liệu trên trang hiện tại
    const startIndex = (page - 1) * BRANDS_PER_PAGE;
    const endIndex = startIndex + BRANDS_PER_PAGE;
    const brandsToDisplay = allBrands.slice(startIndex, endIndex);

    brandsToDisplay.forEach((brand) => {
        tbody.innerHTML += `
            <tr>
                <td>${brand.IdThuongHieu}</td>
                <td>${brand.TenThuongHieu}</td>
                <td class="text-center">
                    <button class="btn btn-primary" onclick="editBrand('${brand.IdThuongHieu}')">Sửa</button>
                    <button class="btn btn-danger" onclick="deleteBrand('${brand.IdThuongHieu}')">Xóa</button>
                </td>
            </tr>`;
    });
}

// Render nút phân trang
function renderPagination() {
    const totalPages = Math.ceil(allBrands.length / BRANDS_PER_PAGE);
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
            renderBrandsByPage(currentPage);
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
            renderBrandsByPage(currentPage);
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
            renderBrandsByPage(currentPage);
            renderPagination();
        }
    });
    paginationContainer.appendChild(nextButton);
}

// Hàm thêm thương hiệu
function submitAddBrand() {
    const tenThuongHieu = document.getElementById("tenThuongHieu").value;
    if (tenThuongHieu.trim() === "") {
        toast({
            title: "Cảnh báo",
            message: "Vui lòng nhập tên thương hiệu!",
            type: "warning",
            duration: 3000,
        });
        return;
    }

    fetch("/smartstation/src/mvc/controllers/ThuongHieuController.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ TenThuongHieu: tenThuongHieu }),
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((data) => {
            document.getElementById("addBrandForm").reset();
            bootstrap.Modal.getInstance(document.getElementById("addBrandModal")).hide();
            toast({
                title: "Thành công",
                message: data.message,
                type: "success",
                duration: 3000,
            });
            loadBrands();
        })
        .catch((error) => {
            console.error("Error:", error);
            toast({
                title: "Cảnh báo",
                message: "Thêm thương hiệu thất bại",
                type: "warning",
                duration: 3000,
            });
        });
}

// Hàm xóa thương hiệu
function deleteBrand(idThuongHieu) {
    if (confirm("Bạn có chắc muốn ngừng hoạt động thương hiệu này?")) {
        fetch(`/smartstation/src/mvc/controllers/ThuongHieuController.php?idThuongHieu=${idThuongHieu}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
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
                loadBrands();
            })
            .catch((error) => {
                console.error("Error:", error);
                const message = error.message.includes("đang được sử dụng")
                    ? "Không thể xóa vì thương hiệu đang được sử dụng trong dòng sản phẩm."
                    : "Xóa thất bại.";
                toast({
                    title: "Cảnh báo",
                    message: message,
                    type: "warning",
                    duration: 3000,
                });
            });
    }
}

// Hàm hiển thị popup chỉnh sửa thương hiệu
function editBrand(idThuongHieu) {
    fetch(`/smartstation/src/mvc/controllers/ThuongHieuController.php?idThuongHieu=${idThuongHieu}`, {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((brand) => {
            if (brand) {
                document.getElementById("editIdThuongHieu").value = brand.IdThuongHieu;
                document.getElementById("editTenThuongHieu").value = brand.TenThuongHieu;
                const editModal = new bootstrap.Modal(document.getElementById("editBrandModal"));
                editModal.show();
            }
        })
        .catch((error) => {
            console.error("Error fetching brand:", error);
            toast({
                title: "Cảnh báo",
                message: "Không thể tải thông tin thương hiệu",
                type: "warning",
                duration: 3000,
            });
        });
}

// Hàm lưu thay đổi thương hiệu
function submitEditBrand() {
    const idThuongHieu = document.getElementById("editIdThuongHieu").value;
    const tenThuongHieu = document.getElementById("editTenThuongHieu").value;

    if (tenThuongHieu.trim() === "") {
        toast({
            title: "Cảnh báo",
            message: "Vui lòng nhập tên thương hiệu!",
            type: "warning",
            duration: 3000,
        });
        return;
    }

    fetch(`/smartstation/src/mvc/controllers/ThuongHieuController.php?idThuongHieu=${idThuongHieu}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ TenThuongHieu: tenThuongHieu }),
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((data) => {
            bootstrap.Modal.getInstance(document.getElementById("editBrandModal")).hide();
            toast({
                title: "Thành công",
                message: data.message,
                type: "success",
                duration: 3000,
            });
            loadBrands();
        })
        .catch((error) => {
            console.error("Error:", error);
            toast({
                title: "Cảnh báo",
                message: "Cập nhật thương hiệu thất bại",
                type: "warning",
                duration: 3000,
            });
        });
}

// Gọi khi script được tải
loadBrands();