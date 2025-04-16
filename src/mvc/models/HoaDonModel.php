<?php
include_once '../core/DB.php';

class HoaDonModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    // Lấy tất cả hóa đơn với bộ lọc, chỉ lấy TrangThai = 1
    public function getAllHoaDon($filters = []) {
        $query = "
            SELECT h.*, nd.HoVaTen 
            FROM hoadon h
            LEFT JOIN TaiKhoan tk ON h.IdTaiKhoan = tk.IdTaiKhoan
            LEFT JOIN nguoidung nd ON tk.IdNguoiDung = nd.IdNguoiDung
            WHERE h.TrangThai = 1
        ";
        $params = [];
        $types = "";

        // Lọc theo tình trạng
        if (!empty($filters['tinhTrang'])) {
            $query .= " AND h.IdTinhTrang = ?";
            $params[] = $filters['tinhTrang'];
            $types .= "i";
        }

        // Lọc theo ngày bắt đầu
        if (!empty($filters['fromDate'])) {
            $query .= " AND h.NgayTao >= ?";
            $params[] = $filters['fromDate'];
            $types .= "s";
        }

        // Lọc theo ngày kết thúc
        if (!empty($filters['toDate'])) {
            $query .= " AND h.NgayTao <= ?";
            $params[] = $filters['toDate'];
            $types .= "s";
        }

        // Lọc theo địa chỉ (tìm kiếm trong DiaChi của nguoidung)
        if (!empty($filters['diaChi'])) {
            $query .= " AND nd.DiaChi LIKE ?";
            $params[] = "%" . $filters['diaChi'] . "%";
            $types .= "s";
        }

        $stmt = $this->db->prepare($query);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    // Lấy hóa đơn theo IdHoaDon
    public function getHoaDonById($idHoaDon) {
        $stmt = $this->db->prepare("
            SELECT h.*, nd.HoVaTen 
            FROM hoadon h
            LEFT JOIN TaiKhoan tk ON h.IdTaiKhoan = tk.IdTaiKhoan
            LEFT JOIN nguoidung nd ON tk.IdNguoiDung = nd.IdNguoiDung
            WHERE h.IdHoaDon = ?
        ");
        $stmt->bind_param("i", $idHoaDon);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Thêm hóa đơn mới
    public function addHoaDon($data) {
        $stmt = $this->db->prepare("INSERT INTO hoadon (IdTaiKhoan, NgayTao, ThanhTien, TrangThai, IdTinhTrang) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("isdis", $data['IdTaiKhoan'], $data['NgayTao'], $data['ThanhTien'], $data['TrangThai'], $data['IdTinhTrang']);
        $stmt->execute();
        return $this->getHoaDonById($this->db->insert_id);
    }

    // Cập nhật hóa đơn
    public function updateHoaDon($idHoaDon, $data) {
        $this->db->begin_transaction();
        try {
            // Cập nhật IdTinhTrang của hóa đơn
            $stmt = $this->db->prepare("UPDATE hoadon SET IdTinhTrang = ? WHERE IdHoaDon = ?");
            $stmt->bind_param("ii", $data['IdTinhTrang'], $idHoaDon);
            $stmt->execute();

            // Xử lý dựa trên IdTinhTrang mới
            $newTinhTrang = $data['IdTinhTrang'];

            if ($newTinhTrang == 4) { // Đơn hàng bị hủy
                // Lấy chi tiết hóa đơn để biết sản phẩm và số lượng
                $stmt = $this->db->prepare("
                    SELECT ct.Imei, ct.SoLuong, spct.IdCHSP, spct.IdDongSanPham
                    FROM cthoadon ct
                    JOIN sanphamchitiet spct ON ct.Imei = spct.Imei
                    WHERE ct.IdHoaDon = ?
                ");
                $stmt->bind_param("i", $idHoaDon);
                $stmt->execute();
                $ctHoaDons = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

                foreach ($ctHoaDons as $ct) {
                    $imei = $ct['Imei'];
                    $soLuong = $ct['SoLuong'];
                    $idCHSP = $ct['IdCHSP'];
                    $idDongSanPham = $ct['IdDongSanPham'];

                    // Cập nhật số lượng trong sanpham
                    $stmt = $this->db->prepare("
                        UPDATE sanpham 
                        SET SoLuong = SoLuong + ?
                        WHERE IdCHSP = ? AND IdDongSanPham = ?
                    ");
                    $stmt->bind_param("iii", $soLuong, $idCHSP, $idDongSanPham);
                    $stmt->execute();

                    // Cập nhật số lượng trong dongsanpham
                    $stmt = $this->db->prepare("
                        UPDATE dongsanpham 
                        SET SoLuong = (
                            SELECT SUM(SoLuong) 
                            FROM sanpham 
                            WHERE IdDongSanPham = ? AND TrangThai = 1
                        )
                        WHERE IdDongSanPham = ?
                    ");
                    $stmt->bind_param("ii", $idDongSanPham, $idDongSanPham);
                    $stmt->execute();
                }
            } elseif ($newTinhTrang == 3) { // Giao hàng thành công
                // Cập nhật TrangThai của sanphamchitiet thành 0
                $stmt = $this->db->prepare("
                    UPDATE sanphamchitiet spct
                    JOIN cthoadon ct ON spct.Imei = ct.Imei
                    SET spct.TrangThai = 0
                    WHERE ct.IdHoaDon = ?
                ");
                $stmt->bind_param("i", $idHoaDon);
                $stmt->execute();
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception("Lỗi cập nhật hóa đơn: " . $e->getMessage());
        }
    }

    // Xóa hóa đơn (ẩn hóa đơn bằng cách thay đổi trạng thái)
    public function deleteHoaDon($idHoaDon) {
        $stmt = $this->db->prepare("UPDATE hoadon SET TrangThai = 0 WHERE IdHoaDon = ?");
        $stmt->bind_param("i", $idHoaDon);
        return $stmt->execute();
    }
}