// Số lượng người dùng mỗi trang
var USERS_PER_PAGE = 8;
var currentPage = 1;
var allUsers = []; // Lưu trữ toàn bộ dữ liệu người dùng

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
            allUsers = data; // Lưu dữ liệu vào biến toàn cục
            renderUsersByPage(currentPage); // Render trang đầu tiên
            renderPagination(); // Render nút phân trang
        })
        .catch((error) => {
            console.error("Error fetching users:", error);
            document.querySelector("tbody").innerHTML =
                '<tr><td colspan="8" class="text-center">Đã xảy ra lỗi khi tải dữ liệu.</td></tr>';
        });
}

// Hàm để render dữ liệu người dùng theo trang
function renderUsersByPage(page) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    if (allUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Không có khách hàng nào.</td></tr>';
        return;
    }

    // Tính toán chỉ số bắt đầu và kết thúc của dữ liệu trên trang hiện tại
    const startIndex = (page - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    const usersToDisplay = allUsers.slice(startIndex, endIndex);

    const userPromises = usersToDisplay.map((user) => {
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

    Promise.all(userPromises).then((usersWithAccount) => {
        usersWithAccount.forEach((user) => {
            const tr = document.createElement("tr");
            const buttonText = user.TrangThai == 1 ? "Khóa" : "Mở khóa";
            const buttonClass = user.TrangThai == 1 ? "btn-danger" : "btn-success";
            tr.innerHTML = `
                <td>${user.IdNguoiDung}</td>
                <td>${user.HoVaTen}</td>
                <td>${user.Email}</td>
                <td>${user.DiaChi || "Chưa có"}</td>
                <td>${user.SoDienThoai || "Chưa có"}</td>
                <td class="status">${user.TrangThai == 1 ? "Đang hoạt động" : "Ngừng hoạt động"}</td>
                <td>${user.TaiKhoan}</td>
                <td>
                    <button class="btn ${buttonClass} btn-toggle-lock" data-id="${user.IdNguoiDung}" data-status="${user.TrangThai}">
                        ${buttonText}
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Gắn sự kiện sau khi render
        attachEventListeners();
    });
}

// Hàm để render nút phân trang
function renderPagination() {
    const totalPages = Math.ceil(allUsers.length / USERS_PER_PAGE);
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
            renderUsersByPage(currentPage);
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
            renderUsersByPage(currentPage);
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
            renderUsersByPage(currentPage);
            renderPagination();
        }
    });
    paginationContainer.appendChild(nextButton);
}

// Hàm gắn sự kiện cho các nút khóa/mở khóa
function attachEventListeners() {
    document.querySelectorAll(".btn-toggle-lock").forEach((button) => {
        button.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            const currentStatus = parseInt(this.getAttribute("data-status"));
            const newStatus = currentStatus === 1 ? 0 : 1;
            const action = newStatus === 0 ? "khóa" : "mở khóa";

            if (confirm(`Bạn có chắc muốn ${action} khách hàng này?`)) {
                toggleUserLock(id, newStatus, this);
            }
        });
    });
}

// Hàm thay đổi trạng thái khóa/mở khóa
function toggleUserLock(id, newStatus, button) {
    fetch(`/smartstation/src/mvc/controllers/NguoiDungController.php?idNguoiDung=${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            TrangThai: newStatus,
        }),
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                // Cập nhật giao diện ngay lập tức
                button.textContent = newStatus === 1 ? "Khóa" : "Mở khóa";
                button.classList.remove(newStatus === 1 ? "btn-success" : "btn-danger");
                button.classList.add(newStatus === 1 ? "btn-danger" : "btn-success");
                button.setAttribute("data-status", newStatus);

                // Cập nhật cột Trạng thái
                const statusCell = button.closest("tr").querySelector(".status");
                statusCell.textContent = newStatus === 1 ? "Đang hoạt động" : "Ngừng hoạt động";

                // Cập nhật dữ liệu trong allUsers
                const userIndex = allUsers.findIndex((user) => user.IdNguoiDung == id);
                if (userIndex !== -1) {
                    allUsers[userIndex].TrangThai = newStatus;
                }

                alert(data.message);
            } else {
                alert("Thay đổi trạng thái thất bại: " + data.message);
            }
        })
        .catch((error) => {
            console.error("Error toggling user lock:", error);
            alert("Đã xảy ra lỗi khi thay đổi trạng thái.");
        });
}

// Gọi hàm để tải danh sách người dùng khi trang được tải
fetchAndRenderUsers();