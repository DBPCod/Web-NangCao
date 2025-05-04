<?php
include_once __DIR__ . '/../core/DB.php';

class ThongKeModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    // Lấy top 5 khách hàng có tổng mua cao nhất
    public function getTopKhachHang($sort = 'DESC') {
        $sort = strtoupper($sort) === 'ASC' ? 'ASC' : 'DESC';
        $sql = "SELECT
                    nd.IdNguoiDung,
                    nd.HoVaTen,
                    nd.SoDienThoai,
                    SUM(hd.ThanhTien) AS TongMuaHang
                FROM nguoidung nd
                JOIN taikhoan tk ON nd.IdNguoiDung = tk.IdNguoiDung
                JOIN hoadon hd ON tk.IdTaiKhoan = hd.IdTaiKhoan
                WHERE hd.TrangThai = 1
                AND hd.IdTinhTrang = 3
                GROUP BY nd.IdNguoiDung
                ORDER BY TongMuaHang $sort
                LIMIT 5";

        $result = $this->db->query($sql);
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Lấy danh sách hóa đơn theo người dùng
    public function getHoaDonByNguoiDung($idNguoiDung, $from = null, $to = null) {
        $sql = "SELECT 
                    hd.IdHoaDon,
                    hd.NgayTao,
                    hd.ThanhTien,
                    ttv.TenTinhTrang
                FROM hoadon hd
                JOIN taikhoan tk ON hd.IdTaiKhoan = tk.IdTaiKhoan
                JOIN nguoidung nd ON tk.IdNguoiDung = nd.IdNguoiDung
                JOIN tinhtrangvanchuyen ttv ON hd.IdTinhTrang = ttv.IdTinhTrang
                WHERE nd.IdNguoiDung = ?";

        $params = [$idNguoiDung];
        $types = "i"; 

        if ($from && $to) {
            $sql .= " AND DATE(hd.NgayTao) BETWEEN ? AND ?";
            $params[] = $from;
            $params[] = $to;
            $types .= "ss";
        }

        $stmt = $this->db->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Lấy chi tiết hóa đơn
    public function getChiTietHoaDon($idHoaDon) {
        $sql = "SELECT 
                    cthd.Imei,
                    sp.Gia,
                    cthd.GiaTien,
                    cthd.SoLuong,
                    dsp.TenDong
                FROM cthoadon cthd
                JOIN sanphamchitiet spct ON cthd.Imei = spct.Imei
                JOIN sanpham sp ON sp.IdCHSP = spct.IdCHSP AND sp.IdDongSanPham = spct.IdDongSanPham
                JOIN dongsanpham dsp ON dsp.IdDongSanPham = spct.IdDongSanPham
                WHERE cthd.IdHoaDon = ?";

        $stmt = $this->db->prepare($sql);
        $stmt->bind_param("i", $idHoaDon);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    //Lấy 5 người từ theo ngày
    public function getTopUsersByDateRange($from, $to, $sort = 'DESC') {
        $sort = strtoupper($sort) === 'ASC' ? 'ASC' : 'DESC';
        $sql = "SELECT
                    nd.IdNguoiDung,
                    nd.HoVaTen,
                    nd.SoDienThoai,
                    SUM(hd.ThanhTien) AS TongMuaHang
                FROM nguoidung nd
                JOIN taikhoan tk ON nd.IdNguoiDung = tk.IdNguoiDung
                JOIN hoadon hd ON tk.IdTaiKhoan = hd.IdTaiKhoan
                WHERE hd.TrangThai = 1
                AND Date(hd.NgayTao) BETWEEN ? AND ?
                AND hd.IdTinhTrang = 3
                GROUP BY nd.IdNguoiDung
                ORDER BY TongMuaHang $sort
                LIMIT 5";
    
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param("ss", $from, $to);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC); 
    }
}
?>
