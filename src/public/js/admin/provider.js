var PROVIDERS_PER_PAGE = 5; // Số lượng nhà cung cấp mỗi trang
var currentPage = 1; // Trang hiện tại
var allProviders = []; // Lưu trữ toàn bộ dữ liệu nhà cung cấp

// Hàm toast từ code của bạn
function toast({ title = '', message = '', type = 'info', duration = 3000 }) {
  const main = document.getElementById('toast');
  if (main) {
      const toast = document.createElement('div');

      // Tự động xóa sau duration + thời gian fade out
      const autoRemoveId = setTimeout(() => {
          main.removeChild(toast);
      }, duration + 1500); // Tăng thêm 1500ms để khớp với fadeOut mới

      // Xóa khi click
      toast.onclick = function (e) {
          if (e.target.closest('.toast__close')) {
              main.removeChild(toast);
              clearTimeout(autoRemoveId);
          }
      };

      const icons = {
          success: 'fa-solid fa-circle-check',
          info: 'fa-solid fa-circle-info',
          warning: 'fa-solid fa-circle-exclamation',
          error: 'fa-solid fa-circle-exclamation'
      };
      const icon = icons[type];
      const delay = (duration / 1000).toFixed(2); // Thời gian chờ trước khi fade out (giây)

      toast.classList.add('toast', `toast--${type}`);
      toast.style.animation = `appear ease-in-out 0.5s, fadeOut ease-in-out 1.5s ${delay}s forwards`;
      toast.innerHTML = `
          <div class="toast__icon">
              <i class="${icon}"></i>
          </div>
          <div class="toast__body">
              <h3 class="toast__title">${title}</h3>
              <p class="toast__message">${message}</p>
          </div>
          <div class="toast__close">   
              <i class="fa-solid fa-xmark"></i>
          </div>
      `;
      main.appendChild(toast);
  }
}

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
          allProviders = providers; // Lưu dữ liệu vào biến toàn cục
          renderProvidersByPage(currentPage); // Render trang đầu tiên
          renderPagination(); // Render nút phân trang
      })
      .catch((error) => {
          console.error("Fetch error:", error);
          document.getElementById("providerTableBody").innerHTML =
              '<tr><td colspan="7">Đã xảy ra lỗi khi tải dữ liệu.</td></tr>';
          toast({
              title: "Lỗi",
              message: "Không thể tải danh sách nhà cung cấp",
              type: "error",
              duration: 3000,
          });
      });
}

// Render danh sách nhà cung cấp theo trang
function renderProvidersByPage(page) {
  const tbody = document.getElementById("providerTableBody");
  tbody.innerHTML = "";

  if (!allProviders || allProviders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">Không có nhà cung cấp nào</td></tr>';
      return;
  }

  // Tính toán chỉ số bắt đầu và kết thúc của dữ liệu trên trang hiện tại
  const startIndex = (page - 1) * PROVIDERS_PER_PAGE;
  const endIndex = startIndex + PROVIDERS_PER_PAGE;
  const providersToDisplay = allProviders.slice(startIndex, endIndex);

  providersToDisplay.forEach((provider) => {
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

// Render nút phân trang
function renderPagination() {
  const totalPages = Math.ceil(allProviders.length / PROVIDERS_PER_PAGE);
  const paginationContainer = document.querySelector("#pagination");
  paginationContainer.innerHTML = "";

  // Nút Previous
  const prevButton = document.createElement("button");
  prevButton.className = "btn btn-secondary mx-1";
  prevButton.textContent = "Previous";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
          currentPage--;
          renderProvidersByPage(currentPage);
          renderPagination();
      }
  });
  paginationContainer.appendChild(prevButton);

  // Nút số trang
  for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.className = `btn mx-1 ${i === currentPage ? "btn-primary" : "btn-secondary"}`;
      pageButton.textContent = i;
      pageButton.addEventListener("click", () => {
          currentPage = i;
          renderProvidersByPage(currentPage);
          renderPagination();
      });
      paginationContainer.appendChild(pageButton);
  }

  // Nút Next
  const nextButton = document.createElement("button");
  nextButton.className = "btn btn-secondary mx-1";
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
          currentPage++;
          renderProvidersByPage(currentPage);
          renderPagination();
      }
  });
  paginationContainer.appendChild(nextButton);
}

// Mở modal để thêm nhà cung cấp
function openAddModal() {
  document.getElementById("providerModalLabel").innerText = "Thêm nhà cung cấp";
  document.getElementById("providerForm").reset();
  document.getElementById("saveProviderBtn").setAttribute("data-action", "add");
  document.getElementById("saveProviderBtn").removeAttribute("data-id");
}

// Mở modal để sửa nhà cung cấp
function openEditModal(idProvider) {
  fetch(`/smartstation/src/mvc/controllers/NhaCungCapController.php?idNCC=${idProvider}`, {
      method: "GET",
  })
      .then((response) => {
          if (!response.ok) throw new Error("Network error: " + response.status);
          return response.json();
      })
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
      .catch((error) => {
          console.error("Error fetching provider:", error);
          toast({
              title: "Lỗi",
              message: "Không thể tải thông tin nhà cung cấp",
              type: "error",
              duration: 3000,
          });
      });
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

// Gọi khi script được tải
loadProviders();