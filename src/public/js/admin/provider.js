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
                  <button class="btn btn-primary" onclick="editProvider('${provider.IdNCC}')">Sửa</button>
                  <button class="btn btn-danger" onclick="deleteProvider('${provider.IdNCC}')">Xóa</button>
                </td>
              </tr>`;
          });
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }
  
  function editProvider(idProvider) {
    window.location.href = `edit_provider.php?idProvider=${idProvider}`;
  }
  
  function deleteProvider(idProvider) {
    if (confirm("Bạn có chắc muốn xóa nhà cung cấp này?")) {
      fetch(
        `/smartstation/src/mvc/controllers/NhaCungCapController.php?idNCC=${idProvider}`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((provider) => {
          if (provider.TrangThai == 1) {
            return fetch(
              `/smartstation/src/mvc/controllers/NhaCungCapController.php?idNCC=${idProvider}`,
              {
                method: "DELETE",
              }
            );
          } else {
            toast({
              title: "Lỗi",
              message: "Nhà cung cấp không còn hoạt động. Xóa thất bại.",
              type: "error",
              duration: 3000,
            });
            throw new Error("Nhà cung cấp không còn hoạt động. Xóa thất bại.");
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
          loadProviders();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
  
  // Gọi khi script được tải
  loadProviders();