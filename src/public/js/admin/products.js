// Hàm tải danh sách sản phẩm
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
              tbody.innerHTML = '<tr><td colspan="6">Không có sản phẩm nào</td></tr>';
          } else {
              Promise.all(products.map(product => 
                  Promise.all([
                      fetch(`/smartstation/src/mvc/controllers/DongSanPhamController.php?idDSP=${product.IdDongSanPham}`).then(res => res.json()),
                      fetch(`/smartstation/src/mvc/controllers/CauHinhSanPhamController.php?idCHSP=${product.IdCHSP}`).then(res => res.json())
                  ])
                  .then(([dongSanPham, cauHinh]) => ({
                      ...product,
                      TenDong: dongSanPham.TenDong,
                      Ram: cauHinh.Ram,
                      Rom: cauHinh.Rom,
                      MauSac: cauHinh.MauSac
                  }))
              ))
              .then(productsWithDetails => {
                  productsWithDetails.forEach((product) => {
                      tbody.innerHTML += `
                          <tr onclick="showProductDetail('${product.IdCHSP}', '${product.IdDongSanPham}')" style="cursor: pointer;">
                              <td>${product.TenDong}</td>
                              <td>${product.Ram}</td>
                              <td>${product.Rom}</td>
                              <td>${product.MauSac}</td>
                              <td>${product.Gia.toLocaleString('vi-VN')} VNĐ</td>
                              <td>
                                  <button class="btn btn-primary" onclick="editProduct('${product.IdCHSP}', '${product.IdDongSanPham}'); event.stopPropagation();">Sửa</button>
                                  <button class="btn btn-danger" onclick="deleteProduct('${product.IdCHSP}', '${product.IdDongSanPham}'); event.stopPropagation();">Xóa</button>
                              </td>
                          </tr>`;
                  });
              });
          }
      })
      .catch((error) => console.error("Fetch error:", error));
}

// Hàm tải danh sách dòng sản phẩm vào modal thêm
function loadDongSanPhamOptions() {
  fetch("/smartstation/src/mvc/controllers/DongSanPhamController.php", { method: "GET" })
      .then(response => response.json())
      .then(dongSanPhams => {
          const select = document.getElementById("idDongSanPham");
          select.innerHTML = '<option value="">Chọn dòng sản phẩm</option>';
          dongSanPhams.forEach(dsp => {
              select.innerHTML += `<option value="${dsp.IdDongSanPham}">${dsp.TenDong}</option>`;
          });
      });
}

// Hàm tải danh sách cấu hình sản phẩm vào modal thêm
function loadCauHinhOptions() {
  fetch("/smartstation/src/mvc/controllers/CauHinhSanPhamController.php", { method: "GET" })
      .then(response => response.json())
      .then(cauHinhs => {
          const select = document.getElementById("idCHSP");
          select.innerHTML = '<option value="">Chọn cấu hình</option>';
          cauHinhs.forEach(ch => {
              select.innerHTML += `<option value="${ch.IdCHSP}">${ch.Ram} - ${ch.Rom} - ${ch.MauSac}</option>`;
          });

          select.onchange = function() {
              const selectedId = this.value;
              if (selectedId) {
                  fetch(`/smartstation/src/mvc/controllers/CauHinhSanPhamController.php?idCHSP=${selectedId}`)
                      .then(res => res.json())
                      .then(cauHinh => {
                          document.getElementById("addRam").textContent = cauHinh.Ram;
                          document.getElementById("addRom").textContent = cauHinh.Rom;
                          document.getElementById("addManHinh").textContent = cauHinh.ManHinh;
                          document.getElementById("addPin").textContent = cauHinh.Pin;
                          document.getElementById("addMauSac").textContent = cauHinh.MauSac;
                          document.getElementById("addCamera").textContent = cauHinh.Camera;
                      });
              } else {
                  document.getElementById("addRam").textContent = "";
                  document.getElementById("addRom").textContent = "";
                  document.getElementById("addManHinh").textContent = "";
                  document.getElementById("addPin").textContent = "";
                  document.getElementById("addMauSac").textContent = "";
                  document.getElementById("addCamera").textContent = "";
              }
          };
      });
}

// Hàm hiển thị modal thêm sản phẩm
function showAddProductModal() {
  document.getElementById("addProductForm").reset();
  document.getElementById("soLuong").value = 0;
  document.getElementById("addRam").textContent = "";
  document.getElementById("addRom").textContent = "";
  document.getElementById("addManHinh").textContent = "";
  document.getElementById("addPin").textContent = "";
  document.getElementById("addMauSac").textContent = "";
  document.getElementById("addCamera").textContent = "";
  loadDongSanPhamOptions();
  loadCauHinhOptions();
}

