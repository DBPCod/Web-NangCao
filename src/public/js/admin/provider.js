var PROVIDERS_PER_PAGE = 8; // Số lượng nhà cung cấp mỗi trang
var currentPage = 1; // Trang hiện tại
var allProviders = []; // Lưu trữ toàn bộ dữ liệu nhà cung cấp
var permissions = [];

// Hàm lấy dữ liệu quyền từ API
async function loadPermissions() {
    try {
        const response = await fetch('/smartstation/src/mvc/controllers/get_permissions.php', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Lỗi khi lấy quyền: ' + response.status);
        permissions = await response.json();
        console.log('Permissions loaded:', permissions);
    } catch (error) {
        console.error('Lỗi khi lấy quyền:', error);
        toast({
            title: "Lỗi",
            message: "Không thể tải dữ liệu quyền!",
            type: "error",
            duration: 3000,
        });
    }
}

// Hàm kiểm tra quyền
function hasPermission(permissionName, action) {
    return permissions.some(permission => 
        permission.TenQuyen === permissionName && permission[action]
    );
}

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
async function loadProviders() {

    await loadPermissions();

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

          if (!hasPermission('Nhà cung cấp', 'them')) {
            document.querySelector('.btn-success[data-bs-target="#providerModal]').style.display = 'none';
        }
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
  rows = "";

  if (!allProviders || allProviders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">Không có nhà cung cấp nào</td></tr>';
      return;
  }

  // Tính toán chỉ số bắt đầu và kết thúc của dữ liệu trên trang hiện tại
  const startIndex = (page - 1) * PROVIDERS_PER_PAGE;
  const endIndex = startIndex + PROVIDERS_PER_PAGE;
  const providersToDisplay = allProviders.slice(startIndex, endIndex);

  const hasEditPermission = hasPermission('Nhà cung cấp', 'sua');
  const hasDeletePermission = hasPermission('Nhà cung cấp', 'xoa');

  providersToDisplay.forEach((provider) => {
    let actionButtons = '';
        if (hasEditPermission) {
            actionButtons += `
                 <button class="btn btn-primary" onclick="openEditModal('${provider.IdNCC}')">Sửa</button>
            `;
        }
        if (hasDeletePermission) {
            actionButtons += `
                <button class="btn btn-danger" onclick="deleteProvider('${provider.IdNCC}')">Xóa</button>
            `;
        }
      rows += `
          <tr>
              <td>${provider.IdNCC}</td>
              <td>${provider.TenNCC}</td>
              <td>${provider.DiaChi}</td>
              <td>${provider.SoDienThoai}</td>
              <td>${provider.Email}</td>
              <td>${provider.TrangThai == 1 ? "Hoạt động" : "Ngừng hoạt động"}</td>
              <td class="text-center">
              ${actionButtons || 'Không có quyền'}
              </td>
          </tr>`;
  });
  tbody.innerHTML = rows;
}

// Render nút phân trang
function renderPagination() {
    const totalPages = Math.ceil(allProviders.length / PROVIDERS_PER_PAGE);
    const paginationContainer = document.querySelector("#pagination");
    paginationContainer.innerHTML = "";

    // Helper để thêm nút
    const addPage = (text, page, isActive = false, isDisabled = false) => {
        const btn = document.createElement("button");
        btn.innerText = text;
        btn.className = `btn mx-1 ${isActive ? 'btn-primary' : 'btn-secondary'}`;
        
        if (isDisabled) {
            btn.disabled = true;
        } else {
            btn.addEventListener("click", () => {
                currentPage = page;
                renderProvidersByPage(currentPage);
                renderPagination();
            });
        }
        paginationContainer.appendChild(btn);
    };

    // Nút "Prev" - chỉ giữ lại «
    addPage("«", currentPage - 1, false, currentPage === 1);

    // Luôn hiển thị trang đầu tiên
    addPage("1", 1, currentPage === 1);

    // Dấu ... nếu cần
    if (currentPage > 4) {
        const dots = document.createElement("span");
        dots.innerText = "...";
        dots.className = "mx-1";
        paginationContainer.appendChild(dots);
    }

    // Các trang gần currentPage
    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
        addPage(i.toString(), i, currentPage === i);
    }

    // Dấu ... nếu cần
    if (currentPage < totalPages - 3) {
        const dots = document.createElement("span");
        dots.innerText = "...";
        dots.className = "mx-1";
        paginationContainer.appendChild(dots);
    }

    // Luôn hiển thị trang cuối cùng nếu có nhiều hơn 1 trang
    if (totalPages > 1) {
        addPage(totalPages.toString(), totalPages, currentPage === totalPages);
    }

    // Nút "Next" - chỉ giữ lại »
    addPage("»", currentPage + 1, false, currentPage === totalPages);
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
