<?php
include_once __DIR__ . '../../core/DB.php';

class DongSanPhamModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllDongSanPham() {
        $result = $this->db->query("SELECT * FROM dongsanpham WHERE TrangThai = 1");
        return $result->fetch_all(MYSQLI_ASSOC);
    }
    
    public function getDongSanPhamById($idDongSanPham) {
        $stmt = $this->db->prepare("SELECT * FROM dongsanpham WHERE IdDongSanPham = ? AND TrangThai = 1");
        $stmt->bind_param("i", $idDongSanPham);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function addDongSanPham($data) {
        $stmt = $this->db->prepare("INSERT INTO dongsanpham (TenDong, SoLuong, IdThuongHieu, TrangThai) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("siii", $data['TenDong'], $data['SoLuong'], $data['IdThuongHieu'], $data['TrangThai']);
        $stmt->execute();
        return $this->getDongSanPhamById($this->db->insert_id);
    }

    public function updateDongSanPham($idDongSanPham, $tenDong, $soLuong, $idThuongHieu, $trangThai) {
        $stmt = $this->db->prepare("UPDATE dongsanpham SET TenDong = ?, SoLuong = ?, IdThuongHieu = ?, TrangThai = ? WHERE IdDongSanPham = ?");
        $stmt->bind_param("siiii", $tenDong, $soLuong, $idThuongHieu, $trangThai, $idDongSanPham);
        return $stmt->execute();
    }

    // Hàm kiểm tra xem DongSanPham có đang được sử dụng trong SanPham không
    public function isDongSanPhamInUse($idDongSanPham) {
        $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM sanpham WHERE IdDongSanPham = ? AND TrangThai = 1");
        $stmt->bind_param("i", $idDongSanPham);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        return $result['count'] > 0;
    }

    public function deleteDongSanPham($idDongSanPham) {
        // Kiểm tra xem DongSanPham có đang được sử dụng không
        if ($this->isDongSanPhamInUse($idDongSanPham)) {
            return false; // Không xóa được nếu đang được sử dụng
        }
        
        $stmt = $this->db->prepare("UPDATE dongsanpham SET TrangThai = ? WHERE IdDongSanPham = ?");
        $trangThai = 0;
        $stmt->bind_param("ii", $trangThai, $idDongSanPham);
        return $stmt->execute();
    }
}
?>