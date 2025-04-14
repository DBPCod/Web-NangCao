// Định nghĩa ánh xạ trạng thái
const tinhTrangMap = {
    1: { name: "Chưa xác nhận", color: "#6c757d", class: "status-1" },
    2: { name: "Đã xác nhận", color: "#007bff", class: "status-2" },
    3: { name: "Giao thành công", color: "#28a745", class: "status-3" },
    4: { name: "Đã giao (Hủy)", color: "#dc3545", class: "status-4" }
};

// Hàm lấy trạng thái tiếp theo và nhãn nút
function getNextTinhTrang(currentTinhTrang) {
    switch (parseInt(currentTinhTrang)) {
        case 1:
            return { nextId: 2, buttonLabel: "Xác nhận", buttonColor: "#007bff" }; // Chưa xác nhận -> Đã xác nhận
        case 2:
            return [
                { nextId: 3, buttonLabel: "Giao hàng", buttonColor: "#28a745" }, // Đã xác nhận -> Giao thành công
                { nextId: 4, buttonLabel: "Hủy", buttonColor: "#dc3545" } // Đã xác nhận -> Đã giao (Hủy)
            ];
        case 3:
        case 4:
            return null; // Trạng thái cuối, không có nút
        default:
            return null;
    }
}

// Hàm tải danh sách tình trạng cho bộ lọc
function loadTinhTrangOptions() {
    fetch("/smartstation/src/mvc/controllers/TinhTrangVanChuyenController.php")
        .then(response => {
            if (!response.ok) throw new Error("Không thể tải danh sách tình trạng");
            return response.json();
        })
        .then(tinhTrangs => {
            const filterSelect = document.getElementById("filterTinhTrang");
            filterSelect.innerHTML = '<option value="">Tất cả</option>';
            tinhTrangs.forEach(tinhTrang => {
                filterSelect.innerHTML += `<option value="${tinhTrang.IdTinhTrang}">${tinhTrang.TenTinhTrang}</option>`;
            });
        })
        .catch(error => {
            console.error("Error loading tinhtrang options:", error);
            toast({
                title: "Lỗi",
                message: "Không thể tải danh sách tình trạng",
                type: "error",
                duration: 3000,
            });
        });
}

// Hàm tải danh sách hóa đơn
function loadOrders(filters = {}) {
    let url = "/smartstation/src/mvc/controllers/HoaDonController.php";
    if (Object.keys(filters).length) {
        const params = new URLSearchParams(filters);
        url += `?${params.toString()}`;
    }

    fetch(url, {
        method: "GET",
    })
        .then(response => {
            console.log(response);
            if (!response.ok) throw new Error("Không thể tải danh sách hóa đơn");
            return response.json();
        })
        .then(hoaDons => {
            const tbody = document.getElementById("orderTableBody");
            tbody.innerHTML = "";
            if (!hoaDons || hoaDons.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5">Không có hóa đơn nào</td></tr>';
            } else {
                hoaDons.forEach(hoaDon => {
                    console.log(hoaDon);
                    // Xây dựng nút hành động
                    let actionButtons = `<button class="btn btn-primary btn-sm action-btn" onclick="viewOrder(${hoaDon.IdHoaDon})">Xem</button>`;
                    const nextTinhTrang = getNextTinhTrang(hoaDon.IdTinhTrang);
                    if (nextTinhTrang) {
                        if (Array.isArray(nextTinhTrang)) {
                            nextTinhTrang.forEach(tinhTrang => {
                                actionButtons += `
                                    <button class="btn btn-sm action-btn" 
                                            style="background-color: ${tinhTrang.buttonColor}; color: white;"
                                            onclick="confirmUpdateStatusTable(${hoaDon.IdHoaDon}, ${hoaDon.IdTinhTrang}, ${tinhTrang.nextId})">
                                        ${tinhTrang.buttonLabel}
                                    </button>`;
                            });
                        } else {
                            actionButtons += `
                                <button class="btn btn-sm action-btn" 
                                        style="background-color: ${nextTinhTrang.buttonColor}; color: white;"
                                        onclick="confirmUpdateStatusTable(${hoaDon.IdHoaDon}, ${hoaDon.IdTinhTrang}, ${nextTinhTrang.nextId})">
                                    ${nextTinhTrang.buttonLabel}
                                </button>`;
                        }
                    }
                    
                    tbody.innerHTML += `
                        <tr>
                            <td>${hoaDon.IdHoaDon}</td>
                            <td>${hoaDon.HoVaTen || "Không xác định"}</td>
                            <td>${hoaDon.ThanhTien ? Number(hoaDon.ThanhTien).toLocaleString('vi-VN') + ' VNĐ' : 'Chưa xác định'}</td>
                            <td class="${tinhTrangMap[hoaDon.IdTinhTrang].class}">${tinhTrangMap[hoaDon.IdTinhTrang].name}</td>
                            <td>${actionButtons}</td>
                        </tr>`;
                });
            }
        })
        .catch(error => {
            console.error("Error loading orders:", error);
            toast({
                title: "Lỗi",
                message: "Không thể tải danh sách hóa đơn",
                type: "error",
                duration: 3000,
            });
        });
}

