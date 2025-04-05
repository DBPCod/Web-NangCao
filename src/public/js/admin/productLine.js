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
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message); // Hiển thị thông báo từ server
          loadProductLines(); // Tải lại danh sách sau khi xóa
        })
        .catch((error) => console.error("Delete error:", error));
    }
  }
  
  // Gọi khi script được tải
  loadProductLines();