<?php
include_once '../core/DB.php';

class CTQuyenModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    public function getAllCTQuyen() {
        $result = $this->db->query("SELECT * FROM ctquyen");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getCTQuyenById($idVaiTro, $idQuyen) {
        $stmt = $this->db->prepare("SELECT * FROM ctquyen WHERE IdVaiTro = ? AND IdQuyen = ?");
        $stmt->bind_param("ii", $idVaiTro, $idQuyen);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function addCTQuyen($data) {
        $stmt = $this->db->prepare("INSERT INTO ctquyen (IdVaiTro, IdQuyen, TrangThai) VALUES (?, ?, ?)");
        $stmt->bind_param("iii", $data['IdVaiTro'], $data['IdQuyen'], $data['TrangThai']);
        $stmt->execute();
        return $this->getCTQuyenById($data['IdVaiTro'], $data['IdQuyen']);
    }

    public function updateCTQuyen($idVaiTro, $idQuyen, $trangThai) {
        $stmt = $this->db->prepare("UPDATE ctquyen SET TrangThai = ? WHERE IdVaiTro = ? AND IdQuyen = ?");
        $stmt->bind_param("iii", $trangThai, $idVaiTro, $idQuyen);
        return $stmt->execute();
    }

    public function deleteCTQuyen($idVaiTro, $idQuyen) {
        $stmt = $this->db->prepare("UPDATE ctquyen SET TrangThai = ? WHERE IdVaiTro = ? AND IdQuyen = ?");
        $TrangThai = 0;  // Đánh dấu đã xóa (ẩn)
        $stmt->bind_param("iii", $TrangThai, $idVaiTro, $idQuyen);
        return $stmt->execute();
    }
}
?>