// Hàm xem chi tiết hóa đơn
function viewOrder(idHoaDon) {
    fetch(`/smartstation/src/mvc/controllers/HoaDonController.php?idHoaDon=${idHoaDon}`)
        .then(response => {

            if (!response.ok) throw new Error("Không thể lấy thông tin hóa đơn");

            return response.json();
        })
        .then(hoaDon => {
            // Lấy danh sách tình trạng
            fetch(`/smartstation/src/mvc/controllers/TinhTrangVanChuyenController.php`)
                .then(res => {
                    if (!res.ok) throw new Error("Không thể lấy danh sách tình trạng");
                    return res.json();
                })
                .then(tinhTrangs => {
                    // Lấy chi tiết hóa đơn
                    fetch(`/smartstation/src/mvc/controllers/CTHoaDonController.php?idHoaDon=${idHoaDon}`)
                        .then(res => {
                            if (!res.ok) throw new Error("Không thể lấy chi tiết hóa đơn");
                            return res.json();
                        })
                        .then(ctHoaDons => {
                            
                            // Điền thông tin hóa đơn
                            document.getElementById("viewIdHoaDon").value = hoaDon.IdHoaDon;
                            document.getElementById("viewTenKhachHang").value = hoaDon.HoVaTen || "Không xác định";
                            document.getElementById("viewNgayTao").value = hoaDon.NgayTao;
                            document.getElementById("viewThanhTien").value = hoaDon.ThanhTien ? Number(hoaDon.ThanhTien).toLocaleString('vi-VN') + ' VNĐ' : "Chưa xác định";
                            document.getElementById("viewTrangThai").value = hoaDon.TrangThai === 1 ? "Hoạt động" : "Đã hủy";

                            // Điền select tình trạng
                            const tinhTrangSelect = document.getElementById("viewTinhTrang");
                            tinhTrangSelect.disabled = true;
                            tinhTrangSelect.innerHTML = "";
                            const allowedTinhTrang = getAllowedTinhTrang(hoaDon.IdTinhTrang);
                            tinhTrangs.forEach(tt => {
                                console.log(tt);
                                if (allowedTinhTrang.includes(parseInt(tt.IdTinhTrang))) {

                                    console.log(tt.TenTinhTrang);
                                    tinhTrangSelect.innerHTML += `
                                        <option value="${tt.IdTinhTrang}" ${tt.IdTinhTrang === hoaDon.IdTinhTrang ? 'selected' : ''}>
                                            ${tt.TenTinhTrang}
                                        </option>`;
                                    console.log(`
                                        <option value="${tt.IdTinhTrang}" ${tt.IdTinhTrang === hoaDon.IdTinhTrang ? 'selected' : ''}>
                                            ${tt.TenTinhTrang}
                                        </option>`);
                                }
                            });
                            console.log(tinhTrangSelect);

                            // Hiển thị gợi ý trạng thái
                            const hintElement = document.getElementById("tinhTrangHint");
                            console.log(tinhTrangMap[hoaDon.IdTinhTrang].name);

                            if (hoaDon.IdTinhTrang >= 3) {
                                hintElement.innerHTML = `Đơn hàng đã ở trạng thái "${tinhTrangMap[hoaDon.IdTinhTrang].name}". Không thể thay đổi thêm.`;
                                tinhTrangSelect.disabled = true;
                            } else {
                                const nextStates = allowedTinhTrang
                                    .filter(id => id !== hoaDon.IdTinhTrang)
                                    .map(id => tinhTrangMap[id].name)
                                    .join(" hoặc ");
                                hintElement.innerHTML = `Trạng thái hiện tại: "${tinhTrangMap[hoaDon.IdTinhTrang].name}". Có thể cập nhật thành: ${nextStates || "Không có tùy chọn"}.`;
                                tinhTrangSelect.disabled = true;
                            }

                            // Điền danh sách sản phẩm
                            const productList = document.getElementById("viewProductList");
                            productList.innerHTML = "";
                            const ctHoaDonsArray = Array.isArray(ctHoaDons) ? ctHoaDons : ctHoaDons && typeof ctHoaDons === 'object' ? [ctHoaDons] : [];
                            console.log(ctHoaDonsArray);
                            if (!ctHoaDonsArray.length) {
                                productList.innerHTML = '<tr><td colspan="6">Không có sản phẩm</td></tr>';
                            } else {
                                ctHoaDonsArray.forEach(ct => {
                                    const thanhTien = Number(ct.GiaTien) * Number(ct.SoLuong);
                                    productList.innerHTML += `
                                        <tr>
                                            <td>${ct.TenDong || "Không xác định"}</td>
                                            <td>${ct.Ram || "N/A"} / ${ct.Rom || "N/A"} / ${ct.MauSac || "N/A"}</td>
                                            <td>${ct.Imei}</td>
                                            <td>${ct.SoLuong}</td>
                                            <td>${Number(ct.GiaTien).toLocaleString('vi-VN')} VNĐ</td>
                                            <td>${thanhTien.toLocaleString('vi-VN')} VNĐ</td>
                                        </tr>`;
                                });
                            }

                            // Hiển thị modal
                            const modal = new bootstrap.Modal(document.getElementById("viewOrderModal"));
                            modal.show();
                        })
                        .catch(error => {
                            console.error("Error fetching cthoadon:", error);
                            toast({
                                title: "Lỗi",
                                message: "Không thể tải chi tiết hóa đơn",
                                type: "error",
                                duration: 3000,
                            });
                        });
                })
                .catch(error => {
                    console.error("Error fetching tinhtrang list:", error);
                    toast({
                        title: "Lỗi",
                        message: "Không thể tải danh sách tình trạng",
                        type: "error",
                        duration: 3000,
                    });
                });
        })
        .catch(error => {
            console.error("Error fetching hoadon:", error);
            toast({
                title: "Lỗi",
                message: "Không thể tải thông tin hóa đơn",
                type: "error",
                duration: 3000,
            });
        });
}

