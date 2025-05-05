// Đảm bảo script chỉ chạy khi DOM đã sẵn sàng và chỉ khi các phần tử cần thiết tồn tại
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra xem chúng ta có đang ở trang dashboard không
    if (document.getElementById('totalTaiKhoan') && 
        document.getElementById('totalSanPham') && 
        document.getElementById('totalDoanhThu')) {
        loadDashboardData();
    }
});

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
}

function loadDashboardData() {
    // Kiểm tra lại một lần nữa để đảm bảo các phần tử tồn tại
    const totalTaiKhoanElement = document.getElementById("totalTaiKhoan");
    const totalSanPhamElement = document.getElementById("totalSanPham");
    const totalDoanhThuElement = document.getElementById("totalDoanhThu");
    
    if (!totalTaiKhoanElement || !totalSanPhamElement || !totalDoanhThuElement) {
        console.warn("Không tìm thấy các phần tử dashboard cần thiết");
        return;
    }
    
    // Lấy tổng số tài khoản
    fetch("/smartstation/src/mvc/controllers/TaiKhoanController.php?total=1", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: "same-origin" // Đảm bảo gửi cookie phiên làm việc
    })
        .then(response => {
            if (!response.ok) throw new Error("Không thể tải tổng số tài khoản");
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Phản hồi không phải định dạng JSON");
            }
            return response.json();
        })
        .then(data => {
            if (totalTaiKhoanElement) {
                totalTaiKhoanElement.textContent = data.total || 0;
            }
        })
        .catch(error => {
            console.error("Error loading totalTaiKhoan:", error);
            if (totalTaiKhoanElement) {
                totalTaiKhoanElement.textContent = "0";
            }
            toast({
                title: "Lỗi",
                message: "Không thể tải tổng số tài khoản",
                type: "error",
                duration: 3000,
            });
        });

    // Lấy tổng số sản phẩm
    fetch("/smartstation/src/mvc/controllers/SanPhamController.php?total=1", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: "same-origin"
    })
        .then(response => {
            if (!response.ok) throw new Error("Không thể tải tổng số sản phẩm");
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Phản hồi không phải định dạng JSON");
            }
            return response.json();
        })
        .then(data => {
            if (totalSanPhamElement) {
                totalSanPhamElement.textContent = data.total || 0;
            }
        })
        .catch(error => {
            console.error("Error loading totalSanPham:", error);
            if (totalSanPhamElement) {
                totalSanPhamElement.textContent = "0";
            }
            toast({
                title: "Lỗi",
                message: "Không thể tải tổng số sản phẩm",
                type: "error",
                duration: 3000,
            });
        });

    // Lấy tổng doanh thu
    fetch("/smartstation/src/mvc/controllers/HoaDonController.php?totalRevenue=1", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: "same-origin"
    })
        .then(response => {
            if (!response.ok) throw new Error("Không thể tải tổng doanh thu");
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Phản hồi không phải định dạng JSON");
            }
            return response.json();
        })
        .then(data => {
            if (totalDoanhThuElement) {
                const totalDoanhThu = data.totalRevenue || 0;
                totalDoanhThuElement.textContent = formatPrice(totalDoanhThu);
            }
        })
        .catch(error => {
            console.error("Error loading totalDoanhThu:", error);
            if (totalDoanhThuElement) {
                totalDoanhThuElement.textContent = "0 đ";
            }
            toast({
                title: "Lỗi",
                message: "Không thể tải tổng doanh thu",
                type: "error",
                duration: 3000,
            });
        });
}

// Xóa gọi hàm ở đây vì chúng ta đã gọi trong DOMContentLoaded
console.log("a");
