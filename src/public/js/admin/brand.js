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
          tbody.innerHTML = '<tr><td colspan="3">Không có thương hiệu nào</td></tr>';
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
  
  function editBrand(idThuongHieu) {
    window.location.href = `edit_brand.php?idThuongHieu=${idThuongHieu}`;
  }
  
  function deleteBrand(idThuongHieu) {
    if (confirm("Bạn có chắc muốn ngừng hoạt động thương hiệu này?")) {
      fetch(`/smartstation/src/mvc/controllers/ThuongHieuController.php?idThuongHieu=${idThuongHieu}`, {
        method: "GET", // Lấy thông tin thương hiệu trước
      })
        .then((response) => response.json())
        .then((brand) => {
          if (brand.TrangThai == 1) {
            // Cho phép ngừng hoạt động nếu đang hoạt động
            return fetch(`/smartstation/src/mvc/controllers/ThuongHieuController.php?idThuongHieu=${idThuongHieu}`, {
              method: "DELETE",
            });
          } else {
            // Thương hiệu đã ngừng hoạt động
            toast({
              title: "Lỗi",
              message: "Thương hiệu không còn hoạt động. Ngừng hoạt động thất bại.",
              type: "error",
              duration: 3000,
            });
            throw new Error("Thương hiệu không còn hoạt động.");
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
          loadBrands(); // Tải lại danh sách
        })
        .catch((error) => {
          console.error("Error:", error);
          // Các lỗi đã hiển thị toast ở trên nên không cần hiện lại
        });
    }
  }
  
  // Gọi khi script được tải
  loadBrands();