function loadProductConfigs() {
    fetch("/smartstation/src/mvc/controllers/CauHinhSanPhamController.php", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network error: " + response.status);
        return response.json();
      })
      .then((productConfigs) => {
        const tbody = document.getElementById("productConfigTableBody");
        tbody.innerHTML = "";
        if (!productConfigs || productConfigs.length === 0) {
          tbody.innerHTML = '<tr><td colspan="9">Không có cấu hình sản phẩm nào</td></tr>';
        } else {
          productConfigs.forEach((config) => {
            tbody.innerHTML += `
              <tr>
                <td>${config.IdCHSP}</td>
                <td>${config.Ram || "Không có"}</td>
                <td>${config.Rom || "Không có"}</td>
                <td>${config.ManHinh || "Không có"}</td>
                <td>${config.Pin || "Không có"}</td>
                <td>${config.MauSac || "Không có"}</td>
                <td>${config.Camera || "Không có"}</td>
                <td>${config.TrangThai == 1 ? "Hoạt động" : "Ngừng hoạt động"}</td>
                <td>
                  <button class="btn btn-primary" onclick="editProductConfig('${config.IdCHSP}')">Sửa</button>
                  <button class="btn btn-danger" onclick="deleteProductConfig('${config.IdCHSP}')">Xóa</button>
                </td>
              </tr>`;
          });
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }
  
  function editProductConfig(idCHSP) {
    window.location.href = `edit_productConfig.php?idCHSP=${idCHSP}`;
  }
  
  function deleteProductConfig(idCHSP) {
    if (confirm("Bạn có chắc muốn ngừng hoạt động cấu hình sản phẩm này?")) {
      fetch(`/smartstation/src/mvc/controllers/CauHinhSanPhamController.php?idCHSP=${idCHSP}`, {
        method: "GET", // Lấy thông tin cấu hình trước
      })
        .then((response) => response.json())
        .then((config) => {
          if (config.TrangThai == 1) {
            // Cho phép ngừng hoạt động nếu đang hoạt động
            return fetch(`/smartstation/src/mvc/controllers/CauHinhSanPhamController.php?idCHSP=${idCHSP}`, {
              method: "DELETE",
            });
          } else {
            // Cấu hình đã ngừng hoạt động
            toast({
              title: "Lỗi",
              message: "Cấu hình sản phẩm không còn hoạt động. Ngừng hoạt động thất bại.",
              type: "error",
              duration: 3000,
            });
            throw new Error("Cấu hình sản phẩm không còn hoạt động.");
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
          loadProductConfigs(); // Tải lại danh sách
        })
        .catch((error) => {
          console.error("Error:", error);
          // Các lỗi đã hiển thị toast ở trên nên không cần hiện lại
        });
    }
  }
  
  // Gọi khi script được tải
  loadProductConfigs();