// Load danh sách nhà cung cấp
function loadProviders() {
  fetch("/smartstation/src/mvc/controllers/NhaCungCapController.php", {
      method: "GET",
  })
      .then((response) => {
          if (!response.ok) throw new Error("Network error: " + response.status);
          return response.json();
      })
      .then((providers) => {
          const tbody = document.getElementById("providerTableBody");
          tbody.innerHTML = "";
          if (!providers || providers.length === 0) {
              tbody.innerHTML = '<tr><td colspan="7">Không có nhà cung cấp nào</td></tr>';
          } else {
              providers.forEach((provider) => {
                  tbody.innerHTML += `
                      <tr>
                          <td>${provider.IdNCC}</td>
                          <td>${provider.TenNCC}</td>
                          <td>${provider.DiaChi}</td>
                          <td>${provider.SoDienThoai}</td>
                          <td>${provider.Email}</td>
                          <td>${provider.TrangThai == 1 ? "Hoạt động" : "Ngừng hoạt động"}</td>
                          <td>
                              <button class="btn btn-primary" onclick="openEditModal('${provider.IdNCC}')">Sửa</button>
                              <button class="btn btn-danger" onclick="deleteProvider('${provider.IdNCC}')">Xóa</button>
                          </td>
                      </tr>`;
              });
          }
      })
      .catch((error) => console.error("Fetch error:", error));
}

// Mở modal để thêm nhà cung cấp
function openAddModal() {
  document.getElementById("providerModalLabel").innerText = "Thêm nhà cung cấp";
  document.getElementById("providerForm").reset(); // Reset form
  document.getElementById("saveProviderBtn").setAttribute("data-action", "add");
}

// Mở modal để sửa nhà cung cấp
function openEditModal(idProvider) {
  fetch(`/smartstation/src/mvc/controllers/NhaCungCapController.php?idNCC=${idProvider}`, {
      method: "GET",
  })
      .then((response) => response.json())
      .then((provider) => {
          document.getElementById("providerModalLabel").innerText = "Sửa nhà cung cấp";
          document.getElementById("tenNCC").value = provider.TenNCC;
          document.getElementById("diaChi").value = provider.DiaChi;
          document.getElementById("soDienThoai").value = provider.SoDienThoai;
          document.getElementById("email").value = provider.Email;
          document.getElementById("trangThai").value = provider.TrangThai;
          document.getElementById("saveProviderBtn").setAttribute("data-action", "edit");
          document.getElementById("saveProviderBtn").setAttribute("data-id", idProvider);
          new bootstrap.Modal(document.getElementById("providerModal")).show();
      })
      .catch((error) => console.error("Error fetching provider:", error));
}

// Xử lý lưu (thêm hoặc sửa)
document.getElementById("saveProviderBtn").addEventListener("click", function () {
  const action = this.getAttribute("data-action");
  const idProvider = this.getAttribute("data-id");
  const formData = {
      TenNCC: document.getElementById("tenNCC").value,
      DiaChi: document.getElementById("diaChi").value,
      SoDienThoai: document.getElementById("soDienThoai").value,
      Email: document.getElementById("email").value,
      TrangThai: document.getElementById("trangThai").value,
  };

  let url = "/smartstation/src/mvc/controllers/NhaCungCapController.php";
  let method = "POST";

  if (action === "edit") {
      url += `?idNCC=${idProvider}`;
      method = "PUT";
  }

  fetch(url, {
      method: method,
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
  })
      .then((response) => response.json())
      .then((data) => {
          toast({
              title: "Thành công",
              message: data.message,
              type: "success",
              duration: 3000,
          });
          bootstrap.Modal.getInstance(document.getElementById("providerModal")).hide();
          loadProviders();
      })
      .catch((error) => {
          console.error("Error:", error);
          toast({
              title: "Lỗi",
              message: "Đã xảy ra lỗi khi lưu nhà cung cấp",
              type: "error",
              duration: 3000,
          });
      });
});

// Xóa nhà cung cấp
function deleteProvider(idProvider) {
  if (confirm("Bạn có chắc muốn xóa nhà cung cấp này?")) {
      fetch(`/smartstation/src/mvc/controllers/NhaCungCapController.php?idNCC=${idProvider}`, {
          method: "DELETE",
      })
          .then((response) => response.json())
          .then((data) => {
              toast({
                  title: "Thành công",
                  message: data.message,
                  type: "success",
                  duration: 3000,
              });
              loadProviders();
          })
          .catch((error) => {
              console.error("Error:", error);
              toast({
                  title: "Lỗi",
                  message: "Xóa thất bại",
                  type: "error",
                  duration: 3000,
              });
          });
  }
}

// Hàm toast (giả định bạn đã có sẵn hoặc cần thêm thư viện toast)
function toast({ title, message, type, duration }) {
  console.log(`${title}: ${message}`); // Thay bằng logic hiển thị toast nếu có
}

// Gọi khi script được tải
loadProviders();