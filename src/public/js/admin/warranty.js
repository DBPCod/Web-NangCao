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
                          <td class="text-center">
                              <button class="btn btn-primary" onclick="editWarranty('${warranty.IdBaoHanh}')">Sửa</button>
                              <button class="btn btn-danger" onclick="deleteWarranty('${warranty.IdBaoHanh}')">Xóa</button>
                          </td>
                      </tr>`;
              });
          }
      })
      .catch((error) => console.error("Fetch error:", error));
}

function addWarranty() {
  const form = document.getElementById("addWarrantyForm");
  const thoiGianBaoHanh = form.querySelector("#thoiGianBaoHanh").value;

  if (!thoiGianBaoHanh || isNaN(thoiGianBaoHanh) || thoiGianBaoHanh <= 0) {
      toast({
          title: "Lỗi",
          message: "Thời gian bảo hành phải là một số dương hợp lệ.",
          type: "error",
          duration: 3000,
      });
      return;
  }

  fetch("/smartstation/src/mvc/controllers/BaohanhController.php", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          ThoiGianBaoHanh: parseInt(thoiGianBaoHanh),
          TrangThai: 1,
      }),
  })
      .then((response) => {
          if (!response.ok) throw new Error("Network error: " + response.status);
          return response.json();
      })
      .then((data) => {
          toast({
              title: "Thành công",
              message: data.message,
              type: "success",
              duration: 3000,
          });
          loadWarranties();
          bootstrap.Modal.getInstance(document.getElementById("addWarrantyModal")).hide();
          form.reset();
      })
      .catch((error) => {
          console.error("Error:", error);
          toast({
              title: "Lỗi",
              message: "Thêm bảo hành thất bại.",
              type: "error",
              duration: 3000,
          });
      });
}

// Hàm sửa bảo hành (hiển thị modal)
function editWarranty(idBaoHanh) {
  fetch(`/smartstation/src/mvc/controllers/BaohanhController.php?idBaoHanh=${idBaoHanh}`, {
      method: "GET",
  })
      .then((response) => {
          if (!response.ok) throw new Error("Network error: " + response.status);
          return response.json();
      })
      .then((warranty) => {
          // Điền dữ liệu hiện tại vào form
          document.getElementById("editIdBaoHanh").value = warranty.IdBaoHanh;
          document.getElementById("editThoiGianBaoHanh").value = warranty.ThoiGianBaoHanh;

          // Hiển thị modal
          const modal = new bootstrap.Modal(document.getElementById("editWarrantyModal"));
          modal.show();
      })
      .catch((error) => {
          console.error("Error:", error);
          toast({
              title: "Lỗi",
              message: "Không thể tải thông tin bảo hành.",
              type: "error",
              duration: 3000,
          });
      });
}

// Hàm cập nhật bảo hành
function updateWarranty() {
  const form = document.getElementById("editWarrantyForm");
  const idBaoHanh = form.querySelector("#editIdBaoHanh").value;
  const thoiGianBaoHanh = form.querySelector("#editThoiGianBaoHanh").value;

  if (!thoiGianBaoHanh || isNaN(thoiGianBaoHanh) || thoiGianBaoHanh <= 0) {
      toast({
          title: "Lỗi",
          message: "Thời gian bảo hành phải là một số dương hợp lệ.",
          type: "error",
          duration: 3000,
      });
      return;
  }

  // Lấy TrangThai hiện tại để giữ nguyên
  fetch(`/smartstation/src/mvc/controllers/BaohanhController.php?idBaoHanh=${idBaoHanh}`, {
      method: "GET",
  })
      .then((response) => response.json())
      .then((warranty) => {
          fetch(`/smartstation/src/mvc/controllers/BaohanhController.php?idBaoHanh=${idBaoHanh}`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  IdBaoHanh: parseInt(idBaoHanh),
                  ThoiGianBaoHanh: parseInt(thoiGianBaoHanh),
                  TrangThai: parseInt(warranty.TrangThai), // Giữ nguyên TrangThai
              }),
          })
              .then((response) => {
                  if (!response.ok) throw new Error("Network error: " + response.status);
                  return response.json();
              })
              .then((data) => {
                  toast({
                      title: "Thành công",
                      message: data.message,
                      type: "success",
                      duration: 3000,
                  });
                  loadWarranties();
                  bootstrap.Modal.getInstance(document.getElementById("editWarrantyModal")).hide();
              })
              .catch((error) => {
                  console.error("Error:", error);
                  toast({
                      title: "Lỗi",
                      message: "Cập nhật bảo hành thất bại.",
                      type: "error",
                      duration: 3000,
                  });
              });
      });
}

function deleteWarranty(idBaoHanh) {
  if (confirm("Bạn có chắc muốn xóa bảo hành này? (Trạng thái sẽ được đặt về Ngừng hoạt động)")) {
      fetch(`/smartstation/src/mvc/controllers/BaohanhController.php?idBaoHanh=${idBaoHanh}`, {
          method: "GET",
      })
          .then((response) => response.json())
          .then((warranty) => {
              if (warranty.TrangThai == 1) {
                  return fetch(`/smartstation/src/mvc/controllers/BaohanhController.php?idBaoHanh=${idBaoHanh}`, {
                      method: "DELETE",
                  });
              } else {
                  toast({
                      title: "Lỗi",
                      message: "Bảo hành đã ngừng hoạt động, không thể xóa.",
                      type: "error",
                      duration: 3000,
                  });
                  throw new Error("Bảo hành đã ngừng hoạt động.");
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
          });
  }
}

// Gọi khi script được tải
loadWarranties();