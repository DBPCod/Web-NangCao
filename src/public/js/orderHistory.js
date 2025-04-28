// Get cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Format price with commas (e.g., 30190000 -> 30,190,000 đ)
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ";
}

// Format date to DD/MM/YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

// Map status IDs to text and classes
const statusMap = {
    1: { text: "Chưa xác nhận", class: "status-1" },
    2: { text: "Đã xác nhận", class: "status-2" },
    3: { text: "Thành công", class: "status-3" },
    4: { text: "Hủy", class: "status-4" }
};

// Load order history
async function loadOrderHistory() {
    const idNguoiDung = getCookie('user');
    if (!idNguoiDung) {
        document.getElementById('orderHistoryEmpty').style.display = 'block';
        return;
    }

    try {
        const response = await fetch(`/smartstation/src/mvc/controllers/HoaDonController.php?idNguoiDung=${idNguoiDung}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const orders = await response.json();

        const tableBody = document.getElementById('orderHistoryTableBody');
        tableBody.innerHTML = '';

        if (orders.length === 0) {
            document.getElementById('orderHistoryEmpty').style.display = 'block';
            return;
        }

        document.getElementById('orderHistoryEmpty').style.display = 'none';

        orders.forEach(order => {
            const status = statusMap[order.IdTinhTrang] || { text: "Không xác định", class: "" };
            const row = `
                <tr>
                    <td>${formatDate(order.NgayTao)}</td>
                    <td>${formatPrice(order.ThanhTien)}</td>
                    <td class="${status.class}">${status.text}</td>
                    <td>
                        <button class="btn btn-info btn-sm action-btn" onclick="viewOrderDetails(${order.IdHoaDon})">Xem chi tiết</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Lỗi khi tải lịch sử đơn hàng:", error);
        document.getElementById('orderHistoryEmpty').innerHTML = '<p>Lỗi khi tải dữ liệu đơn hàng.</p>';
        document.getElementById('orderHistoryEmpty').style.display = 'block';
    }
}

// View order details
async function viewOrderDetails(idHoaDon) {
    try {
        // Fetch order details
        const response = await fetch(`/smartstation/src/mvc/controllers/HoaDonController.php?idHoaDon=${idHoaDon}`);
        const order = await response.json();

        // Populate modal fields
        document.getElementById('viewIdHoaDon').value = order.IdHoaDon;
        document.getElementById('viewTenKhachHang').value = order.HoVaTen || 'Không xác định';
        document.getElementById('viewNgayTao').value = formatDate(order.NgayTao);
        document.getElementById('viewThanhTien').value = formatPrice(order.ThanhTien);
        document.getElementById('viewTrangThai').value = order.TrangThai === 1 ? "Hoạt động" : "Đã xóa";
        document.getElementById('viewTinhTrang').value = statusMap[order.IdTinhTrang]?.text || "Không xác định";

        // Fetch product details (CTHoaDon)
        const ctResponse = await fetch(`/smartstation/src/mvc/controllers/CTHoaDonController.php?idHoaDon=${idHoaDon}`);
        const ctHoaDons = await ctResponse.json();

        const productList = document.getElementById('viewProductList');
        productList.innerHTML = '';

        for (const ct of ctHoaDons) {
            // Fetch product configuration
            const spResponse = await fetch(`/smartstation/src/mvc/controllers/SanPhamChiTietController.php?imei=${ct.Imei}`);
            const spData = await spResponse.json();
            const config = spData.Config || {};
            const configText = Object.entries(config).map(([key, value]) => `${key}: ${value}`).join(', ');
            console.log(ct);
            console.log(spData);
            const row = `
                <tr>
                    <td>${ct.TenDong || 'Không xác định'}</td>
                    <td>${ct.Ram || 'N/A'}-${ct.Rom || 'N/A'}-${ct.MauSac || 'N/A'}</td>
                    <td>${ct.Imei}</td>
                    <td>${ct.SoLuong}</td>
                    <td>${formatPrice(ct.GiaTien)}</td>
                    <td>${formatPrice(ct.GiaTien * ct.SoLuong)}</td>
                </tr>
            `;
            productList.innerHTML += row;
        }

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('viewOrderModal'));
        modal.show();
    } catch (error) {
        console.error("Lỗi khi xem chi tiết hóa đơn:", error);
        alert("Lỗi: " + error.message);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadOrderHistory();
});