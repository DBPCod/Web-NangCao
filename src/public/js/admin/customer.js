

    // Hàm để lấy và render danh sách người dùng
    function fetchAndRenderUsers() {
        fetch("/smartstation/src/mvc/controllers/NguoiDungController.php", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                renderUsers(data);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                document.querySelector("tbody").innerHTML =
                    '<tr><td colspan="9" class="text-center">Đã xảy ra lỗi khi tải dữ liệu.</td></tr>';
            });
    }

    // Hàm để render dữ liệu vào bảng
    function renderUsers(users) {
        const tbody = document.querySelector("tbody");
        tbody.innerHTML = "";
    
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center">Không có khách hàng nào.</td></tr>';
            return;
        }
    
        // Tạo một mảng các Promise
        const userPromises = users.map((user) => {
            return fetch(`/smartstation/src/mvc/controllers/TaiKhoanController.php?idNguoiDung=${user.IdNguoiDung}`)
                .then((response) => response.json())
                .then((data) => {
                    return {
                        ...user,
                        TaiKhoan: data.TaiKhoan || "Chưa có",
                    };
                })
                .catch(() => ({
                    ...user,
                    TaiKhoan: "Lỗi khi lấy tài khoản",
                }));
        });
    
        // Chờ tất cả fetch hoàn tất
        Promise.all(userPromises).then((usersWithAccount) => {
            usersWithAccount.forEach((user) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${user.IdNguoiDung}</td>
                    <td>${user.HoVaTen}</td>
                    <td>${user.Email}</td>
                    <td>${user.DiaChi || "Chưa có"}</td>
                    <td>${user.SoDienThoai || "Chưa có"}</td>
                    <td>${user.TrangThai == 1 ? "Đang hoạt động" : "Ngừng hoạt động"}</td>
                    <td>${user.TaiKhoan}</td>
                    <td>
                        <button class="btn btn-danger btn-delete" data-id="${user.IdNguoiDung}">Xóa</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
    
            // Gắn sự kiện sau khi render
            attachEventListeners();
        });
    }
    

    // Hàm gắn sự kiện cho các nút
    function attachEventListeners() {
        // Sự kiện nút Sửa
        document.querySelectorAll(".btn-edit").forEach((button) => {
            button.addEventListener("click", function () {
                const id = this.getAttribute("data-id");
                alert(`Chức năng sửa cho khách hàng ID: ${id} đang được phát triển!`);
                // Bạn có thể thêm logic để mở form sửa ở đây
            });
        });

        // Sự kiện nút Xóa
        document.querySelectorAll(".btn-delete").forEach((button) => {
            button.addEventListener("click", function () {
                console.log("a");
                const id = this.getAttribute("data-id");
                if (confirm("Bạn có chắc muốn xóa khách hàng này?")) {
                    deleteUser(id);
                }
            });
        });
    }

    // Hàm xóa người dùng
    function deleteUser(id) {
        fetch(`/smartstation/src/mvc/controllers/NguoiDungController.php?idNguoiDung=${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.message === "Xóa thành công") {
                    alert("Xóa thành công!");
                    fetchAndRenderUsers(); // Tải lại danh sách sau khi xóa
                } else {
                    alert("Xóa thất bại: " + data.message);
                }
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
                alert("Đã xảy ra lỗi khi xóa khách hàng.");
            });
    }


    // Gọi hàm để tải danh sách người dùng khi trang được tải
    fetchAndRenderUsers();

