function loadProductLine() {
    fetch("/smartstation/src/mvc/controllers/DongSanPhamController.php", {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((productLine) => {
            const tbody = document.getElementById("productLineTableBody");
            tbody.innerHTML = "";
            if (!productLine || productLine.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5">Không có dòng sản phẩm nào</td></tr>'
            } else {
                productLine.forEach((product) => {
                    tbody.innerHTML += `
                                <tr>
                                    <td>${product.IdDongSanPham}</td>
                                    <td>${product.IdThuongHieu}</td>
                                    <td>${product.SoLuong}</td>
                                    <td>${product.TrangThai == 1
                                        ? "Hoạt động"
                                        : "Ngừng hoạt động"
                                    }</td>
                                    <td>
                                        <button class="btn btn-primary" 
                                            onclick="editProductLine('${product.IdDongSanPham}')">Sửa</button>
                                        <button class="btn btn-danger" 
                                            onclick="deleteProductLine('${product.IdDongSanPham}')">Xóa</button>
                                    </td>
                                </tr>
                                `;
                });
            }
        })
        .catch((error) => console.error("Fetch error:", error));
}

function editProductLine(idDongSanPham) {
    window.location.href = `edit_product_line.php?idDongSanPham=${idDongSanPham}`;
}

function deleteProductLine(idDongSanPham) {
    if (confirm("Bạn có chắc muốn xóa dòng sản phẩm này?")) {
        fetch(
            `/smartstation/src/mvc/controllers/DongSanPhamController.php?idDSP=${idDongSanPham}`,
            {
                method: "GET",
            }
        )
            .then((response) => response.json())
            .then((productline) => {
                if (productline.SoLuong === 0) {
                    if (productline.TrangThai == 1) {
                        // cho phep xoa: so luong = 0 va dang hoat dong
                        return fetch(
                            `/smartstation/src/mvc/controllers/DongSanPhamController.php?idDSP=${idDongSanPham}`,
                            {
                                method: "DELETE",
                            }
                        );
                    } else {
                        // san pham ngung hoat dong
                        toast({
                            title: "Lỗi",
                            message: "Dòng sản phẩm này đã ngừng hoạt động. Xóa thất bại.",
                            type: "error",
                            duration: 3000,
                        });
                        throw new Error("Dòng sản phẩm này đã ngừng hoạt động. Xóa thất bại")
                    }
                } else {
                    // so luong lon hon 0
                    toast({
                        title: "Cảnh báo",
                        message: "Chỉ được xóa dòng sản phẩm khi số lượng = 0",
                        type: "warning",
                        duration: 3000,
                    });
                    throw new Error("Chỉ được xóa dòng sản phẩm khi số lượng = 0");
                }
            })
            .then((response) => response.json())
            .then((data) => {
                toast({
                    title: "Thành công",
                    message: data.message,
                    type: "success",
                    duration: 3000,
                });
                loadProductLine();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
}

loadProductLine();