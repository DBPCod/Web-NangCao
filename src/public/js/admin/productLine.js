// Hàm lấy danh sách thương hiệu và điền vào dropdown
function loadBrands() {
  fetch("/smartstation/src/mvc/controllers/ThuongHieuController.php", {
      method: "GET",
  })
      .then((response) => {
          if (!response.ok) throw new Error("Network error: " + response.status);
          return response.json();
      })
      .then((brands) => {
          const select = document.getElementById("idThuongHieu");
          select.innerHTML = '<option value="">Chọn thương hiệu</option>'; // Reset dropdown
          brands.forEach((brand) => {
              select.innerHTML += `<option value="${brand.IdThuongHieu}">${brand.TenThuongHieu}</option>`;
          });
      })
      .catch((error) => {
          console.error("Error loading brands:", error);
          toast({
              title: "Lỗi",
              message: "Không thể tải danh sách thương hiệu",
              type: "error",
              duration: 3000,
          });
      });
}

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
              tbody.innerHTML = '<tr><td colspan="6">Không có dòng sản phẩm nào</td></tr>';
          } else {
              productLines.forEach((productLine) => {
                  tbody.innerHTML += `
                      <tr>
                          <td>${productLine.IdDongSanPham}</td>
                          <td>${productLine.TenDong}</td>
                          <td>${productLine.SoLuong}</td>
                          <td>${productLine.IdThuongHieu || "Không có"}</td>
                          <td>${productLine.TrangThai == 1 ? "Hoạt động" : "Ngừng hoạt động"}</td>
                          <td>
                              <button class="btn btn-primary" onclick="openEditModal('${productLine.IdDongSanPham}')">Sửa</button>
                              <button class="btn btn-danger" onclick="deleteProductLine('${productLine.IdDongSanPham}')">Xóa</button>
                          </td>
                      </tr>`;
              });
          }
      })
      .catch((error) => console.error("Fetch error:", error));
}

function openAddModal() {
  document.getElementById("productLineModalLabel").innerText = "Thêm dòng sản phẩm";
  document.getElementById("productLineForm").reset();
  document.getElementById("idDongSanPham").disabled = false;
  const thuongHieuSelect = document.getElementById("idThuongHieu");
  thuongHieuSelect.disabled = false; // Đảm bảo dropdown luôn bật khi thêm mới
  loadBrands(); // Tải danh sách thương hiệu
}

function openEditModal(idDSP) {
  fetch(`/smartstation/src/mvc/controllers/DongSanPhamController.php?idDSP=${idDSP}`, {
      method: "GET",
  })
      .then((response) => {
          if (!response.ok) throw new Error("Network error: " + response.status);
          return response.json();
      })
      .then((productLine) => {
          document.getElementById("productLineModalLabel").innerText = "Sửa dòng sản phẩm";
          document.getElementById("idDongSanPham").value = productLine.IdDongSanPham;
          document.getElementById("idDongSanPham").disabled = true;
          document.getElementById("tenDong").value = productLine.TenDong;
          document.getElementById("soLuong").value = productLine.SoLuong;
          loadBrands();
          setTimeout(() => {
              document.getElementById("idThuongHieu").value = productLine.IdThuongHieu || "";
              document.getElementById("idThuongHieu").disabled = true; // Khóa dropdown khi sửa
          }, 100);
          document.getElementById("trangThai").value = productLine.TrangThai;
          new bootstrap.Modal(document.getElementById("productLineModal")).show();
      })
      .catch((error) => console.error("Fetch error:", error));
}

function saveProductLine() {
  const idDSP = document.getElementById("idDongSanPham").value;
  const data = {
      IdDongSanPham: idDSP,
      TenDong: document.getElementById("tenDong").value,
      SoLuong: parseInt(document.getElementById("soLuong").value),
      IdThuongHieu: document.getElementById("idThuongHieu").value ? parseInt(document.getElementById("idThuongHieu").value) : null,
      TrangThai: parseInt(document.getElementById("trangThai").value),
  };

  const method = document.getElementById("idDongSanPham").disabled ? "PUT" : "POST";
  const url = method === "PUT" 
      ? `/smartstation/src/mvc/controllers/DongSanPhamController.php?idDSP=${idDSP}` 
      : "/smartstation/src/mvc/controllers/DongSanPhamController.php";

  fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
  })
      .then((response) => {
          if (!response.ok) throw new Error("Network error: " + response.status);
          return response.json();
      })
      .then((result) => {
          toast({
              title: "Thành công",
              message: result.message,
              type: "success",
              duration: 3000,
          });
          bootstrap.Modal.getInstance(document.getElementById("productLineModal")).hide();
          loadProductLines();
      })
      .catch((error) => {
          console.error("Error:", error);
          toast({
              title: "Lỗi",
              message: "Đã xảy ra lỗi khi lưu dòng sản phẩm",
              type: "error",
              duration: 3000,
          });
      });
}

function deleteProductLine(idDSP) {
  if (confirm("Bạn có chắc muốn ngừng hoạt động dòng sản phẩm này?")) {
      fetch(`/smartstation/src/mvc/controllers/DongSanPhamController.php?idDSP=${idDSP}`, {
          method: "GET",
      })
          .then((response) => response.json())
          .then((productLine) => {
              if (productLine.SoLuong === 0) {
                  if (productLine.TrangThai == 1) {
                      return fetch(`/smartstation/src/mvc/controllers/DongSanPhamController.php?idDSP=${idDSP}`, {
                          method: "DELETE",
                      });
                  } else {
                      throw new Error("Dòng sản phẩm không còn hoạt động.");
                  }
              } else {
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
              loadProductLines();
          })
          .catch((error) => {
              console.error("Error:", error);
              toast({
                  title: error.message.includes("số lượng") ? "Cảnh báo" : "Lỗi",
                  message: error.message,
                  type: error.message.includes("số lượng") ? "warning" : "error",
                  duration: 3000,
              });
          });
  }
}

// Gọi khi script được tải
loadProductLines();