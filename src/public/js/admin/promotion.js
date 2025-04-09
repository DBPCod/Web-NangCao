function loadPromotions() {
    fetch("/smartstation/src/mvc/controllers/KhuyenMaiController.php", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network error: " + response.status);
        return response.json();
      })
      .then((promotions) => {
        const tbody = document.getElementById("promotionTableBody");
        tbody.innerHTML = "";
        if (!promotions || promotions.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5"> Không có khuyến mãi nào</td></tr>';
        } else {
          promotions.forEach((promotion) => {
            tbody.innerHTML += `
              <tr>
                <td>${promotion.IdKhuyenMai}</td>
                <td>${promotion.NgayBatDau}</td>
                <td>${promotion.NgayKetThuc}</td>
                <td>${promotion.PhanTramGiam}%</td>
                <td>${promotion.TrangThai == 1 ? "Hoạt động" : "Ngừng hoạt động"}</td>
                <td>
                  <button class="btn btn-primary" onclick="editPromotion('${promotion.IdKhuyenMai}')">Sửa</button>
                  <button class="btn btn-danger" onclick="deletePromotion('${promotion.IdKhuyenMai}')">Xóa</button>
                </td>
              </tr>`;
          });
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }
  
  function editPromotion(idKhuyenMai) {
    window.location.href = `edit_promotion.php?idKhuyenMai=${idKhuyenMai}`;
  }
  
  function deletePromotion(idKhuyenMai) {
    if (confirm("Bạn có chắc muốn ngừng hoạt động khuyến mãi này?")) {
      fetch(`/smartstation/src/mvc/controllers/KhuyenMaiController.php?idKhuyenMai=${idKhuyenMai}`, {
        method: "GET", // Lấy thông tin khuyến mãi trước
      })
        .then((response) => response.json())
        .then((promotion) => {
          if (promotion.TrangThai == 1) {
            // Cho phép ngừng hoạt động nếu đang hoạt động
            return fetch(`/smartstation/src/mvc/controllers/KhuyenMaiController.php?idKhuyenMai=${idKhuyenMai}`, {
              method: "DELETE",
            });
          } else {
            // Khuyến mãi đã ngừng hoạt động
            toast({
              title: "Lỗi",
              message: "Khuyến mãi không còn hoạt động. Ngừng hoạt động thất bại.",
              type: "error",
              duration: 3000,
            });
            throw new Error("Khuyến mãi không còn hoạt động.");
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
          loadPromotions(); // Tải lại danh sách
        })
        .catch((error) => {
          console.error("Error:", error);
          // Các lỗi đã hiển thị toast ở trên nên không cần hiện lại
        });
    }
  }
  
  // Gọi khi script được tải
  loadPromotions();