// Hàm lấy danh sách trạng thái hợp lệ
function getAllowedTinhTrang(currentTinhTrang) {
    switch (parseInt(currentTinhTrang)) {
        case 1:
            return [1, 2]; // Chưa xác nhận -> Đã xác nhận
        case 2:
            return [2, 3, 4]; // Đã xác nhận -> Giao thành công hoặc Đã giao (Hủy)
        case 3:
        case 4:
            return [currentTinhTrang]; // Trạng thái cuối
        default:
            return [currentTinhTrang];
    }
}

// Hàm xác nhận trước khi cập nhật trạng thái (từ bảng)
function confirmUpdateStatusTable(idHoaDon, currentTinhTrang, newTinhTrang) {
    if (newTinhTrang === currentTinhTrang) return;

    const confirmMessage = `Bạn có chắc muốn cập nhật trạng thái đơn hàng #${idHoaDon} từ "${tinhTrangMap[currentTinhTrang].name}" thành "${tinhTrangMap[newTinhTrang].name}"?`;
    if (!confirm(confirmMessage)) return;

    updateOrderStatus(idHoaDon, newTinhTrang, currentTinhTrang);
}

// Hàm xác nhận trước khi cập nhật trạng thái (từ modal)
function confirmUpdateStatusModal(selectElement) {
    const idHoaDon = document.getElementById("viewIdHoaDon").value;
    const newTinhTrang = selectElement.value;
    const currentTinhTrang = selectElement.dataset.currentTinhTrang || newTinhTrang;

    if (newTinhTrang === currentTinhTrang) return;

    const confirmMessage = `Bạn có chắc muốn cập nhật trạng thái đơn hàng #${idHoaDon} từ "${tinhTrangMap[currentTinhTrang].name}" thành "${tinhTrangMap[newTinhTrang].name}"?`;
    if (!confirm(confirmMessage)) {
        selectElement.value = currentTinhTrang;
        return;
    }

    updateOrderStatus(idHoaDon, newTinhTrang, currentTinhTrang, selectElement);
}

