let isFiltered = false;// đặt cờ cho nút lọc
function loadTopUsers() {

    // const savedFiltered = sessionStorage.getItem("isFiltered");
    // const savedFromDate = sessionStorage.getItem("fromDate");
    // const savedToDate = sessionStorage.getItem("toDate");
    // const savedSortOrder = sessionStorage.getItem("sortOrder");

    const sortOrder = document.getElementById("sortOrder")?.value||"desc";
    sessionStorage.setItem("sortOrder",sortOrder);
    const url = `/smartstation/src/mvc/controllers/ThongKeController.php?sort=${sortOrder}`;
    fetch(url, {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then(renderTopUsers)
        .catch((error) => console.error("Fetch error:", error));
}


function filterTopUsers() {
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const sortOrder = document.getElementById("sortOrder")?.value || "desc";

    if (!fromDate || !toDate) {
        toast({
            title: 'Cảnh báo',
            message: 'Vui lòng nhập đầy đủ ngày bắt đầu và ngày kết thúc.',
            type: 'warning',
            duration: 3000
        });
        return;
    }
    if(new Date(fromDate) > new Date(toDate)){
        toast({
            title: 'Cảnh báo',
            message: 'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.',
            type: 'warning',
            duration: 3000
        });
        return;
    }
    if((new Date(toDate) > new Date) || (new Date(fromDate) > new Date)){
        toast({
            title: 'Cảnh báo',
            message: 'Không được chọn quá ngày hôm nay.',
            type: 'warning',
            duration: 3000
        });
        return;
    }

    isFiltered = true;
    // sessionStorage.setItem("isFiltered", isFiltered);
    // sessionStorage.setItem("fromDate", fromDate);
    // sessionStorage.setItem("toDate", toDate);
    // sessionStorage.setItem("sortOrder", sortOrder);

    const url = `/smartstation/src/mvc/controllers/ThongKeController.php?from=${fromDate}&to=${toDate}&sort=${sortOrder}`;

    fetch(url)
        .then((response) => {
            if (!response.ok) throw new Error("Network error: " + response.status);
            return response.json();
        })
        .then(renderTopUsers)
        .catch((error) => console.error("Fetch error:", error));
};



// Hàm render dữ liệu top user
function renderTopUsers(users) {
    const tbody = document.getElementById("topCustomersBody");
    tbody.innerHTML = "";

    if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">Không có người mua nào</td></tr>';
    } else {
        users.forEach((user, index) => {
            tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${user.HoVaTen}</td>
                    <td>${user.SoDienThoai}</td>
                    <td>${Number(user.TongMuaHang).toLocaleString()} đ</td>
                    <td>
                        <button class="btn btn-primary btn-xem-hoadon" data-id="${user.IdNguoiDung}" data-ten="${user.HoVaTen}" data-bs-toggle="modal" data-bs-target="#orderListModal">
                            Xem
                        </button>
                    </td>
                </tr>`;
        });
    }
}
function sortOrder(){
    if (isFiltered) {
        filterTopUsers(); 
    } else {
        loadTopUsers(); 
    }
};

// Bấm các nút để xem sâu hơn
document.addEventListener("click", function (e) {
    //Xem danh sách hóa đơn
    if (e.target.classList.contains("btn-xem-hoadon")) {
        const idNguoiDung = e.target.dataset.id;
        const tenKhach = e.target.dataset.ten;
        const fromDate = document.getElementById("fromDate").value;
        const toDate = document.getElementById("toDate").value;

        // Đổi tiêu đề modal theo tên khách
        document.getElementById("orderListModalLabel").textContent = `Danh sách đơn hàng của khách hàng: ${tenKhach}`;

        let url = `/smartstation/src/mvc/controllers/ThongKeController.php?idNguoiDung=${idNguoiDung}`;

        if ((fromDate && toDate) && isFiltered) {
             url += `&from=${fromDate}&to=${toDate}`;
        }
        // Gọi controller để lấy danh sách hóa đơn
        fetch(url)
            .then((response) => {
                if (!response.ok) throw new Error("Network error: " + response.status);
                return response.json();
            })
            .then((orders) => {
                const tbody = document.getElementById("orderListBody");
                tbody.innerHTML = "";
                if (!orders || orders.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4">Không có đơn hàng nào</td></tr>';
                } else {
                orders.forEach((order) => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${order.IdHoaDon}</td>
                            <td>${order.NgayTao}</td>
                            <td>${Number(order.ThanhTien).toLocaleString()} đ</td>
                            <td>${order.TenTinhTrang}</td>
                            <td>
                                <button class="btn btn-primary btn-xem-chitiet"
                                        data-id="${order.IdHoaDon}" 
                                        data-ngay="${order.NgayTao}"
                                        data-trangthai="${order.TenTinhTrang}"
                                        data-thanhtien="${order.ThanhTien}"
                                        data-bs-toggle="modal" 
                                        data-bs-target="#orderDetailModal">
                                    Xem chi tiết
                                </button>
                            </td>
                        </tr>`;
                    });  
                }
            })
            .catch((error) => console.error("Fetch error:", error));
    }
    //Xem chi tiết đơn hàng
    if (e.target.classList.contains("btn-xem-chitiet")) {
        const idHoaDon = e.target.dataset.id;
        const ngay = e.target.dataset.ngay;
        const trangThai = e.target.dataset.trangthai;
        const thanhtien = e.target.dataset.thanhtien;
        //Đổi các label 
        document.getElementById("orderDetailModalLabel").textContent = `Chi tiết hóa đơn #${idHoaDon}`;
        document.getElementById("orderDate").innerHTML = `<strong>Ngày đặt: </strong>${ngay}`;
        document.getElementById("orderStatus").innerHTML= `<strong>Trạng thái: </strong>${trangThai}`;

        // Gọi controller để lấy chi tiet hoa don
        fetch(`/smartstation/src/mvc/controllers/ThongKeController.php?idHoaDon=${idHoaDon}`)
            .then((response) => {
                if (!response.ok) throw new Error("Network error: " + response.status);
                return response.json();
            })
            .then((orderDetails) => {
                const tbody = document.getElementById("orderDetailBody");
                tbody.innerHTML = "";
                if (!orderDetails || orderDetails.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4">Không có đơn hàng nào</td></tr>';
                } else {
                    let total = 0;
                    orderDetails.forEach((orderDetail) => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${orderDetail.TenDong}</td>
                            <td>${orderDetail.SoLuong}</td>
                            <td>${Number(orderDetail.Gia).toLocaleString()} đ</td>
                            <td>${Number(thanhtien).toLocaleString()}</td>
                        </tr>`;
                        total += Number(thanhtien);
                    }); 
                    tbody.insertAdjacentHTML("beforeend", `
                        <tr class="table-warning">
                            <td colspan="3" class="text-end"><strong>Tổng cộng:</strong></td>
                            <td><strong>${Number(total).toLocaleString()} đ</strong></td>
                        </tr>
                    `);
                    
                }
            })
            .catch((error) => console.error("Fetch error:", error));
    }
});

function resetTopUsers(){
    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";
    isFiltered = false;

    // sessionStorage.removeItem("isFiltered");
    // sessionStorage.removeItem("fromDate");
    // sessionStorage.removeItem("toDate");
    // sessionStorage.removeItem("sortOrder");

    loadTopUsers();
}

loadTopUsers();

