<?php
include_once '../core/DB.php';

class ThuongHieuModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    // Lấy tất cả thương hiệu
    public function getAllThuongHieu() {
        $result = $this->db->query("SELECT * FROM ThuongHieu WHERE TrangThai = 1");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Lấy thương hiệu theo IdThuongHieu
    public function getThuongHieuById($idThuongHieu) {
        $stmt = $this->db->prepare("SELECT * FROM ThuongHieu WHERE IdThuongHieu = ? AND TrangThai = 1");
        $stmt->bind_param("i", $idThuongHieu);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Thêm thương hiệu mới
    public function addThuongHieu($tenThuongHieu) {
        $stmt = $this->db->prepare("INSERT INTO ThuongHieu (TenThuongHieu, TrangThai) VALUES (?, 1)");
        $stmt->bind_param("s", $tenThuongHieu);
        $stmt->execute();
        return $this->getThuongHieuById($this->db->insert_id);
    }

    // Cập nhật thương hiệu
    public function updateThuongHieu($idThuongHieu, $tenThuongHieu) {
        $stmt = $this->db->prepare("UPDATE ThuongHieu SET TenThuongHieu = ? WHERE IdThuongHieu = ?");
        $stmt->bind_param("si", $tenThuongHieu, $idThuongHieu);
        return $stmt->execute();
    }

    // Hàm kiểm tra xem ThuongHieu có đang được sử dụng trong DongSanPham không
    public function isThuongHieuInUse($idThuongHieu) {
        $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM dongsanpham WHERE IdThuongHieu = ? AND TrangThai = 1");
        $stmt->bind_param("i", $idThuongHieu);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        return $result['count'] > 0;
    }

    // Xóa thương hiệu (ẩn bằng cách đổi trạng thái)
    public function deleteThuongHieu($idThuongHieu) {
        // Kiểm tra xem ThuongHieu có đang được sử dụng không
        if ($this->isThuongHieuInUse($idThuongHieu)) {
            return false; // Không xóa được nếu đang được sử dụng
        }

        $stmt = $this->db->prepare("UPDATE ThuongHieu SET TrangThai = 0 WHERE IdThuongHieu = ?");
        $stmt->bind_param("i", $idThuongHieu);
        return $stmt->execute();
    }
}
?>