// Hàm cập nhật trạng thái đơn hàng
function updateOrderStatus(idHoaDon, newTinhTrang, currentTinhTrang, selectElement = null) {
    fetch(`/smartstation/src/mvc/controllers/HoaDonController.php?idHoaDon=${idHoaDon}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ IdTinhTrang: newTinhTrang }),
    })
        .then(response => {
            if (!response.ok) throw new Error("Không thể cập nhật trạng thái");
            return response.json();
        })
        .then(result => {
            if (result.message.includes("thành công")) {
                toast({
                    title: "Thành công",
                    message: `Đã cập nhật trạng thái đơn hàng thành "${tinhTrangMap[newTinhTrang].name}"`,
                    type: "success",
                    duration: 3000,
                });

                if (selectElement) {
                    selectElement.dataset.currentTinhTrang = newTinhTrang;
                    const hintElement = document.getElementById("tinhTrangHint");
                    const allowedTinhTrang = getAllowedTinhTrang(newTinhTrang);
                    if (newTinhTrang >= 3) {
                        hintElement.innerHTML = `Đơn hàng đã ở trạng thái "${tinhTrangMap[newTinhTrang].name}". Không thể thay đổi thêm.`;
                        selectElement.disabled = true;
                    } else {
                        const nextStates = allowedTinhTrang
                            .filter(id => id !== parseInt(newTinhTrang))
                            .map(id => tinhTrangMap[id].name)
                            .join(" hoặc ");
                        hintElement.innerHTML = `Trạng thái hiện tại: "${tinhTrangMap[newTinhTrang].name}". Có thể cập nhật thành: ${nextStates || "Không có tùy chọn"}.`;
                    }
                }

                loadOrders();
            } else {
                throw new Error(result.message);
            }
        })
        .catch(error => {
            console.error("Error updating status:", error);
            toast({
                title: "Lỗi",
                message: error.message || "Không thể cập nhật trạng thái",
                type: "error",
                duration: 3000,
            });
            if (selectElement) {
                selectElement.value = currentTinhTrang;
            }
        });
}

// Xử lý bộ lọc
document.getElementById("filterForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const filters = {
        tinhTrang: document.getElementById("filterTinhTrang").value,
        fromDate: document.getElementById("filterFromDate").value,
        toDate: document.getElementById("filterToDate").value,
        diaChi: document.getElementById("filterDiaChi").value,
    };
    loadOrders(filters);
});

// Xóa bộ lọc
document.getElementById("resetFilter").addEventListener("click", function () {
    document.getElementById("filterTinhTrang").value = "";
    document.getElementById("filterFromDate").value = "";
    document.getElementById("filterToDate").value = "";
    document.getElementById("filterDiaChi").value = "";
    loadOrders();
});

// Gọi khi trang được tải
    loadTinhTrangOptions();
    loadOrders();