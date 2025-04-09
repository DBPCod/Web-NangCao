function loadWarranties() {
    fetch("/smartstation/src/mvc/controllers/BaohanhController.php", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network error: " + response.status);
        return response.json();
      })
      .then((warranties) => {
        const tbody = document.getElementById("warrantyTableBody");
        tbody.innerHTML = "";
        if (!warranties || warranties.length === 0) {
          tbody.innerHTML = '<tr><td colspan="4">Không có bảo hành nào</td></tr>';
        } else {
          warranties.forEach((warranty) => {
            tbody.innerHTML += `
              <tr>
                <td>${warranty.IdBaoHanh}</td>
                <td>${warranty.ThoiGianBaoHanh}</td>
                <td>${warranty.TrangThai == 1 ? "Hoạt động" : "Ngừng hoạt động"}</td>
                <td>
                  <button class="btn btn-primary" onclick="editWarranty('${warranty.IdBaoHanh}')">Sửa</button>
                  <button class="btn btn-danger" onclick="deleteWarranty('${warranty.IdBaoHanh}')">Xóa</button>
                </td>
              </tr>`;
          });
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }
  
  function editWarranty(idBaoHanh) {
    window.location.href = `edit_warranty.php?idBaoHanh=${idBaoHanh}`;
  }
  
  function deleteWarranty(idBaoHanh) {
    if (confirm("Bạn có chắc muốn xóa bảo hành này?")) {
      fetch(
        `/smartstation/src/mvc/controllers/BaohanhController.php?idBaoHanh=${idBaoHanh}`,
        {
          method: "GET", // Lấy thông tin bảo hành trước
        }
      )
        .then((response) => response.json())
        .then((warranty) => {
          if (warranty.TrangThai == 1) {
            // ✅ Cho phép xóa: Đang hoạt động
            return fetch(
              `/smartstation/src/mvc/controllers/BaohanhController.php?idBaoHanh=${idBaoHanh}`,
              {
                method: "DELETE",
              }
            );
          } else {
            // ⚠️ Bảo hành ngừng hoạt động
            toast({
              title: "Lỗi",
              message: "Bảo hành không còn hoạt động. Xóa thất bại.",
              type: "error",
              duration: 3000,
            });
            throw new Error("Bảo hành không còn hoạt động. Xóa thất bại.");
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
          loadWarranties();
        })
        .catch((error) => {
          console.error("Error:", error);
          // Các lỗi đã hiển thị toast ở trên nên không cần hiện lại nữa
        });
    }
  }
  
  // Gọi khi script được tải
  loadWarranties();