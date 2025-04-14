<?php
include_once '../core/DB.php';

class HoaDonModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    // Lấy tất cả hóa đơn
    public function getAllHoaDon() {
        $result = $this->db->query("
            SELECT h.*, nd.HoVaTen 
            FROM hoadon h
            LEFT JOIN TaiKhoan tk ON h.IdTaiKhoan = tk.IdTaiKhoan
            LEFT JOIN nguoidung nd ON tk.IdNguoiDung = nd.IdNguoiDung
        ");
        return $result->fetch_all(MYSQLI_ASSOC);
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