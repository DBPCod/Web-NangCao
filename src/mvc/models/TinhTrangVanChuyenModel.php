<?php
include_once '../core/DB.php';

class TinhTrangVanChuyenModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    // Lấy tất cả trạng thái vận chuyển
    public function getAllTinhTrang() {
        $result = $this->db->query("SELECT * FROM TinhTrangVanChuyen");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Lấy trạng thái vận chuyển theo IdTinhTrang
    public function getTinhTrangById($idTinhTrang) {
        $stmt = $this->db->prepare("SELECT * FROM TinhTrangVanChuyen WHERE IdTinhTrang = ?");
        $stmt->bind_param("i", $idTinhTrang);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Thêm trạng thái vận chuyển mới
    public function addTinhTrang($data) {
        $stmt = $this->db->prepare("INSERT INTO TinhTrangVanChuyen (TenTinhTrang) VALUES (?)");
        $stmt->bind_param("s", $data['TenTinhTrang']);
        $stmt->execute();
        return $this->getTinhTrangById($this->db->insert_id);
    }

    // Cập nhật trạng thái vận chuyển
    public function updateTinhTrang($idTinhTrang, $data) {
        $stmt = $this->db->prepare("UPDATE TinhTrangVanChuyen SET TenTinhTrang = ? WHERE IdTinhTrang = ?");
        $stmt->bind_param("si", $data['TenTinhTrang'], $idTinhTrang);
        return $stmt->execute();
    }

    // Xóa trạng thái vận chuyển
    public function deleteTinhTrang($idTinhTrang) {
        $stmt = $this->db->prepare("DELETE FROM TinhTrangVanChuyen WHERE IdTinhTrang = ?");
        $stmt->bind_param("i", $idTinhTrang);
        return $stmt->execute();
    }
}
?>
