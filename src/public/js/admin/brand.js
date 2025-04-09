// Hàm thêm thương hiệu
function submitAddBrand() {
    const tenThuongHieu = document.getElementById("tenThuongHieu").value;
    if (tenThuongHieu.trim() === "") {
        alert("Vui lòng nhập tên thương hiệu!");
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
            toast({
                title: "Lỗi",
                message: "Thêm thất bại",
                type: "error",
                duration: 3000,
            });
            alert("Thêm thương hiệu thất bại");
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
                loadBrands();
            })
            .catch((error) => {
                toast({
                    title: "Lỗi",
                    message: "Xóa thất bại.",
                    type: "error",
                    duration: 3000,
                });
                console.error("Error:", error);
            });
    }
}

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
            const tbody = document.getElementById("brandTableBody");
            tbody.innerHTML = "";
            if (!brands || brands.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4">Không có thương hiệu nào</td></tr>';
            } else {
                brands.forEach((brand) => {
                    tbody.innerHTML += `
                      <tr>
                          <td>${brand.IdThuongHieu}</td>
                          <td>${brand.TenThuongHieu}</td>
                          <td>${brand.TrangThai == 1 ? "Hoạt động" : "Ngừng hoạt động"}</td>
                          <td>
                              <button class="btn btn-primary" onclick="editBrand('${brand.IdThuongHieu}')">Sửa</button>
                              <button class="btn btn-danger" onclick="deleteBrand('${brand.IdThuongHieu}')">Xóa</button>
                          </td>
                      </tr>`;
                });
            }
        })
        .catch((error) => console.error("Fetch error:", error));
}

// Hàm hiển thị popup chỉnh sửa thương hiệu
function editBrand(idThuongHieu) {
    // Lấy thông tin thương hiệu theo ID
    fetch(`/smartstation/src/mvc/controllers/ThuongHieuController.php?idThuongHieu=${idThuongHieu}`, {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((brand) => {
            if (brand) {
                // Điền dữ liệu vào form
                document.getElementById("editIdThuongHieu").value = brand.IdThuongHieu;
                document.getElementById("editTenThuongHieu").value = brand.TenThuongHieu;
                // Hiển thị modal
                const editModal = new bootstrap.Modal(document.getElementById("editBrandModal"));
                editModal.show();
            }
        })
        .catch((error) => {
            console.error("Error fetching brand:", error);
            alert("Không thể tải thông tin thương hiệu");
        });
}

// Hàm lưu thay đổi thương hiệu
function submitEditBrand() {
    const idThuongHieu = document.getElementById("editIdThuongHieu").value;
    const tenThuongHieu = document.getElementById("editTenThuongHieu").value;

    if (tenThuongHieu.trim() === "") {
        alert("Vui lòng nhập tên thương hiệu!");
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
            loadBrands();
            toast({
                title: "Thành công",
                message: "Cập nhật thành công",
                type: "success",
                duration: 3000,
            });
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Cập nhật thương hiệu thất bại");
        });
}

// Gọi khi script được tải
loadBrands();