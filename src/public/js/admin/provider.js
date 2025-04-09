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
        .catch((error) => {
            console.error("Fetch error:", error);
            toast({
                title: "Lỗi",
                message: "Không thể tải danh sách nhà cung cấp",
                type: "error",
                duration: 3000,
            });
        });
}

// Mở modal để thêm nhà cung cấp
function openAddModal() {
    document.getElementById("providerModalLabel").innerText = "Thêm nhà cung cấp";
    document.getElementById("providerForm").reset();
    document.getElementById("saveProviderBtn").setAttribute("data-action", "add");
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