// Hàm thêm sản phẩm
function submitAddProduct() {
  const idDongSanPham = document.getElementById("idDongSanPham").value;
  const idCHSP = document.getElementById("idCHSP").value;
  const soLuong = document.getElementById("soLuong").value;

  if (!idDongSanPham || !idCHSP) {
      toast({
          title: "Cảnh báo",
          message: "Vui lòng chọn dòng sản phẩm và cấu hình!",
          type: "warning",
          duration: 3000,
      });
      return;
  }

  const data = {
      IdDongSanPham: idDongSanPham,
      IdCHSP: idCHSP,
      SoLuong: parseInt(soLuong),
      Gia: 0,
      TrangThai: 1
  };

  fetch("/smartstation/src/mvc/controllers/SanPhamController.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
  })
      .then(response => {
          if (!response.ok) throw new Error("Network error");
          return response.json();
      })
      .then(data => {
          toast({
              title: "Thành công",
              message: data.message,
              type: "success",
              duration: 3000,
          });
          bootstrap.Modal.getInstance(document.getElementById("addProductModal")).hide();
          loadProducts();
      })
      .catch(error => {
          console.error("Error:", error);
          toast({
              title: "Cảnh báo",
              message: "Thêm sản phẩm thất bại",
              type: "warning",
              duration: 3000,
          });
      });
}

// Hàm hiển thị chi tiết sản phẩm
function showProductDetail(idCHSP, idDSP) {
  Promise.all([
      fetch(`/smartstation/src/mvc/controllers/SanPhamController.php?idCHSP=${idCHSP}&idDSP=${idDSP}`).then(res => res.json()),
      fetch(`/smartstation/src/mvc/controllers/DongSanPhamController.php?idDSP=${idDSP}`).then(res => res.json()),
      fetch(`/smartstation/src/mvc/controllers/CauHinhSanPhamController.php?idCHSP=${idCHSP}`).then(res => res.json()),
      fetch(`/smartstation/src/mvc/controllers/ThuongHieuController.php?idThuongHieu=${idDSP}`).then(res => res.json().then(th => th.IdThuongHieu ? th : fetch(`/smartstation/src/mvc/controllers/DongSanPhamController.php?idDSP=${idDSP}`).then(r => r.json().then(d => ({ TenThuongHieu: "Không xác định" }))))),
      fetch(`/smartstation/src/mvc/controllers/AnhController.php?idCHSP=${idCHSP}&idDSP=${idDSP}`).then(res => res.json())
  ])
  .then(([sanPham, dongSanPham, cauHinh, thuongHieu, anhList]) => {
      document.getElementById("detailTenDong").textContent = dongSanPham.TenDong;
      document.getElementById("detailSoLuong").textContent = sanPham.SoLuong;
      document.getElementById("detailGia").textContent = sanPham.Gia.toLocaleString('vi-VN') + " VNĐ";
      document.getElementById("detailThuongHieu").textContent = thuongHieu.TenThuongHieu;
      document.getElementById("detailRam").textContent = cauHinh.Ram;
      document.getElementById("detailRom").textContent = cauHinh.Rom;
      document.getElementById("detailManHinh").textContent = cauHinh.ManHinh;
      document.getElementById("detailPin").textContent = cauHinh.Pin;
      document.getElementById("detailMauSac").textContent = cauHinh.MauSac;
      document.getElementById("detailCamera").textContent = cauHinh.Camera;

      const imagesDiv = document.getElementById("productImages");
      imagesDiv.innerHTML = "";
      if (anhList.length > 0) {
          anhList.forEach((anh, index) => {
              const isActive = index === 0 ? "active" : ""; // Ảnh đầu tiên là active
              const imgSrc = `data:image/jpeg;base64,${anh.Anh}`;
              imagesDiv.innerHTML += `
                  <div class="carousel-item ${isActive}">
                      <img src="${imgSrc}" class="d-block w-100" alt="Ảnh sản phẩm" style="max-height: 300px; object-fit: contain;">
                  </div>`;
          });
      } else {
          imagesDiv.innerHTML = `
              <div class="carousel-item active">
                  <div class="text-center p-3">Không có ảnh</div>
              </div>`;
      }

      new bootstrap.Modal(document.getElementById("productDetailModal")).show();
  })
  .catch(error => {
      console.error("Error:", error);
      toast({
          title: "Cảnh báo",
          message: "Không thể tải chi tiết sản phẩm",
          type: "warning",
          duration: 3000,
      });
  });
}

// Hàm sửa sản phẩm
function editProduct(idCHSP, idDSP) {
  window.location.href = `edit_product.php?idCHSP=${idCHSP}&idDSP=${idDSP}`;
}

// Hàm xóa sản phẩm
function deleteProduct(idCHSP, idDSP) {
  if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      fetch(`/smartstation/src/mvc/controllers/SanPhamController.php?idCHSP=${idCHSP}&idDSP=${idDSP}`, {
          method: "GET",
      })
          .then(response => response.json())
          .then(product => {
              if (product.SoLuong === 0) {
                  if (product.TrangThai == 1) {
                      return fetch(`/smartstation/src/mvc/controllers/SanPhamController.php?idCHSP=${idCHSP}&idDSP=${idDSP}`, {
                          method: "DELETE",
                      });
                  } else {
                      throw new Error("Sản phẩm không còn hoạt động. Xóa thất bại.");
                  }
              } else {
                  throw new Error("Chỉ được xóa sản phẩm khi số lượng = 0");
              }
          })
          .then(response => response.json())
          .then(data => {
              toast({
                  title: "Thành công",
                  message: data.message,
                  type: "success",
                  duration: 3000,
              });
              loadProducts();
          })
          .catch(error => {
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

// Gắn sự kiện cho nút "Thêm sản phẩm"
document.querySelector('[data-bs-target="#addProductModal"]').addEventListener("click", showAddProductModal);

// Gọi khi script được tải
loadProducts();