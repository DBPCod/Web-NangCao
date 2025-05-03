function loadDashboardData() {
    // Lấy tổng số tài khoản
    fetch("/smartstation/src/mvc/controllers/TaiKhoanController.php?total=1", {
        method: "GET",
    })
        .then(response => {
            if (!response.ok) throw new Error("Không thể tải tổng số tài khoản");
            return response.json();
        })
        .then(data => {
            document.getElementById("totalTaiKhoan").textContent = data.total || 0;
        })
        .catch(error => {
            console.error("Error loading totalTaiKhoan:", error);
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
    })
        .then(response => {
            if (!response.ok) throw new Error("Không thể tải tổng số sản phẩm");
            return response.json();
        })
        .then(data => {
            document.getElementById("totalSanPham").textContent = data.total || 0;
        })
        .catch(error => {
            console.error("Error loading totalSanPham:", error);
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
    })
        .then(response => {
            if (!response.ok) throw new Error("Không thể tải tổng doanh thu");
            return response.json();
        })
        .then(data => {
            const totalDoanhThu = data.totalRevenue || 0;
            document.getElementById("totalDoanhThu").textContent = 
                Number(totalDoanhThu).toLocaleString('vi-VN') + ' đ';
        })
        .catch(error => {
            console.error("Error loading totalDoanhThu:", error);
            toast({
                title: "Lỗi",
                message: "Không thể tải tổng doanh thu",
                type: "error",
                duration: 3000,
            });
        });
}

// Gọi khi trang được tải
loadDashboardData();
console.log("a");