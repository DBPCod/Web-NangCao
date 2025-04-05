function loadProductLines() {
    fetch("/smartstation/src/mvc/controllers/DongSanPhamController.php", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network error: " + response.status);
        return response.json();
      })
      .then((productLines) => {
        const tbody = document.getElementById("productLineTableBody");
        tbody.innerHTML = "";
        if (!productLines || productLines.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5">Không có dòng sản phẩm nào</td></tr>';
        } else {
          productLines.forEach((productLine) => {
            tbody.innerHTML += `
              <tr>
                <td>${productLine.IdDongSanPham}</td>
                <td>${productLine.SoLuong}</td>
                <td>${productLine.IdThuongHieu || "Không có"}</td>
                <td>${productLine.TrangThai == 1 ? "Hoạt động" : "Ngừng hoạt động"}</td>
                <td>
                  <button class="btn btn-primary" onclick="editProductLine('${productLine.IdDongSanPham}')">Sửa</button>
                  <button class="btn btn-danger" onclick="deleteProductLine('${productLine.IdDongSanPham}')">Xóa</button>
                </td>
              </tr>`;
          });
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }
  
  function editProductLine(idDSP) {
    window.location.href = `edit_productline.php?idDSP=${idDSP}`;
  }
  
  function deleteProductLine(idDSP) {
    if (confirm("Bạn có chắc muốn ngừng hoạt động dòng sản phẩm này?")) {
      fetch(`/smartstation/src/mvc/controllers/DongSanPhamController.php?idDSP=${idDSP}`, {
        method: "GET", // Lấy thông tin dòng sản phẩm trước
      })
        .then((response) => response.json())
        .then((productLine) => {
          if (productLine.SoLuong === 0) {
            if (productLine.TrangThai == 1) {
              // Cho phép ngừng hoạt động: Số lượng = 0 và đang hoạt động
              return fetch(`/smartstation/src/mvc/controllers/DongSanPhamController.php?idDSP=${idDSP}`, {
                method: "DELETE",
              });
            } else {
              // Dòng sản phẩm đã ngừng hoạt động
              toast({
                title: "Lỗi",
                message: "Dòng sản phẩm không còn hoạt động. Ngừng hoạt động thất bại.",
                type: "error",
                duration: 3000,
              });
              throw new Error("Dòng sản phẩm không còn hoạt động.");
            }
          } else {
            // Số lượng > 0
            toast({
              title: "Cảnh báo",
              message: "Chỉ được ngừng hoạt động dòng sản phẩm khi số lượng bằng 0",
              type: "warning",
              duration: 3000,
            });
            throw new Error("Chỉ được ngừng hoạt động khi số lượng bằng 0");
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
          loadProductLines(); // Tải lại danh sách
        })
        .catch((error) => {
          console.error("Error:", error);
          // Các lỗi đã hiển thị toast ở trên nên không cần hiện lại
        });
    }
  }
  
  // Gọi khi script được tải
  loadProductLines();