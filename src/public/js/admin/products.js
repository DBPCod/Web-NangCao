function loadProducts() {
  fetch("/smartstation/src/mvc/controllers/SanPhamController.php", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network error: " + response.status);
      return response.json();
    })
    .then((products) => {
      const tbody = document.getElementById("productTableBody");
      tbody.innerHTML = "";
      if (!products || products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">Không có sản phẩm nào</td></tr>';
      } else {
        products.forEach((product) => {
          tbody.innerHTML += `
                          <tr>
                              <td>${product.IdCHSP}</td>
                              <td>${product.IdDongSanPham}</td>
                              <td>${product.SoLuong}</td>
                              <td>${
                                product.TrangThai == 1
                                  ? "Hoạt động"
                                  : "Ngừng hoạt động"
                              }</td>
                              <td>
                                  <button class="btn btn-primary" onclick="editProduct('${
                                    product.IdCHSP
                                  }', '${product.IdDongSanPham}')">Sửa</button>
                                  <button class="btn btn-danger" onclick="deleteProduct('${
                                    product.IdCHSP
                                  }', '${product.IdDongSanPham}')">Xóa</button>
                              </td>
                          </tr>`;
        });
      }
    })
    .catch((error) => console.error("Fetch error:", error));
}

function editProduct(idCHSP, idDSP) {
  window.location.href = `edit_product.php?idCHSP=${idCHSP}&idDSP=${idDSP}`;
}

function deleteProduct(idCHSP, idDSP) {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      fetch(
        `/smartstation/src/mvc/controllers/SanPhamController.php?idCHSP=${idCHSP}&idDSP=${idDSP}`,
        {
          method: "GET", // Lấy thông tin sản phẩm trước
        }
      )
        .then((response) => response.json())
        .then((product) => {
          if (product.SoLuong === 0) {
            if (product.TrangThai == 1) {
              // ✅ Cho phép xóa: Số lượng = 0 và đang hoạt động
              return fetch(
                `/smartstation/src/mvc/controllers/SanPhamController.php?idCHSP=${idCHSP}&idDSP=${idDSP}`,
                {
                  method: "DELETE",
                }
              );
            } else {
              // ⚠️ Sản phẩm ngừng hoạt động
              toast({
                title: "Lỗi",
                message: "Sản phẩm không còn hoạt động. Xóa thất bại.",
                type: "error",
                duration: 3000,
              });
              throw new Error("Sản phẩm không còn hoạt động. Xóa thất bại.");
            }
          } else {
            // ❌ Số lượng lớn hơn 0
            toast({
              title: "Cảnh báo",
              message: "Chỉ được xóa sản phẩm khi số lượng bằng 0",
              type: "warning",
              duration: 3000,
            });
            throw new Error("Chỉ được xóa sản phẩm khi số lượng bằng 0");
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
          loadProducts();
        })
        .catch((error) => {
          console.error("Error:", error);
          // Các lỗi đã hiển thị toast ở trên nên không cần hiện lại nữa
        });
    }
  }
  

// Gọi khi script được tải
loadProducts();
